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

  if (apiAlreadyExists(registrationInfo)) {
    res.send(
      "Config already exists for '" +
        registrationInfo.apiName +
        "' at '" +
        registrationInfo.url +
        "'"
    );
  } else {
    registry.services[registrationInfo.apiName].push({
      ...registrationInfo,
    });

    fs.writeFile("./routes/registry.json", JSON.stringify(registry), (err) => {
      if (err) {
        res.send("Could not register " + registrationInfo.apiName + ":" + err);
      } else {
        res.send("Successfully register '" + registrationInfo.apiName + "'");
      }
    });
  }
});

router.post("unregister", (req, res) => {
  const registrationInfo = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registry.services[registrationInfo.apiName].findIndex(
      (instance) => registrationInfo.url === instance.url
    );
    registry.services[registrationInfo.apiName].splice(index, 1);

    fs.writeFile("./routes/registry.json", JSON.stringify(registry), (err) => {
      if (err) {
        res.send(
          "Could not unregister " + registrationInfo.apiName + ":" + err
        );
      } else {
        res.send("Successfully unregister '" + registrationInfo.apiName + "'");
      }
    });
  } else {
    "Config does not exist for '" +
      registrationInfo.apiName +
      "' at '" +
      registrationInfo.url +
      "'";
  }
});

function apiAlreadyExists(registrationInfo) {
  let exists = false;

  registry.services[registrationInfo.apiName].forEach((instance) => {
    if (instance.url === registrationInfo.url) {
      exists = true;
      return;
    }
  });

  return exists;
}

module.exports = router;
