module.exports = {
  HTML: function (title, list, body, control) {
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
  },
  list: function (fileList) {
    let list = "<ul>\n";
    fileList.forEach((fileName) => {
      list += `\t<li><a href="/?id=${fileName}">${fileName}</a></li>\n`;
    });
    list += "</ul>";
    return list;
  },
};
