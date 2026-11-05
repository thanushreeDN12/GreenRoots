import { UPLOAD_PHOTO } from '../constants/actionTypes'
import * as api from '../api/index'

export const uploadPhoto = (formData, setVerifying, setVerificationError, setSuccess) => async (dispatch) => {
  try {
    if (setVerifying) setVerifying(true);
    if (setVerificationError) setVerificationError("");
    const response = await api.uploadPhoto(formData);
    dispatch({ type: UPLOAD_PHOTO, payload: response.data });
    if (setVerifying) setVerifying(false);
    if (setSuccess) setSuccess(true);
  } catch (error) {
    if (setVerifying) setVerifying(false);
    if (setVerificationError) {
      setVerificationError(error.response?.data?.message || "Upload failed");
    }
    console.error('Upload error:', error.message);
  }
};
