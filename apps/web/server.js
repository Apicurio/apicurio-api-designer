/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const express = require("express");
const app = express();
const port = 9009;

app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
app.listen(port, () => console.log(`Listening on port ${port}`));
