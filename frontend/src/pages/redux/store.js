import { configureStore } from '@reduxjs/toolkit'

import userSlice from './userSlice';

//All reducers
export default configureStore({

    reducer: {
        user: userSlice,
    }

})