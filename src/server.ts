import Express from "express";
import SocketIO from "socket.io";
import { EventEmitter } from "events";

import BodyParser from 'body-parser';
import Morgan from 'morgan';

import { createServer, Server } from "http";

export class RemoteControlServer extends EventEmitter {
  app?: Express.Application;
  server?: Server;
  io?: SocketIO.Server;

  constructor() {
    super();
  }

  start() {
    this.app = Express();
    this.server = createServer(this.app);
    this.io = SocketIO(this.server);

    this.io.on("connection", () => {
      console.log("Got a connection!");
    });

    this.app.use(Morgan('dev'));
    this.app.use(BodyParser.json());
    this.app.use(Express.static("./public"));

    this.server.listen(process.env.PORT || 5000);
  }

  stop() {}
}
