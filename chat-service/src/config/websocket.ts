import { Server } from "socket.io";
import http from "http";

export class WebSocket extends Server {
  private static io: WebSocket;

  constructor(httpServer: http.Server) {
    super(httpServer, {
      cors: {
        origin: ["*"],
        methods: ["*"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      },
      path: '/chat-socket/socket.io',
      allowEIO3: true,
    });
  }
  public static getInstance(httpServer?: http.Server): WebSocket {
    if (!WebSocket.io && httpServer) {
      WebSocket.io = new WebSocket(httpServer);
    }
    return WebSocket.io;
  }
}
