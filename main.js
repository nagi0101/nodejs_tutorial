const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname == "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", "utf-8", (err, fileList) => {
        let list = "<ul>";
        fileList.forEach((fileName) => {
          list += `<li><a href="/?id=${fileName}">${fileName}</a></li>`;
        });
        list += "</ul>";

        const title = "Welcome";
        const description = "Hello, Node.js";
        const template = `
        <!doctype html>
        <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", "utf-8", (err, fileList) => {
        let list = "<ul>";
        fileList.forEach((fileName) => {
          list += `<li><a href="/?id=${fileName}">${fileName}</a></li>`;
        });
        list += "</ul>";
        fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
          const title = queryData.id;
          const template = `
          <!doctype html>
          <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
          </html>
        `;
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("not found");
  }
});
app.listen(3000);
