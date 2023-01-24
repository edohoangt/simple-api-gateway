const express = require("express");
const helmet = require("helmet");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(helmet());

app.use("/", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Gateway started on port:", PORT);
});
