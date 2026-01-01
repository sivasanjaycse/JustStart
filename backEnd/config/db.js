const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sivasanjaidisco_db_user:Yajnas_Avis2005@cluster0.phzlk1k.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
