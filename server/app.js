const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: ["http://localhost:4200"]
};

app.get("/roster", cors(corsOptions), (req, res) => {
  res.send([
    {
      name: "Joe Mauer",
      age: 36
    },
    {
      name: "Justin Morneau",
      age: 40
    }
  ]);
});

app.listen(9000, () => {
  console.log("App is listening on port 9000");
});
