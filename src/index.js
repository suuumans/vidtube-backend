import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/index.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDb connection failed", error);
    process.exit(1);
})