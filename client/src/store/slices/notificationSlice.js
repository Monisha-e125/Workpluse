import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk('notifications/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const res = await notificationService.getNotifications(params);
      return { notifications: res.data.data, unreadCount: res.data.unreadCount };
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const fetchUnreadCount = createAsyncThunk('notifications/unreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.getUnreadCount();
      return res.data.data.count;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const markAsRead = createAsyncThunk('notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const markAllRead = createAsyncThunk('notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.isLoading = false;
        s.notifications = a.payload.notifications;
        s.unreadCount = a.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload; })
      .addCase(markAsRead.fulfilled, (s, a) => {
        const notif = s.notifications.find((n) => n._id === a.payload);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      })
      .addCase(markAllRead.fulfilled, (s) => {
        s.notifications.forEach((n) => { n.isRead = true; });
        s.unreadCount = 0;
      });
  }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;