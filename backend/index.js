const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const plaidRoute = require("./routes/plaid");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB CONNECTED")).catch((err) => console.log(err));


app.listen(process.env.PORT || 5000, () => {

    console.log("Server Running");

});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
//   * Route for all Plaid Related Data *
app.use("/api/plaid", plaidRoute);

// * Route for authentication realted functions (Login / Register) *
app.use("/api/auth", authRoute);
