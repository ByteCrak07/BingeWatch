const express = require("express");
const app = express();

app.use(require("cors")());
app.use(express.json());

const roomData = [];
const audienceData = {};

app.get("/", (req, res) => {
  res.send("Welcome to Binge Watch🍿 Api!!");
});

app.get("/room", (req, res) => {
  const roomId = req.query.id;
  if (roomData[roomId]) res.send({ data: roomData[roomId].Name });
  else res.status(404).send({ data: "No room" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  try {
    const user = socket.handshake.query.Username;
    socket.Username = user;
    next();
  } catch {}
});

require("./Controllers/sockets")(io, roomData, audienceData);
