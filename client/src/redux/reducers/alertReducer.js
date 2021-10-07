import * as types from "../constants/alertConstants";

const initialState = [];

// the action object typically contains 2 things: action type (mandatory) & payload (optional)
const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_ALERT:
      return [...state, payload];

    case types.REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);

    default:
      return state;
  }
};

export default alertReducer;
