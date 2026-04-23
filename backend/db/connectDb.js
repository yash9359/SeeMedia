import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL || "");

        console.log("Connected Database successfully: ", dbConnection.connection.host);

    } catch (error) {

        console.log("Connection failed to Mongodb: ",error);

        process.exit(1);


    }
}

export default connectDb;