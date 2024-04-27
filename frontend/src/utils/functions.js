export const exploreUsersList = (
  newUsers,
  friends,
  sentRequests,
  friendRequests
) => {
  console.log("newUsers:", newUsers);
  const users = [];

  // Get newUsers to whom we haven't sent Friend Request
  for (let i = 0; i < newUsers.length; i++) {
    let user = newUsers[i];
    let alreadyExist = false;
    for (let j = 0; j < sentRequests.length; j++) {
      let user2 = sentRequests[j];
      if (user._id == user2._id) {
        alreadyExist = true;
        break;
      }
    }
    if (!alreadyExist) {
      users.push({ type: "newUser", user });
    }
  }
  console.log("users:", users);

  // Get newUsers from whom we haven't received Friend Request
  for (let i = 0; i < users.length; i++) {
    let user = users[i].user;
    let alreadyExist = false;
    for (let j = 0; j < friendRequests.length; j++) {
      let user2 = friendRequests[j];
      if (user._id == user2._id) {
        alreadyExist = true;
        break;
      }
    }
    if (!alreadyExist) {
      users.push({ type: "newUser", user });
    }
  }
  console.log("users:", users);

  /*
  // Push friend requests, sent requests, and friends into users array
  for (let i = 0; i < friendRequests.length; i++) {
    let user = friendRequests[i];
    users.push({ type: "friendRequests", user });
  }

  for (let i = 0; i < sentRequests.length; i++) {
    let user = sentRequests[i];
    users.push({ type: "sentRequests", user });
  }

  for (let i = 0; i < friends.length; i++) {
    let user = friends[i];
    users.push({ type: "friends", user });
  }
*/
  return users;
};
