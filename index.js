const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";
const staticRoot = path.join(__dirname, "frontend", "dist");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requested = path.resolve(staticRoot, `.${cleanPath}`);

  if (requested.startsWith(staticRoot) && fs.existsSync(requested) && fs.statSync(requested).isFile()) {
    return requested;
  }

  return path.join(staticRoot, "index.html");
}

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const file = resolveFile(request.url || "/");
  const extension = path.extname(file).toLowerCase();

  fs.readFile(file, (error, contents) => {
    if (error) {
      response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Build do frontend indisponível.");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    response.end(contents);
  });
});

server.listen(port, host, () => {
  console.log(`Vozes do Cerrado disponível em http://${host}:${port}`);
});
