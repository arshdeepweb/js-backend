import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import logger from "./logger.js";
import morgan from "morgan";

const app = express()
const morganFormat = ":method :url :status :response-time ms";

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


//routes import


//routes declaration
app.get('/',(req, res)=>{
    logger.info("This is an info message");
    logger.warn("This is an info message");
    logger.error("This is an info message");
    res.send("Server is Running")
})


// http://localhost:8000/api/v1/users/register

export { app }