import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ErrorHandler } from "../pages/redux/errorHandler";


export const BalanceBox = () => {

    //Get user id 
    const user = useSelector(state => state.user.currentUser.foundUser._id) || null;
    const [accounts, setAccounts] = useState([]);
    const loggedIn = useSelector(state => state.loggedIn);
    const navigate = useNavigate();

    


    //Retrieves Account Balances for all accounts matching with user id.
    const getAccountBalances = useCallback(async () => {
        let res = await axios.post("http://localhost:5000/api/plaid/getBalance", {
            userId: user,
        }).catch(err => ErrorHandler(err));

        let data = await res.data
        setAccounts(data);


    });

    //Update account balances on page
    useEffect(() => {
        getAccountBalances();
        console.log(accounts);
    }, [user]);
    

    //Get total amount from All accounts
    const total = useMemo(() => {
        return accounts[0]?.reduce((acc, account) => {
            return acc + account.balances.current;
        }, 0);
    }, [accounts]);


    
    if (accounts.length != 0 && total != 0) {
        return (

            <div className="w-full lg:w-1/2 lg:pl-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-4">Account Balances</h3>



                    <ul className="list-reset">

                        {accounts[0]?.map((account) =>
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
                                ${total}
                            </span>
                        </li>


                    </ul>


                </div>

            </div>

        );
    } else {
        return (

            <h1>Loading Account Balances...</h1>

        );
    }
    
}