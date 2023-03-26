import { configureStore } from '@reduxjs/toolkit'
import plaidSlice from './plaidSlice';

import userSlice from './userSlice';


//All reducers
export default configureStore({

    reducer: {
        user: userSlice,
        plaid: plaidSlice
    }

})