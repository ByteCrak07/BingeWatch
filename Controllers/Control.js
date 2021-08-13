const ControlSockets = (io) => {
  io.use((socket, next) => {
    try {
      const user = socket.handshake.query.Username;
      socket.Username = user;
      next();
    } catch {}
  });

  io.on("connection", (socket) => {
    console.log("Connected: " + socket.Username);

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.Username);
    });

    //sockets
    socket.on("createRoom", ({ RoomId }) => {
      if (!io.sockets.adapter.rooms.get(RoomId)) {
        socket.join(RoomId);
        console.log("A User has created room: " + RoomId);
        io.emit("createRoomconf", { conf: true });
      } else {
        io.emit("createRoomconf", { conf: false });
        console.log("Room already exists");
      }
    });

    socket.on("joinRoom", ({ RoomId }) => {
      if (!io.sockets.adapter.rooms.get(RoomId)) {
        io.emit("joinRoomconf", { conf: false });
        console.log("No such room");
      } else {
        socket.join(RoomId);
        io.emit("joinRoomconf", { conf: true });
        console.log("A User has joined room: " + RoomId);
      }
    });

    //chatsockets
    // socket.on("Newmessage", ({ RoomId, username, message }) => {
    //   const Newmessage = { username, message };
    //   io.to(RoomId).emit("newMessage", Newmessage);
    // });
  });

  io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
  });
};

module.exports = ControlSockets;
