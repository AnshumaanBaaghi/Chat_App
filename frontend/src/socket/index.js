//  <--------------------- Emitting Events ------------------------>
export const sendFriendRequest = (socket, receiver_id, loggedInUser_id) => {
  console.log("request sent");
  socket.emit("friend_request", { to: receiver_id, from: loggedInUser_id });
};
