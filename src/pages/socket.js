import io from "socket.io-client";

class SocketService {
    socket;

   connect(url) {
    return new Promise((rs, rj) => {
      this.socket = io(url, {
        transports: ["websocket", "polling"],
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
      });

      console.log(this.socket);

      if (!this.socket) return rj();

      this.socket.on("connect", () => {
        rs(this.socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log("Connection error: ", err);
        rj(err);
      });
    });
  }

    disconnectSocket = () => {
    this.socket.disconnect();
  };
}

export default new SocketService();
