const express = require("express");
const app = express();

app.use(require("cors")());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(global);
  res.send("Welcome to Binge Watch🍿 Api!!");
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

require("./Controllers/Control")(io);
