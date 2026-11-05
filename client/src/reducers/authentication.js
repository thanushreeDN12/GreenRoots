import { ADDPROGRAM,FETCH_ALL_PROGRAMS, AUTHENTICATION, LOGOUT } from "../constants/actionTypes";

const authenticationReducer = (state = { authData: null }, action) => {
    switch (action.type) {

        case AUTHENTICATION:
            //localStorage.setItem('isLogin', 'true');
            // localStorage.setItem('user', JSON.stringify(action.data));
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            return {
                ...state,
                authData: action?.data
            }
            
        case LOGOUT:
            localStorage.clear();

            return {
                ...state,
                authData: null
            }

        default:
            return state;
    }
}

// const featureReducer=(  state= [], action ) => {
//     switch(action.type) {
//         case FETCH_ALL_PROGRAMS :
//             //console.log("inside reducer",action.payload)
//             return action.payload  //replaces [] with all programs

//         case ADDPROGRAM : 
//             return[ ...state, action.data]

//     }
// }
export default authenticationReducer;