// fire base only
import functions from "firebase-functions";
// fire base only

import mongoose from "mongoose";
import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();

//  routes
import main from "./routes/main.js";
import Admin from "./routes/admin.js";

const DB =
  "mongodb+srv://vishu7im:teranaam.im7@cluster0.4tmteql.mongodb.net/gbn";

const app = Express();
const PORT = process.env.PORT || 5000;
app.use(
  bodyParser.json({
    extended: true,
    limit: "50mb",
  })
);
app.use(Express.json());
app.use(cors());

//  routes
app.use(main);
app.get("/", (req, res) => {
  res.send("server");
});
app.use("/admin", Admin);

mongoose.set("strictQuery", false);
mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`connection success ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });

export const GBN = functions.https.onRequest(app);
