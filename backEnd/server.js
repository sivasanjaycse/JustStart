const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
