import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

export const fetchMessages = createAsyncThunk('chat/fetchMessages',
  async ({ projectId, params }, { rejectWithValue }) => {
    try {
      const res = await chatService.getMessages(projectId, params);
      return { messages: res.data.data, pagination: res.data.pagination };
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    pagination: null,
    isLoading: false,
    typingUsers: [],
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      const exists = state.messages.find((m) => m._id === action.payload._id);
      if (!exists) state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m._id !== action.payload);
    },
    setTypingUser: (state, action) => {
      const { userId, userName, isTyping } = action.payload;
      if (isTyping) {
        if (!state.typingUsers.find((u) => u.userId === userId)) {
          state.typingUsers.push({ userId, userName });
        }
      } else {
        state.typingUsers = state.typingUsers.filter((u) => u.userId !== userId);
      }
    },
    clearChat: (state) => {
      state.messages = [];
      state.typingUsers = [];
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (s) => { s.isLoading = true; })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.isLoading = false;
        s.messages = a.payload.messages;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchMessages.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export const { addMessage, removeMessage, setTypingUser, clearChat } = chatSlice.actions;
export default chatSlice.reducer;