import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "config.json");
const PORT = 3000;

const server = http.createServer((req, res) => {
  // Serve the UI page
  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(path.join(__dirname, "public", "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  // Return current config
  if (req.method === "GET" && req.url === "/config") {
    const config = fs.readFileSync(CONFIG_PATH, "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(config);
    return;
  }

  // Update config
  if (req.method === "POST" && req.url === "/update") {
    let body = "";

    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      try {
        const newConfig = JSON.parse(body);

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));

        console.log("✅ config.json updated!");

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({ success: true }));

      } catch (err) {

        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          success: false,
          error: err.message
        }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`🚀 Config UI running at http://localhost:${PORT}`);
});