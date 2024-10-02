const mongoose = require('mongoose')
// const { response } = require('express')

//  mongoose.connect(
//   process.env.MONGO_URI || 'mongodb+srv://sieora:Sieora_123@cluster0.v8l4v.mongodb.net/API?retryWrites=true&w=majority',
//   { useNewUrlParser: true}, () => {
//     console.log("we are connected");
//   })
//   .catch((err) => console.log(err)); 

//useUnifiedTopology: true

const URI ='mongodb+srv://yadav:yadav@cluster1.ymy0t.mongodb.net/tentovision?retryWrites=true&w=majority'
// const URI ='mongodb://localhost:27017/tentovision'

const connectDB = async () => {
  try {
      const connection = await mongoose.connect(
          URI,
          {
            //   useCreateIndex: true,
              useNewUrlParser: true,
            //   useFindAndModify: false,
              useUnifiedTopology: true
          }
      )
      console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
      console.log(`MongoDB error when connecting: ${error}`);
  }
}
connectDB()
module.exports = mongoose
