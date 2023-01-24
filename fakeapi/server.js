const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/fakeapi", (req, res, next) => {
  res.send("hello from fake server");
});

app.get("/bogusapi", (req, res, next) => {
  res.send("hello from bogus api");
});

const HOST = "localhost";
const PORT = 3002;
app.listen(PORT, (req, res) => {
  axios({
    method: "POST",
    url: "http://localhost:3000/register",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      apiName: "registrytest",
      host: HOST,
      port: PORT,
      protocol: "http",
    },
  }).then((resp) => {
    console.log(resp.data);
  });
  console.log("Fake server started on port:", PORT);
});
