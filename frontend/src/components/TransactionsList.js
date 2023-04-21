import { useCallback, useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { ErrorHandler } from "../pages/redux/errorHandler";
import { useAuthContext } from "../hooks/useAuthContext";


export const TransactionsList = () => {
    const [accountIds, setAccountIds] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { user } = useAuthContext();
    const [accountMap, setAccountMap] = useState({});
    const [loading, setLoading] = useState(true);
    

    //Handle change for start date.
    const changeStartDate = (e) => {
        setStartDate(e.target.value)
    }


    //Handle change for end date.
    const changeEndDate = (e) => {
        setEndDate(e.target.value);
    }


    //Makes request to backend to retireve all transactions among all accounts
    const getRecentTransactions = async () => {

        const res = await axios.post("http://localhost:5000/api/plaid/getTransactions", {
            startDate: startDate,
            endDate: endDate
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }


        });


        return res.data;

    }

    //Makes request to backend to get account names so that we can create an object that stores account ids as a key to retrieve account name as value.
    const getAccountNames = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/plaid/getBalance", {
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }


            });
            const data = res.data[0];

            // Create object with account id as key and account name as value
            const accountNameMap = data.reduce((acc, account) => {
                acc[account.account_id] = account.name;
                return acc;
            }, {});

            setAccountMap(accountNameMap); // { "6a4pkWxPjDteNrEAmKGgH9wmKvaPqeF1X1Gk5": "Plaid Checking", "X4Rx3nqMvJHjynD7z1kotGv91kmz3wH1n1yJr": "Plaid Saving" }
        } catch (err) {
            ErrorHandler(err);
        }
    });


    
    

    useEffect(() => {
        getAccountNames();
        getRecentTransactions().then((data) => setTransactions(data[0]));

        console.log(transactions);

        setLoading(false);


}, [startDate, endDate])



    return (
        <div className="mt-8 lg:mt-12">
            <div class="flex justify-between items-center">
                <label for="start-date" class="text-gray-700 font-bold">Start Date</label>
                <input type="date" id="start-date" class="form-input rounded-md shadow-sm px-3 py-2" pattern="\d{4}-\d{2}-\d{2}" onChange={changeStartDate} />
                <label for="end-date" class="text-gray-700 font-bold ml-4">End Date</label>
                <input type="date" id="end-date" class="form-input rounded-md shadow-sm px-3 py-2" pattern="\d{4}-\d{2}-\d{2}" onChange={changeEndDate}  />
            </div>
            <h3 className="text-2xl font-bold mb-4">Recent Transactions</h3>

            <div className="overflow-y-scroll h-52">
                <table className="table-auto overflow-y-scroll w-50">
                    <thead>
                        <tr>
                            <th className="px-10 py-2">Date</th>
                            <th className="px-10 py-2">Description</th>
                            <th className="px-10 py-2">Category</th>
                            <th className="px-10 py-2">Amount</th>
                            <th className="px-10 py-2">Account</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.map(trans =>
                            <tr >
                                <td className="px-10 py-2">{trans.date}</td>
                                <td className="px-10 py-2">{trans.name}</td>
                                <td className="px-10 py-2">{trans.category[0]}</td>

                                <td className="px-10 py-2">
                                    ${trans.amount}
                                </td>

                                <td className="px-10 py-2">
                                    {accountMap[trans.account_id]}
                                </td>
                            </tr>

                        )}



                    </tbody>
                </table>

            </div>


        </div>
        
        );
}