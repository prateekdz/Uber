const mongoose = require('mongoose');

function connectToDb() {
  const uri = process.env.DB_CONNECT;

  if (!uri) {
    console.error("❌ DB_CONNECT is not set in .env file");
    return;
  }

  mongoose.connect(uri)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
    });
}

module.exports = connectToDb;
