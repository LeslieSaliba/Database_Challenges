const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.send("This is working!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});