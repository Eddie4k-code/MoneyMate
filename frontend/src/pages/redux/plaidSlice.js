import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const getBalance = createAsyncThunk("plaid/getBalance", async (userId) => {
    //Make request to backend to retrieve account balances.

    try {

        const response = await axios.post('http://localhost:5000/api/plaid/getBalance', {
            userId: userId
        });

        const data = await response.data;

        return data;

    } catch(err) {
        console.log(err);
    }

});


export const getRecurringTransactions = createAsyncThunk("plaid/getRecurringTransactions", async (userId) => {

    try {

        let res = await axios.post("http://localhost:5000/api/plaid/recurringTransactions", {


            userId: userId

        }).catch(err => console.log(err));


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
    }
});


export const getBalanceStatus = (state) => state.plaid.status;
export const getRecurringTransactionsStatus = (state) => state.plaid.recurringTransactionsStatus;

export default plaidSlice.reducer;