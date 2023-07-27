export const chatMessage = (io) => {
  let activeUsers = [];

  // add a new user
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("new-user-add", (newUserId) => {
      // if user is not in activeUsers array, add them
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          socketId: socket.id,
          userId: newUserId,
        });
      }
      console.log("connected user", activeUsers);

      // send activeUsers array to all users
      io.emit("get-users", activeUsers);
    });

    // send message
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      // console.log("Sending message to: ", receiverId);
      // console.log("Data: ", data);

      if (user) {
        io.to(user.socketId).emit("receive-message", data);
      }
    });

    // remove a user
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
};
