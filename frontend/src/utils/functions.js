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
    loggedinUser?.userId == admin?._id
      ? [admin]
      : [{ ...loggedinUser, _id: loggedinUser.userId }, admin];
  return [...youAndAdmin, ...remainingParticipants];
};

export const timeConverter = (inputTime) => {
  // This function converts "2024-05-30T19:59:33.206Z" (UTC) to "01:29 AM" (IST)
  const dateObj = new Date(inputTime);

  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedTime = dateObj.toLocaleString("en-US", options);

  return formattedTime;
};

export const dateConverter = (inputTime) => {
  // This function converts "2024-05-30T19:59:33.206Z" (UTC) to IST date
  const dateObj = new Date(inputTime);

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = dateObj.toLocaleDateString("en-GB", options);

  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-GB", options);
  if (formattedDate === formattedToday) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = yesterday.toLocaleDateString("en-GB", options);
  if (formattedDate === formattedYesterday) return "Yesterday";

  // Check if the date is within the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (dateObj >= oneWeekAgo) {
    // Return the day of the week
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dateObj.getDay()];
  }

  return formattedDate;
};
