// Only for name or username query
export const getFilteredArray = (query, arr) => {
  if (!query) return arr;
  const pattern = query.split("").join(".*");
  const regex = new RegExp(pattern, "i");
  const filteredArray = arr.filter(
    (el) => regex.test(el.name) || regex.test(el.username)
  );
  return filteredArray;
};

export const getOppositeUserDetails = (loggedinUser, participants) => {
  return participants[0]._id === loggedinUser.userId
    ? participants[1]
    : participants[0];
};

export const getAdminDetails = (adminId, participants) => {
  for (let i = 0; i < participants.length; i++) {
    if (participants[i]._id === adminId) {
      return participants[i];
    }
  }
  return {};
};

export const rearangeParticipants = (loggedinUser, adminId, participants) => {
  let admin;
  const remainingParticipants = [];
  participants.forEach((el) => {
    if (el._id !== adminId && el._id !== loggedinUser.userId) {
      remainingParticipants.push(el);
    } else if (el._id === adminId) {
      admin = el;
    }
  });
  const youAndAdmin =
    loggedinUser?.userId == admin?._id ? [admin] : [loggedinUser, admin];
  return [...youAndAdmin, ...remainingParticipants];
};
