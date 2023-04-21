import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";



export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isLoading } = useLogin();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useAuthContext();

    //Send request to api to login.
    const sendRequest = async () => {
        await login(email, password, navigate);
    };

    useEffect(() => {

        console.log(user);

    }, [])

    

    //Controls on login submit
    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };

    return (
        <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-blue-200 p-10 rounded-lg flex-col w-96 shadow-md"
            >
                <h2 className="text-2xl font-semibold text-blue-500 mb-4">Welcome Back!</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Enter your email address"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 w-20 transition duration-300"
                    disabled={isLoading}
                >
                    Login
                </button>
                {error && <h1>{error}</h1>}
                <p className="text-sm mt-4 text-gray-700">
                    Don't have an account yet?{" "}
                    <a href="#" className="underline text-blue-500">
                        Register here.
                    </a>
                </p>
            </form>
        </div>
    );
}