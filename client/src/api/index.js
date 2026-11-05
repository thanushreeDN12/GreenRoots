import axios from 'axios'

// Ensure requests route to the current Express backend and avoid dead external hosts
const getBaseURL = () => {
    const raw = process.env.REACT_APP_API_URL;
    if (!raw || raw.includes('onrender.com') || raw.includes('localhost:5000')) {
        return '';
    }
    return raw.trim();
};

const api = axios.create({ baseURL: getBaseURL() });

api.interceptors.request.use((req) => {

    if (localStorage.getItem("profile")) {
        const profile = JSON.parse(localStorage.getItem("profile"));

        req.headers.Authorization = `Bearer ${profile.token}`;
    }

    return req;
});


export const login = async ({username, pw}, config = {}) => api.post("/authentication/login", {username, pw}, config);
export const signup = async ({username, pw, email}, config = {}) => api.post("/authentication/signup", {username, email, pw}, config);
export const admin = async ({username, pw}, config = {}) => api.post("/authentication/admin", {username, pw}, config);

export const addprogram= async (program)=> api.post("/programs/addprogram", program)
export const fetchprograms= async ()=> api.get('/programs')
export const fetchSingleProgram= async (id)=> api.get(`/programs/${id}`)
export const addProgramIdToUser= async ({userId, programId, amount})=> api.post('/users/addProgramIdToUser', {userId, programId, amount})
export const getUser= async (id)=> api.get(`/users/getUser/${id}`)
export const uploadPhoto= async (formData)=> api.post(`/admin/uploadPhoto`, formData)
export const fetchCities= async ()=> api.get('/api/cities')
export const fetchSpecies= async ()=> api.get('/api/species')