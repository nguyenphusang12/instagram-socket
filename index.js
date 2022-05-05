const { Server } = require("socket.io");
const PORT = process.env.PORT || 9999;
const io = new Server(PORT, {
  cors: {
    origin: "https://sang-instagram-fake.netlify.app",
  },
});
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  } else {
    const newUser = users.filter((u) => u.userId !== userId);
    users = newUser;
    users.push({ userId, socketId });
  }
};
const getUser = (userId) => {
  const user = users.find((u) => u.userId === userId);
  return user;
};
const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("addUser", (data) => addUser(data, socket.id));
  socket.on("sendMessage", ({ recevierId, messages }) => {
    const user = getUser(recevierId);
    if (user) {
      io.to(user.socketId).emit("arrivalMessage", {
        messages,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    removeUser(socket.id);
  });
});
