const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("Setting up proxy");

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://api:9000",
      changeOrigin: true,
    })
  );

  app.use(
    "/files",
    createProxyMiddleware({
      target: "http://api:9000/data",
      changeOrigin: true,
      pathRewrite: {
        "^/files": "",
      },
    })
  );
};
