const DB_NAME = "Chat-Application";
const TOKEN_NAME = "Chat-application-Access-token";

const socketEvents = Object.freeze({
  FRIEND_REQUEST: "friend_request",
  NEW_FRIEND_REQUEST: "new-friend-request",
  REQUEST_SENT: "request-sent",
  ACCEPT_REQUEST: "accept-request",
  REQUEST_ACCEPTED: "request-accepted",
});

module.exports = { DB_NAME, TOKEN_NAME, socketEvents };
