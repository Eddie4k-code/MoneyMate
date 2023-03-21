import { useState } from "react";
import axios from 'axios';

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const sendRequest = async () => {

        const res = await axios.post('http://localhost:5000/api/auth/register', {
            email: email,
            password: password,
        }).catch(err => console.log(err));

        let data = await res.data;
        console.log(data);
        return data;
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };
    
    return (
        <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-blue-200 p-10 rounded-lg flex flex-col w-96 shadow-md"
            >
                <h2 className="text-2xl font-semibold text-blue-500 mb-4">Join Our Fintech Community</h2>
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
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Register
                </button>
                <p className="text-sm mt-4 text-gray-700">
                    Already have an account?{" "}
                    <a href="#" className="underline text-blue-500">
                        Sign in here.
                    </a>
                </p>
            </form>
        </div>
    );
}

