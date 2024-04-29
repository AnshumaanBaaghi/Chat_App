//  <--------------------- Emitting Events ------------------------>
export const sendFriendRequest = (socket, receiver_id, loggedInUser_id) => {
  socket.emit("friend_request", { to: receiver_id, from: loggedInUser_id });
};

export const acceptFriendRequest = (socket, requestId) => {
  socket.emit("accept-request", { requestId });
};
