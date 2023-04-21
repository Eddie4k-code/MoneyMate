import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ErrorHandler } from "../pages/redux/errorHandler";
import { getBalance, getBalanceStatus } from "../pages/redux/plaidSlice";


export const BalanceBox = () => {


    //Get user id 
     //useSelector(state => state.user.currentUser.foundUser._id) || null;
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Retireves status of api request getting balance data from our plaidSlice!
    const status = useSelector(getBalanceStatus);
    

    //Update account balances on page
    useEffect(() => {
        if (status == 'idle') {
            dispatch(getBalance()).then((data) => setAccounts(data.payload));
        }
    }, [dispatch, accounts, status]);
    

    //Get total amount from All accounts
    const total = useMemo(() => {
        return accounts[0]?.reduce((acc, account) => {
            return acc + account.balances.current;
        }, 0);
    }, [accounts]);


    let content;


    //Content will change depending on "status"

    if (status === 'loading') {
        content = <p>Loading Balances...</p>
    } else if (status === 'succeeded') {

        if (accounts.length == 0) {
            content = <div>  <h1>No Balances to show, add an account!</h1> </div>
        } else {

            content = <div className="w-full lg:w-1/2 lg:pl-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-4">Account Balances</h3>

                    <button onClick={() => console.log(accounts)}>Log it</button>

                    <ul className="list-reset">
                        {accounts?.[0]?.map((account) =>
                            <li className="mb-4">
                                <span className="block font-bold text-xl">{account.name}</span>
                                <span className="block font-medium text-lg text-gray-600">
                                    ${account.balances.current}
                                </span>
                            </li>
                        )}

                        <li className="mb-4">
                            <span className="block font-bold text-xl">Total Amount</span>
                            <span className="block font-medium text-lg text-gray-600">
                                ${total ?? 0}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        }
    } else if (status === 'failed') {
        content = <p>There was an error</p>
    }


    
   
        return (

            <div>


                {content}

            </div>
        );
    
    
}