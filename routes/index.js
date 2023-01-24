const express = require("express");
const axios = require("axios");
const fs = require("fs");

const registry = require("./registry.json");

const router = express.Router();

router.all("/:apiName/:path", (req, res) => {
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path,
      headers: req.headers,
      data: req.body,
    }).then((resp) => {
      res.send(resp.data);
    });
  } else {
    res.send("API Name does not exist.");
  }
});

router.post("/register", (req, res) => {
  const registrationInfo = req.body;

  registrationInfo.url =
    registrationInfo.protocol +
    "://" +
    registrationInfo.host +
    ":" +
    registrationInfo.port +
    "/";

  registry.services[registrationInfo.apiName] = {
    ...registrationInfo,
  };

  fs.writeFile("./routes/registry.json", JSON.stringify(registry), (err) => {
    if (err) {
      res.send("Could not register " + registrationInfo.apiName + ":" + err);
    } else {
      res.send("Successfully register '" + registrationInfo.apiName + "'");
    }
  });
});

module.exports = router;
