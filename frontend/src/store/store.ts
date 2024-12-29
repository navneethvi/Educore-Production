import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import studentReducer from '../redux/students/studentSlice';
import tutorReducer from '../redux/tutors/tutorSlice';
import adminReducer from '../redux/admin/adminSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  student: studentReducer,
  tutor: tutorReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
