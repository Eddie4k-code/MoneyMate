
import './App.css';
import axios from 'axios';
import { PlaidLink, usePlaidLink } from 'react-plaid-link';
import { dotenv } from 'react-dotenv';
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Register } from './pages/Register';
import Sidebar from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { useSelector } from 'react-redux';
import { LandingPage } from './pages/LandingPage';
import { RecurringTransactions } from './pages/RecurringTransactions';
import { MyAccounts } from './pages/MyAccounts';
import { useAuthContext } from './hooks/useAuthContext';


function App() {

    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const { user } = useAuthContext();


    

    const PlaidAuth = ({publicToken}) => {
        return (<span>Account Added</span>);
    }

    //Get Access TOken
    const getAccessToken = async (pToken) => {
        let accessToken = await axios.post("http://localhost:5000/api/plaid/exchangePublicToken", {
            public_token: pToken,
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        );

        console.log(accessToken.data);




    }


    //Create Token
    useEffect(() => {


        async function fetch() {
            const res = await axios.post('http://localhost:5000/api/plaid/create_link_token');


            setLinkToken(res.data.link_token);

        }

        fetch();

    }, []);



    //Get Instituiton/account info
    const getAccountDetails = async (aToken) => {
        const res = await axios.post('http://localhost:5000/api/plaid/getInstitutionInfo', {
            accessToken: aToken,
        });

        let data = await res.data;

        console.log(data.accounts);

    }


    
    //receives the link token then it will open the Plaid Link interface where user can sign in with their bank account.
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            //console.log('success', public_token, metadata);
            getAccessToken(public_token);
        }
    })



    return (
      
        <div>
            <Navbar loggedIn={user}/>

            <button onClick={() => open()} disabled={!ready}>
            
                Connect a bank account
            </button>

            

            <BrowserRouter>
             
                <Routes>
                    <Route className="auto-mx" path="/register" element={<Register />} />
                    <Route className="auto-mx" path="/login" element={<Login />} />
                    <Route classname="auto-mx" path="/overview" element={<Overview />} />
                    <Route classname="auto-mx" path="/" element={<LandingPage />} />
                    <Route className="auto-mx" path="/recurring" element={<RecurringTransactions />} />
                    <Route className="auto-mx" path="/accounts" element={<MyAccounts />} />
                    
                </Routes>
            </BrowserRouter>

          

        </div>
    );

}

export default App;
