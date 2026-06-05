import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "dist/public")));

app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
