const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend API is Live 🚀");
});

app.get("/api/data", (req, res) => {
  res.json({
    status: "success",
    message: "Hello Ajay, API working fine"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
