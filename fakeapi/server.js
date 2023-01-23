const express = require("express");

const app = express();

app.use(express.json());

app.get("/fakeapi", (req, res, next) => {
  res.send("hello from fake server");
});

app.get("/bogusapi", (req, res, next) => {
  res.send("hello from bogus api");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Fake server started on port:", PORT);
});
