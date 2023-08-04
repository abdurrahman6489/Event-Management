const express = require("express");
const app = express();
const mongoose = require("mongoose");
const eventRoute = require("./routes/event.js");
const userRoute = require("./routes/user.js");
const authMiddleWare = require("./middleware/auth.js");
app.use(express.json());

app.use("/api/v1/events", authMiddleWare, eventRoute);
app.use("/api/v1/users", userRoute);
const connectDB = async () => {
  // await mongoose.connect("mongodb://127.0.0.1:27017/evnt_mngt");
  await mongoose.connect(
    "mongodb+srv://abdurrahman489:DloqFreHyGnu71nC@cluster0.agiqkwp.mongodb.net/"
  );
};

connectDB()
  .then(() => {
    console.log("connection with Mongodb established");
  })
  .catch((error) => {
    console.error("connection with mongodb was not established ", error);
  });

const port = 5005;
app.listen(port, () => {
  console.log("server is up and running on port ", port);
});
/*
KNHvUm9fM9qonbeE
mongodb+srv://abdurrahman489:<KNHvUm9fM9qonbeE>@cluster0.if5z2vl.mongodb.net/
mongodb+srv://abdurrahman489:DloqFreHyGnu71nC@cluster0.agiqkwp.mongodb.net/
DloqFreHyGnu71nC
*/
