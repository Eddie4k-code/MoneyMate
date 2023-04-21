import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";


/*
 * 
 * 
 * Custom React hook that defines a login function for logging in users using the backend API.
 * 
 * useAuthContext hook is used here to get the dispatch function from the AuthContext provider which is used to update 
 * 
 * 
 * */

export const useLogin = () => {

    // initialize state variables
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const login = async (email, password, navigate) => {
        setIsLoading(true);
        setError(null); // Clear any previous errors

        // Check if email and password are provided
        if (!email || !password) {
            setError("Please enter both email and password");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email: email,
                password: password,
            });
            const data = await res.data;

            // Store user data in local storage
            localStorage.setItem("user", JSON.stringify(data));

            // Update global state with user data
            dispatch({ type: "LOGIN", payload: data });

            setIsLoading(false);

            navigate('/overview');
        } catch (err) {
            console.error(err);
            setError(err.response.data.error);
            setIsLoading(false);
        }
    };

    // return login function and state variables
    return { login, isLoading, error }
}