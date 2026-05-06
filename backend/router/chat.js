import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import csv from "csv-parser";
import stringSimilarity from "string-similarity";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ================= CHAT MEMORY ================= */
const chatMemory = {};

/* ================= CSV LOAD ================= */
let medicines = [];

fs.createReadStream("./medicines.csv")
  .pipe(csv())
  .on("data", (row) => {
    medicines.push({
      name: (row.Name || row.name || "").toLowerCase().trim(),
      uses: row.Uses,
      warnings: row.Warnings,
      sideEffects: row["Side Effects"],
      type: row.Type,
      dose: row.Dose
    });
  });

/* ================= IMAGE PREPROCESS ================= */
const preprocessImage = async (inputPath) => {
  const outputPath = inputPath + "_processed.png";

  await sharp(inputPath)
    .rotate()
    .resize({ width: 1200 })
    .grayscale()
    .normalize()
    .sharpen()
    .threshold(150)
    .toFile(outputPath);

  return outputPath;
};

/* ================= OCR ================= */
const extractTextFromImage = async (imagePath) => {
  const { data } = await Tesseract.recognize(imagePath, "eng", {
    logger: () => {}
  });

  return data.text;
};

/* ================= CLEAN TEXT ================= */
const cleanText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 2);
};

/* ================= FDA API ================= */
const getFromFDA = async (name) => {
  try {
    const res = await axios.get(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(name)}&limit=1`
    );

    const d = res.data.results?.[0];
    if (!d) return null;

    return {
      name,
      uses: d.indications_and_usage?.[0] || "Not available",
      warnings: d.warnings?.[0] || "Consult doctor",
      sideEffects: d.adverse_reactions?.[0] || "Not available"
    };
  } catch {
    return null;
  }
};

/* ================= REPLY BUILDER ================= */
const buildReply = (m, intent) => {
  if (!m) return "No data found";

  if (intent === "uses") {
    return `💊 ${m.name}\n\n🩺 Uses:\n${m.uses}`;
  }

  if (intent === "warning") {
    return `💊 ${m.name}\n\n⚠️ Warnings:\n${m.warnings || "Not available"}`;
  }

  if (intent === "sideEffect") {
    return `💊 ${m.name}💉 Side Effects:\n\n\n${m.sideEffects}`;
  }

  return `
💊 Medicine: ${m.name}

🩺 Uses:
${m.uses}

⚠️ Warnings:
${m.warnings}

💉 Side Effects:
${m.sideEffects}

📌 NOTE:
Consult a doctor before use.
`;
};

/* ================= ROUTE ================= */
router.post("/chats", upload.single("image"), async (req, res) => {
  try {
    let message = req.body?.message || "";
    const userId = req.body.userId || "defaultUser";

    /* ================= MEMORY INIT ================= */
    if (!chatMemory[userId]) {
      chatMemory[userId] = [];
    }

    /* ================= OCR ================= */
    if (req.file) {
      const processed = await preprocessImage(req.file.path);
      const ocrText = await extractTextFromImage(processed);
      message += " " + ocrText;
    }

    if (!message.trim()) {
      return res.json({ reply: "Please enter medicine name or upload image." });
    }

    const normalizedMessage = message.toLowerCase().trim();
    const words = cleanText(message);

    /* ================= SAVE USER MESSAGE ================= */
    chatMemory[userId].push({ role: "user", message });

    /* ================= GREETINGS ================= */
    const greetings = ["hi", "hello", "hey"];

    if (greetings.some(g => normalizedMessage.includes(g))) {
      const reply = "Hi 👋 I'm Ayu AI Assistant. Ask me about medicines.";

      chatMemory[userId].push({ role: "bot", message: reply });

      return res.json({
        success: true,
        reply,
        history: chatMemory[userId]
      });
    }

    /* ================= INTENT ================= */
    let intent = null;
    const usesTags = ["use", "why"];
    const WarningTags = ["warning"];
    const EffectTags = [ "effect", "side effect"];

    if (usesTags.some(g => normalizedMessage.includes(g))) {
      intent = "uses";
    } else if (WarningTags.some(g => normalizedMessage.includes(g))) {
      intent = "warning";
    } else if (EffectTags.some(g => normalizedMessage.includes(g))) {
      intent = "sideEffect";
    }

    /* ================= MATCHING ================= */
    let medicine = null;
    let bestScore = 0;
    let bestMatch = null;

    for (let med of medicines) {
      const name = med.name;

      let score = 0;

      for (let w of words) {
        if (name.includes(w)) score++;
      }

      if (name.includes(words.join(" "))) score += 5;

      let fuzzyScore = 0;
      for (let w of words) {
        const s = stringSimilarity.compareTwoStrings(name, w);
        fuzzyScore = Math.max(fuzzyScore, s);
      }

      const finalScore = score + fuzzyScore * 2;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMatch = med;
      }
    }

    if (bestScore >= 1.5) {
      medicine = bestMatch;
    }

    /* ================= FDA FALLBACK ================= */
    if (!medicine) {
      for (let w of words) {
        medicine = await getFromFDA(w);
        if (medicine) break;
      }
    }

    /* ================= NOT FOUND ================= */
    if (!medicine) {
      const reply = "🤖 Medicine not found. Try clearer input.";

      chatMemory[userId].push({ role: "bot", message: reply });

      return res.json({
        medicine: null,
        reply,
        history: chatMemory[userId]
      });
    }

    /* ================= FINAL RESPONSE ================= */
    const reply = buildReply(medicine, intent);

    chatMemory[userId].push({ role: "bot", message: reply });

    return res.json({
      medicine,
      reply,
      history: chatMemory[userId]
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

export default router;