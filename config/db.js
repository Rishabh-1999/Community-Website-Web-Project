const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("debug", true);

mongoose.connect(
  process.env.DB_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB connected");
    } else {
      console.log("Error: " + err);
    }
  }
);