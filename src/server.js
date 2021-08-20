import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mediaRouter from "./services/media/index.js"
import { notFoundErrorHandler, forbiddenErrorHandler, badRequestErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"

const server = express();

const port = process.env.PORT;

server.use(cors())

server.use(express.json()) //this comes before the routes
// **************** ROUTES *******************
server.use("/media", mediaRouter)

// **************** ERROR MIDDLEWARES *******************
server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running at ${port}/`);
});