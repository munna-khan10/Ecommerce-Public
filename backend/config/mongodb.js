// import mongoose from "mongoose";

// const connectDB = async () => {

//     mongoose.connection.on('connected', ()=> {
//         console.log("Mongoose connected to DB");
        
//     })

//     await mongoose.connect(`${process.env.MONCOBD_URL}/e-commerce`)

// }

// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URL)
    console.log("MongoDB Connected")
  } catch (error) {
    console.log(error)
  }
}

export default connectDB;