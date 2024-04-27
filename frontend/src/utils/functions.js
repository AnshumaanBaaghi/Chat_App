export const modifyUsersList = (
  newUsers,
  friends,
  sentRequests,
  friendRequests
) => {
  const arr1 = newUsers.map((el) => ({ type: "newUser", user: el }));
  const arr2 = friends.map((el) => ({ type: "friend", user: el }));
  const arr3 = sentRequests.map((el) => ({ type: "sentRequest", user: el }));
  const arr4 = friendRequests.map((el) => ({
    type: "friendRequest",
    user: el,
  }));
  return [...arr1, ...arr2, ...arr3, ...arr4];
};
