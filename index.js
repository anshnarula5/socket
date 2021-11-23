const PORT = process.env.PORT || 8000

const io = require("socket.io")(PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send recieve message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getMessage", {senderId, text})
  })
    
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
  });
});

//   let users = [];

//   const getUser = (userId) => {
//     return users.find((user) => user.userId === userId);
//   };

//   io.on("connection", (socket) => {
//     //when ceonnect
//     console.log("a user connected.");

//     //take userId and socketId from user
//     socket.on("addUser", (userId) => {
//       addUser(userId, socket.id);
//       io.emit("getUsers", users);
//     });

//     //send and get message
//       socket.on("sendMessage", ({senderId, receiverId, text}) => {
//       const user = getUser(receiverId);
//       io.to(user.socketId).emit("getMessage", {
//         senderId,
//         text,
//       });
//     });

//     //when disconnect
//     socket.on("disconnect", () => {
//       console.log("a user disconnected!");
//       removeUser(socket.id);
//       io.emit("getUsers", users);
//     });
//   });
