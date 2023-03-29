import { useEffect, useState } from "react";
import { SingleRecurringTransaction } from "../components/SingleRecurringTransaction"
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getRecurringTransactions, getRecurringTransactionsStatus } from "./redux/plaidSlice";

export const RecurringTransactions = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    const [transactions, setTransactions] = useState([]);
    const user = localStorage.getItem("userId");
    const dispatch = useDispatch();

    //Retrieves status of api request getting recurring transactions from plaidSlice.

    const status = useSelector(getRecurringTransactionsStatus);
    


    

    const makeTransaction = async () => {
        let res = await axios.post("http://localhost:5000/api/plaid/makeRecurring").catch(err => console.log(err));
    }

    useEffect(() => {
  if (status === 'idle') {
    dispatch(getRecurringTransactions(user)).then((data) => setTransactions(data.payload));
  }
}, [dispatch, user]);


    let content;

    //Content will change depending on "recurringTransactionsStatus"
    if (status === 'loading') {
        content = <h1>Loading Recurring Transactions...</h1>;
    } else if (status === 'succeeded') {
        if (transactions[0] == null) {
            content = <h1>No Recurring Transactions to show!</h1>
        } else {


            content = <div className="flex-end justify-center items-center">
                <button onClick={() => console.log(transactions)}>Log</button>
                <button onClick={makeTransaction}>Make Transaction</button>
                <header class="text-4xl font-bold text-center py-8">
                    View your Recurring Transactions!
                </header>




                <div className="container flex-col items-center justify-center pl-10">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <SingleRecurringTransaction />
                    </div>
                </div>


            </div>
        }



    }




    return (
        <div>
        {content}
        </div>
        );
}