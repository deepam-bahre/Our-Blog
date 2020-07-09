// =================================================
//  DATABASE CONNECTION
// =================================================

const mongoose = require("mongoose");

/*
--------------For Local--------------
mongoose
    .connect(
        process.env.MONGODB_LOCAL_URI,
        { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });

*/

/*--------------For Cloud--------------*/
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
.then(() => {
  console.log("database connected successfully");
})
.catch((err) => {
  console.log(err.message);
});
