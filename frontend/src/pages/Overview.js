import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BalanceBox } from "../components/BalanceBox"
import { TransactionsList } from "../components/TransactionsList"
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext";

export const Overview = () => {



    const navigate = useNavigate();
    const user = useAuthContext();

    //Checks if user has an accessToken.
    useEffect(() => {

        if (!user) {
            navigate("/login");
        }

    }, [])



    return (
        


        <div className="flex flex-col justify-center items-center">

            <header class="text-4xl font-bold text-center py-8">
                Get an Overview of Your Spending!
            </header>

        <div className="container flex-col items-center justify-center pl-10">

        <BalanceBox />
        <TransactionsList />
        

        </div>
        </div>
    );


}