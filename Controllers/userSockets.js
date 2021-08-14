const { iconList, iconLen } = require("../assets/icons");
// users count
var usersCount = 0;

const returnAudience = (userIds, allUsers) => {
  const dataArray = [];
  userIds.forEach((id) => {
    if (allUsers[id]) dataArray.push(allUsers[id]);
  });
  return dataArray;
};

const ControlSockets = (io, roomData, audienceData) => {
  io.on("connection", (socket) => {
    usersCount++;
    audienceData[socket.id] = {
      name: socket.Username,
      icon: iconList[usersCount % iconLen],
    };
    console.log("Connected: " + socket.Username);

    socket.on("disconnecting", () => {
      let rooms = socket.rooms;
      usersCount--;
      delete audienceData[socket.id];

      rooms.forEach((room) => {
        let currentUsers = returnAudience(
          io.sockets.adapter.rooms.get(room),
          audienceData
        );
        io.to(room).emit("byeFriend", {
          name: socket.Username,
          currentUsers,
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.Username);
    });

    //sockets
    socket.on("checkRoom", ({ RoomId }) => {
      if (!io.sockets.adapter.rooms.get(RoomId)) {
        io.emit("checkRoomconf", { conf: true });
        console.log(`New room ${RoomId} available`);
      } else {
        io.emit("checkRoomconf", { conf: false });
        console.log("Room already exists");
      }
    });

    socket.on("createRoom", ({ RoomId, Name }) => {
      if (!io.sockets.adapter.rooms.get(RoomId)) {
        socket.join(RoomId);
        console.log("A User has created room: " + RoomId);
        roomData[RoomId] = { Name, Audience: [socket.Username] };
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
        let currentUsers = returnAudience(
          io.sockets.adapter.rooms.get(RoomId),
          audienceData
        );
        io.to(RoomId).emit("welcomeFriends", {
          name: socket.Username,
          currentUsers,
        });
        console.log("A User has joined room: " + RoomId);
      }
    });

    socket.on("leaveRoom", ({ RoomId }) => {
      socket.leave(RoomId);
      console.log("A User has left room: " + RoomId);
      let currentUsers = returnAudience(
        io.sockets.adapter.rooms.get(RoomId),
        audienceData
      );
      io.to(RoomId).emit("byeFriend", {
        name: socket.Username,
        currentUsers,
      });
    });

    //chatsockets
    // socket.on("Newmessage", ({ RoomId, username, message }) => {
    //   const Newmessage = { username, message };
    //   io.to(RoomId).emit("newMessage", Newmessage);
    // });
  });

  io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    delete roomData[room];
  });
};

module.exports = ControlSockets;
