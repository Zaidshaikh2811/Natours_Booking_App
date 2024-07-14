/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1)

})


dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB
  //   ,{
  //    useNewUrlParser: true,
  //    useCreateIndex:true,
  //    useFindAndModify:false
  //  }
).then((con) => {
  // console.log(con.connection);
  console.log(`Database connected successfully`);
}).catch(err => console.log("ERROR"));

const app = require("./app");

const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
  console.log("listening");
});



process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated');
  })
})
