import { ADDPROGRAM, FETCH_ALL_PROGRAMS, FETCH_SINGLE_PROGRAM } from "../constants/actionTypes";
import { defaultProgramsData } from "../constants/defaultPrograms";

const programReducer = (state = defaultProgramsData, action) => {
  switch (action.type) {
    case FETCH_ALL_PROGRAMS: {
      const arr = Array.isArray(action.payload) && action.payload.length > 0 
        ? [...action.payload] 
        : (state.length > 0 ? [...state] : [...defaultProgramsData]);
      if (state && state.program) {
        arr.program = state.program;
      }
      return arr;
    }

    case FETCH_SINGLE_PROGRAM: {
      const arr = Array.isArray(state) && state.length > 0 ? [...state] : [...defaultProgramsData];
      arr.program = action.payload;
      if (action.payload && action.payload._id) {
        const idx = arr.findIndex(p => p && (String(p._id) === String(action.payload._id) || String(p.id) === String(action.payload._id)));
        if (idx >= 0) {
          arr[idx] = action.payload;
        } else {
          arr.push(action.payload);
        }
      }
      return arr;
    }

    case ADDPROGRAM: {
      const arr = Array.isArray(state) ? [...state] : [...defaultProgramsData];
      const newProg = action.payload || action.data;
      if (newProg) {
        arr.push(newProg);
      }
      return arr;
    }

    default:
      return state;
  }
};

export default programReducer;