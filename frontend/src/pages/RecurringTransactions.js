import { useEffect, useState } from "react";
import { SingleRecurringTransaction } from "../components/SingleRecurringTransaction"
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getRecurringTransactions, getRecurringTransactionsStatus } from "./redux/plaidSlice";
import { useAuthContext } from "../hooks/useAuthContext";

export const RecurringTransactions = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    const [transactions, setTransactions] = useState([]);
    const dispatch = useDispatch();
    const user = useAuthContext();

    //Retrieves status of api request getting recurring transactions from plaidSlice.

    const status = useSelector(getRecurringTransactionsStatus);
    


    

    const makeTransaction = async () => {
        let res = await axios.post("http://localhost:5000/api/plaid/makeRecurring").catch(err => console.log(err));
    }

    useEffect(() => {
  if (status === 'idle') {
    dispatch(getRecurringTransactions(user)).then((data) => setTransactions(data.payload));
  }
}, [dispatch]);


    let content;

    //Content will change depending on "recurringTransactionsStatus"
    if (status === 'loading') {
        content = <div className = "flex items-center justify-center" ><h1>Loading Recurring Transactions...</h1></div>;
    } else if (status === 'succeeded') {
        if (transactions[0] == null) {

            content = <div className="flex items-center justify-center"><h1>No Recurring Transactions to show!</h1></div>
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



    } else if (status == 'failed') {
        content = <div className="flex items-center justify-center"><h1>An error has occured!</h1></div>
    }




    return (
        <div>
        {content}
        </div>
        );
}