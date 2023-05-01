const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const bp = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv")

const app = express();

dotenv.config()
const port = process.env.PORT || 3050;
const MongoURL = process.env.MONGODB_URL;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());


app.get("/", function (req, res) {
  res.sendStatus(200);
});
app.use("/v1", routes);

mongoose
  .connect(MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.listen(port, () => console.log(`Server started on port ${port}`));
