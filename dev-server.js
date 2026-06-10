const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

http
  .createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    const target = path.resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);

    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(target, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Listening on http://127.0.0.1:${port}/`);
  });
