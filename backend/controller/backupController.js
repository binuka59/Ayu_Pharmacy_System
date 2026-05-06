import { exec } from "child_process";
import fs from "fs";

export const backupDatabase = (req, res) => {
  const fileName = `backup_${Date.now()}.sql`;
  const dir = "D:/backup";

  // create folder if not exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const backupPath = `${dir}/pharmacy.sql`;

  const command = `"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe" -u root -p"Binu@9876" pharmacy --result-file="${backupPath}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.json({ message: "Backup failed" });
    }
    res.json({ message: "Backup success", file: fileName });
  });
};

export const restoreDatabase = (req, res) => {
  const { fileName } = req.body;
  const backupPath = `D:/backup/pharmacy.sql`;

  const command = `"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p"Binu@9876" pharmacy < "${backupPath}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.json({ message: "Restore failed" });
    }
    res.json({ message: "Restore success" });
  });
};