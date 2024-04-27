const initialVal = { socket: null, isConnected: false };

export const socketReducer = (state = initialVal, { type, payload }) => {
  switch (type) {
    case "SOCKET":
      return { ...state, isConnected: true, socket: payload };

    default:
      return state;
  }
};
