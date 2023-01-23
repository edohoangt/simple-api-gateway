const express = require("express");
const axios = require("axios");

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

module.exports = router;
