export const UPDATEUSERDETAIL = "UPDATEUSERDETAIL";

export const updateUserDetail = (data) => {
  return { type: UPDATEUSERDETAIL, payload: data };
};
