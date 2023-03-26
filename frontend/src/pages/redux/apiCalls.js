import { loginFailure, loginStart, loginSuccess } from "./userSlice";
import axios from 'axios';
import { useNavigate } from "react-router-dom";




//Login
export const login = async (dispatch, user, navigate) => {
    //dispatches action to trigger state changes to the user slice. (Controls user logging in state)
   
    dispatch(loginStart());

    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", user)

        dispatch(loginSuccess(res.data));

        console.log(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userId", res.data.foundUser._id);

        navigate("/overview");

        

    } catch (err) {
        dispatch(loginFailure());
        console.log(err);
    }
}


