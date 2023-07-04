const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routing/user-routes');
const postRouter = require('./routing/post-router');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();
const Port=process.env.Port || 5000;

app.use(cors());
app.use(express.json());
app.use("/user",userRouter);
app.use("/posts",postRouter);


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
  .then(() => app.listen(Port, () => console.log('Connection successful & listening to the port 5000')))
  .catch((err) => console.log(err));
