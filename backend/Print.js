const express = require("express");
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const app = express();
app.use(express.json());

// Auto print bill API
app.post("/api/print-bill", async (req, res) => {
  const { billNo, totalAmount, cartitems, cash, balance } = req.body;

  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'printer:Your_Printer_Name' // USB, network, or installed printer
  });

  try {
    printer.println("Ayu Pharmacy");
    printer.println("Colombo Road, Pothuhera");
    printer.println("037-3456789 / 0774567890");
    printer.println(`Bill No: ${billNo}`);
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.println("Name          Size  Qty  Price  Amount");
    printer.println("----------------------------------------");

    cartitems.forEach(item => {
    // Pad strings so columns align
    const name = item.iname.padEnd(12, ' '); // 12 char for Name
    const size = item.size.toString().padEnd(5, ' ');
    const qty = item.quantity.toString().padEnd(4, ' ');
    const price = item.price.toFixed(2).padEnd(6, ' ');
    const amount = item.amount.toFixed(2).padEnd(6, ' ');

    printer.println(`${name}${size}${qty}${price}${amount}`);
    });

    printer.println("----------------------------------------");
    printer.println(`Total: ${totalAmount.toFixed(2)}`);
    printer.println(`Cash: ${cash.toFixed(2)}`);
    printer.println(`Balance: ${balance.toFixed(2)}`);
    printer.println("----------------------------------------");
    printer.println("Thank you, come again!");
    printer.cut();

    await printer.execute(); // sends directly to printer

    res.json({ message: "Bill printed successfully!" });
  } catch (err) {
    console.error("Print error:", err);
    res.status(500).json({ error: "Printing failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));