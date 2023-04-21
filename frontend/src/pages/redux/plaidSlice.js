import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';


export const getBalance = createAsyncThunk("plaid/getBalance", async (user) => {
    //Make request to backend to retrieve account balances.
    
    try {

        const response = await axios.post('http://localhost:5000/api/plaid/getBalance', {
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        const data = await response.data;

        return data;

    } catch(err) {
        console.log(err);
    }

});


export const getAccounts = createAsyncThunk("plaid/getAccounts", async (user) => {
    //Make request to backend to retrieve all accounts associated with userid.

   

    try {

        const res = await axios.post(`http://localhost:5000/api/plaid/getUserAccounts`, {

        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        ).catch(err => console.log(err));

        const data = await res.data;

        return data;



    } catch (err) {
        console.log(err);
    }


});


export const getRecurringTransactions = createAsyncThunk("plaid/getRecurringTransactions", async (user) => {
    //Make a request to backend to retireve all reccuring transactions from accounts associated with the userid.

    try {

        let res = await axios.post("http://localhost:5000/api/plaid/recurringTransactions", {


            

        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }




        );


        let data = res.data;

        return data;
    } catch (err) {
        console.log(err);
    }

});


const plaidSlice = createSlice({
    name: 'plaid',
    initialState: {
        status: 'idle', //idle | loading | succeeded | failed
        recurringTransactionsStatus: 'idle',
        getAccountsStatus: 'idle',
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getBalance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBalance.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(getBalance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getRecurringTransactions.pending, (state) => {
                state.recurringTransactionsStatus = 'loading';
            })
            .addCase(getRecurringTransactions.fulfilled, (state, action) => {
                state.recurringTransactionsStatus = 'succeeded';
            })
            .addCase(getRecurringTransactions.rejected, (state, action) => {
                state.recurringTransactionsStatus = 'failed';
                state.error = action.error.message;
            })

            .addCase(getAccounts.pending, (state) => {
                state.getAccountsStatus = 'loading';
            })

            .addCase(getAccounts.fulfilled, (state, action) => {
                state.getAccountsStatus = 'succeeded';
            })

            .addCase(getAccounts.rejected, (state, action) => {
                state.getAccountsStatus = 'failed';
                state.error = action.error.message;
            })

        
    }
});


export const getBalanceStatus = (state) => state.plaid.status;
export const getRecurringTransactionsStatus = (state) => state.plaid.recurringTransactionsStatus;
export const getAccountsStatus = (state) => state.plaid.getAccountsStatus;

export default plaidSlice.reducer;