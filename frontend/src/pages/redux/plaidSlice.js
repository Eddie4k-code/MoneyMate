import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const getBalance = createAsyncThunk("plaid/getBalance", async (userId) => {
    //Make request to backend to retrieve account balances.

    const response = await axios.post('http://localhost:5000/api/plaid/getBalance', {
        userId: userId
    });

    const data = await response.data;

    return data;

});


const plaidSlice = createSlice({
    name: 'plaid',
    initialState: {
        status: 'idle', //idle | loading | succeeded | failed
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getBalance.pending, (state) => {

            state.status = 'loading';
        })

            .addCase(getBalance.fulfilled, (state, action) => {
                state.status = 'succeeded'
            })

            .addCase(getBalance.rejected, (state, action) => {

                state.status = 'failed';
                state.error = action.error.message;

            })

    }
});


export const getBalanceStatus = (state) => state.plaid.status;

export default plaidSlice.reducer;