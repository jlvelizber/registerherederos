import express, { Application } from "express";
import logger from "pino-http";
import dontenv from "dotenv";
import routes from "./src/routes";
import cors from "cors";
import { Server as ServerHttp, createServer } from "http";
import { Server } from "socket.io";
import { QrReaderEvent } from "./src/events";
const PORT = process.env.PORT || 3000;

const defaultSocketOptions = {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
  }
}

export default class App {

  app: Application;
  http: ServerHttp;
  io: Server;

  constructor() {
    dontenv.config();
    this.app = express();
    this.http = createServer(this.app);
    this.io = new Server(this.http, defaultSocketOptions)

    this.#init()
  }

  #init() {
    this.#initCors()
    this.#configRequest()
    this.#configRouter()
    this.#initSockets()
    this.#run()
  }

  #initCors() {
    this.app.use(cors());
  }

  #configRequest() {
    this.app.use(express.json())
    this.app.use(logger())
    this.app.use(express.static("public"))
  }

  #configRouter() {
    this.app.use('/api/v2/', routes)
  }

  #initSockets() {
    this.io.on('connection', QrReaderEvent)
  }

  #run() {
    this.http.listen(PORT, () => console.log(`Conectado desde el puerto ${PORT}`))
  }

}