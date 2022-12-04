const mongoose = require("mongoose");

const uri=process.env.DATABASE

const connect = () => {
  return mongoose.connect(
    // "mongodb+srv://fahadalim:fahadalim@cluster0.wcke0j5.mongodb.net/?retryWrites=true&w=majority"
    uri
  );
};

module.exports = connect;

// wbOn5b3u4tfI18V9


