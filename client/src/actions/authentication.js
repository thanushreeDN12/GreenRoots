import * as api from '../api'
import { AUTHENTICATION, LOGOUT } from "../constants/actionTypes";

const login=({username, pw, navigate, setError, signal, setIsLoading})=>  async (dispatch) => {
    try{
        if (setIsLoading) setIsLoading(true);
        const { data }= await api.login({username, pw}, { signal })
        dispatch({type: AUTHENTICATION, data: data})
        if (setIsLoading) setIsLoading(false);
        navigate('/')
    }catch(err){
        if (setIsLoading) setIsLoading(false);
        if (err.name === 'CanceledError') return;
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "An error occurred during login";
        if (setError) setError(msg);
        console.log("Login error:", err)
    }
}

const signup=({username, email,pw, navigate, setError, signal, setIsLoading})=>  async (dispatch) => {
    try{
        if (setIsLoading) setIsLoading(true);
        const { data }= await api.signup({username, email, pw}, { signal })
        dispatch({type: AUTHENTICATION, data: data})
        if (setIsLoading) setIsLoading(false);
        navigate('/')
    }catch(err){
        if (setIsLoading) setIsLoading(false);
        if (err.name === 'CanceledError') return;
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "An error occurred during signup";
        if (setError) setError(msg);
        console.log("Signup error:", err)
    }
}

const admin=({username, pw, navigate, setError, signal, setIsLoading})=>  async (dispatch) => {
    try{
        if (setIsLoading) setIsLoading(true);
        const { data }= await api.admin({username, pw}, { signal })
        dispatch({type: AUTHENTICATION, data: data})
        if (setIsLoading) setIsLoading(false);
        navigate('/')
    }catch(err){
        if (setIsLoading) setIsLoading(false);
        if (err.name === 'CanceledError') return;
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "An error occurred during admin login";
        if (setError) setError(msg);
        console.log("Admin error:", err)
    }
}



const logout=()=> async (dispatch)=>{
    //console.log('inside action')
    dispatch({type: LOGOUT})
}


export {login, signup, admin, logout}
//   const user = JSON.parse(localStorage.getItem("profile"));
//   //console.log(localStorage.getItem("profile"))
//   const username = user?.result?.username;

//   //console.log(username)