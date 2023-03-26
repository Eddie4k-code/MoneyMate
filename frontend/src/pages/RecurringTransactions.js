import { useEffect, useState } from "react";
import { SingleRecurringTransaction } from "../components/SingleRecurringTransaction"
import axios from 'axios';
import { useSelector } from "react-redux";

export const RecurringTransactions = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    const [transactions, setTransactions] = useState([]);
    const user = localStorage.getItem("userId");


    const getRecurringTransactions = async () => {

        let res = await axios.post("http://localhost:5000/api/plaid/recurringTransactions", {


            userId: user

        }).catch(err => console.log(err));


        let data = await res.data;

        setTransactions(data);





    }

    const makeTransaction = async () => {
        let res = await axios.post("http://localhost:5000/api/plaid/makeRecurring").catch(err => console.log(err));
    }

    useEffect(() => {

        getRecurringTransactions();





    }, []);





    return (
        
        <div className="flex-end justify-center items-center">
            <button onClick={() => console.log(transactions)}>Log</button>
            <button onClick={makeTransaction}>Make Transaction</button>
            <header class="text-4xl font-bold text-center py-8">
                View your Recurring Transactions!
            </header>


            

            <div className="container flex-col items-center justify-center pl-10">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <SingleRecurringTransaction/>
                </div>
            </div>


        </div>
        
        );
}