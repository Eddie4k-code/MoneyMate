import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BalanceBox } from "../components/BalanceBox"
import { TransactionsList } from "../components/TransactionsList"
import axios from 'axios';

export const Overview = () => {
    //Set authorization header to access token for our middleware!
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    const navigate = useNavigate();

    //Checks if user has an accessToken.
    useEffect(() => {

        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }


    }, [])



    return (
        


        <div className="flex flex-col justify-center items-center">

            <header class="text-4xl font-bold text-center py-8">
                Get an overview of your spending!
            </header>

        <div className="container flex-col items-center justify-center pl-10">

        <BalanceBox />
        <TransactionsList />
        

        </div>
        </div>
    );


}