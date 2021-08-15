const device = require("./device");

module.exports = (server) => {
  server.get("/api", (req, res) => {
    res
      .status(200)
      .send({
        message:
          "Welcome to the api end-point",
      });
  });
  server.use("/api/device", device);
};
