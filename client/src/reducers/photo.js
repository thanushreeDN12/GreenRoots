import { UPLOAD_PHOTO } from "../constants/actionTypes";


const photoReducer=(  state= [], action ) => {

    switch(action.type) {
        case UPLOAD_PHOTO :
            //console.log("inside reducer",action.payload)
            return [...state, action.payload]; // add new photo to existing array
            
        default:
            return state; // <- always return current state if action not handled
    }
}
export default photoReducer