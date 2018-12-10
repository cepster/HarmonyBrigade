const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;

const dbUrl =
  "mongodb://admin:barbershop1@ds139362.mlab.com:39362/harmonybrigade";

const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: ["http://localhost:4200"]
};

app.get("/roster", cors(corsOptions), (req, res) => {
  mongo.connect(
    dbUrl,
    (err, client) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      client
        .db()
        .collection("roster")
        .find()
        .toArray((queryErr, result) => {
          if (queryErr) {
            res.status(500).send(queryErr);
            return;
          }

          res.status(200).send(result);
        });
    }
  );
});

app.options("/roster", cors());
app.post("/roster", cors(corsOptions), (req, res) => {
  mongo.connect(
    dbUrl,
    (err, client) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      client
        .db()
        .collection("roster")
        .remove();
      client
        .db()
        .collection("roster")
        .insertMany(req.body, () => {
          res.status(200).send();
          client.close();
        });
    }
  );
});

app.listen(9000, () => {
  console.log("App is listening on port 9000");
});
