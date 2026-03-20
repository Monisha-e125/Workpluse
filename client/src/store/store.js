import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import kanbanReducer from './slices/kanbanSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import aiReducer from './slices/aiSlice';
import moodReducer from './slices/moodSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, users: userReducer, ui: uiReducer,
    projects: projectReducer, tasks: taskReducer, kanban: kanbanReducer,
    chat: chatReducer, notifications: notificationReducer,
    ai: aiReducer, mood: moodReducer, analytics: analyticsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV
});

export default store;