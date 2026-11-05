import { combineReducers } from 'redux'
import authenticationReducer from './authentication'
import programReducer from './programs'
import userReducer from './users'

export default combineReducers({
    authentication: authenticationReducer, // authentication is state name
    programs: programReducer , // programs is state name
    users: userReducer
})