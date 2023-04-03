import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts, getAccountsStatus } from "./redux/plaidSlice";
import axios from 'axios';
import { Account } from "../components/Account";

export const MyAccounts = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    const [accounts, setAccounts] = useState([]);
    const status = useSelector(getAccountsStatus);
    const user = localStorage.getItem("userId");
    const dispatch = useDispatch();


    useEffect(() => {
        if (status == 'idle') {
            dispatch(getAccounts(user)).then((data) => setAccounts(data.payload));
        }


    }, [user, dispatch])


    let content;


    if (status === 'loading') {
        content = <div className="flex flex-col justify-center items-center">

            <header class="text-4xl font-bold text-center py-8">
                View Your Accounts!


            </header>

            <div className="container flex-col items-center justify-center pl-10">

                <h1>Loading Accounts...</h1>


            </div>

        </div>
    } else if (status === 'succeeded') {
        content = <div className="flex-col items-center">

            <header class="text-4xl font-bold text-center py-8">
                View Your Accounts!
                <button onClick={() => console.log(accounts)}></button>

            </header>

            <div className="flex-col items-center justify-center pl-10 shadow-md">

                
                {
                    accounts.map((acc) => 

                        <div className="pt-10">
                        <Account accountName={acc.accountName} type={acc.accountType} />
                        </div>

                    )


                }


            </div>

        </div>
    } else {
        content = <div className="flex flex-col justify-center items-center">

            <header class="text-4xl font-bold text-center py-8">
                View Your Accounts!
            </header>

            <div className="container flex-col items-center justify-center pl-10">

                <h1>An Error has Occured!</h1>


            </div>

        </div>
    }




    return (


        <div>{content}</div>


        
        );
};