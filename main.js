const http = require("http");
const fs = require("fs");
const url = require("url");

function templateHTML(title, list, body) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <a href="/create">create</a>
        ${body}
      </body>
    </html>
  `;
}

function templateList(fileList) {
  let list = "<ul>\n";
  fileList.forEach((fileName) => {
    list += `\t<li><a href="/?id=${fileName}">${fileName}</a></li>\n`;
  });
  list += "</ul>";
  return list;
}

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  fs.readdir("./data", "utf-8", (err, fileList) => {
    if (pathname === "/") {
      if (queryData.id === undefined) {
        const title = "Welcome";
        const description = "Hello, Node.js";
        const list = templateList(fileList);
        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2><p>${description}</p>`
        );
        response.writeHead(200);
        response.end(template);
      } else {
        fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
          const title = queryData.id;
          const list = templateList(fileList);
          const template = templateHTML(
            title,
            list,
            `<h2>${title}</h2><p>${description}</p>`
          );
          response.writeHead(200);
          response.end(template);
        });
      }
    } else if (pathname === "/create") {
      const title = "WEB - create";
      const list = templateList(fileList);
      const template = templateHTML(
        title,
        list,
        `
        <form action="/process_create" method="POST">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    } else {
      console.log(pathname);
      response.writeHead(404);
      response.end("not found");
    }
  });
});
app.listen(3000);
