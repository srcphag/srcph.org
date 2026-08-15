module.exports = {
  port: 3000,
  server: {
    baseDir: "./",
    middleware: [
      function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
      }
    ]
  },
  files: ["css/**/*", "js/**/*", "assets/**/*"],
  open: false,
  notify: false,
  ghostMode: false,
  snippet: false
};
