import { UPDATE_USER, GET_USER} from "../constants/actionTypes";
const initialState = null;

const userReducer=(  state= [], action ) => {

    switch(action.type) {
    case GET_USER:
      return action.payload; // replace state with user data

    case UPDATE_USER:
      return { ...state, ...action.payload }; // merge updates into current state

    default:
      return state;
}
}
export default userReducer