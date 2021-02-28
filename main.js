const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body, control) {
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
        ${control}
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
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`
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
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
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
        <form action="/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    } else if (pathname === "/create_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;
        fs.writeFile(`./data/${title}`, description, "utf8", (error) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    } else if (pathname === "/update") {
      fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
        const title = queryData.id;
        const list = templateList(fileList);
        const template = templateHTML(
          title,
          list,
          `
          <form action="/update_process" method="POST">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      console.log(pathname);
      response.writeHead(404);
      response.end("not found");
    }
  });
});
app.listen(3000);
