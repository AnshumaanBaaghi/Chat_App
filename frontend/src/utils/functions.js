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
