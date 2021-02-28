const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const sanitizeHtml = require("sanitize-html");

const path = require("path");

const template = require("./lib/template.js");

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  fs.readdir("./data", "utf-8", (err, fileList) => {
    let filteredId;
    if (queryData.id !== undefined) {
      filteredId = path.parse(queryData.id).base;
    } else {
      filteredId = undefined;
    }
    if (pathname === "/") {
      if (filteredId === undefined) {
        const title = "Welcome";
        const description = "Hello, Node.js";
        const list = template.list(fileList);
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      } else {
        fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
          const title = filteredId;
          const sanitizedDescription = sanitizeHtml(description);
          const list = template.list(fileList);
          const html = template.HTML(
            title,
            list,
            `<h2>${title}</h2><p>${sanitizedDescription}</p>`,
            ` <a href="/create">create</a> 
              <a href="/update?id=${title}">update</a>
              <form action="/delete_process?id=${title}" method="POST" onsubmit="
                return confirm('정말로 삭제하시겠습니까?')
              ">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
              `
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    } else if (pathname === "/create") {
      const title = "WEB - create";
      const list = template.list(fileList);
      const html = template.HTML(
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
      response.end(html);
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
      fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
        const title = filteredId;
        const list = template.list(fileList);
        const html = template.HTML(
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
          ` <a href="/create">create</a> 
            <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else if (pathname === "/update_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;
        fs.rename(`./data/${id}`, `./data/${title}`, (renameError) => {
          fs.writeFile(
            `./data/${title}`,
            description,
            "utf8",
            (writeFileError) => {
              response.writeHead(302, { Location: `/?id=${title}` });
              response.end();
            }
          );
        });
      });
    } else if (pathname === "/delete_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const post = qs.parse(body);
        const id = post.id;
        const filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, (error) => {
          response.writeHead(302, { Location: "/" });
          response.end();
        });
      });
    } else {
      console.log(pathname);
      response.writeHead(404);
      response.end("not found");
    }
  });
});
app.listen(3000);
