import { ADDPROGRAM, FETCH_ALL_PROGRAMS, GET_USER, FETCH_SINGLE_PROGRAM, UPDATE_USER } from '../constants/actionTypes';
import * as api from '../api/index';
import { defaultProgramsData } from '../constants/defaultPrograms';

const fetchprograms = () => async (dispatch) => {
  try {
    const response = await api.fetchprograms();
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      dispatch({ type: FETCH_ALL_PROGRAMS, payload: response.data });
      return response.data;
    } else {
      dispatch({ type: FETCH_ALL_PROGRAMS, payload: defaultProgramsData });
      return defaultProgramsData;
    }
  } catch (error) {
    console.warn("fetchprograms fallback:", error.message);
    dispatch({ type: FETCH_ALL_PROGRAMS, payload: defaultProgramsData });
    return defaultProgramsData;
  }
};

const fetchSingleProgram = (id) => async (dispatch) => {
  try {
    const response = await api.fetchSingleProgram(id);
    if (response?.data && (response.data._id || response.data.title)) {
      dispatch({ type: FETCH_SINGLE_PROGRAM, payload: response.data });
      return response.data;
    } else {
      const fallback = defaultProgramsData.find(p => String(p._id) === String(id) || String(p.id) === String(id)) || defaultProgramsData[0];
      dispatch({ type: FETCH_SINGLE_PROGRAM, payload: fallback });
      return fallback;
    }
  } catch (error) {
    console.warn("fetchSingleProgram fallback:", error.message);
    const fallback = defaultProgramsData.find(p => String(p._id) === String(id) || String(p.id) === String(id)) || defaultProgramsData[0];
    dispatch({ type: FETCH_SINGLE_PROGRAM, payload: fallback });
    return fallback;
  }
};

const addprogram=(program)=> async (dispatch) =>{

    try{
        // console.log('inside action')
        //console.log({title, description})
        //console.log("Sending to backend:", program); 
        const res= await api.addprogram(program)
        // console.log('received response from backend',data)
        dispatch({ type: ADDPROGRAM, payload: res.data})
    }
    catch( error ){
        console.log(error.message)
    }

}

const addProgramIdToUser=({userId, programId, amount})=> async (dispatch) =>{

    try{
        const res= await api.addProgramIdToUser({userId, programId, amount})
        //console.log('received response from backend',res.data)
        dispatch({ type: UPDATE_USER, payload: res.data})
    }
    catch( error ){
        console.log(error.message)
    }
}

const getUser=(id)=> async (dispatch) =>{

    try{
        //console.log('inside action to getuser')
        const res= await api.getUser(id)
        console.log('received response from backend',res.data)
        dispatch({ type: GET_USER, payload: res.data})
    }
    catch( error ){
        console.log(error.message)
    }
}

export {addprogram, getUser,fetchprograms, fetchSingleProgram, addProgramIdToUser}