import { createSlice } from '@reduxjs/toolkit';

// Apply saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-theme');
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.remove('light-theme');
  document.documentElement.classList.add('dark');
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    mobileSidebarOpen: false,
    theme: savedTheme,
    activeModal: null,
    modalData: null
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.mobileSidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);

      // Apply immediately
      if (action.payload === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
      }
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    }
  }
});

export const {
  toggleSidebar, setSidebarOpen,
  toggleMobileSidebar, setMobileSidebarOpen,
  setTheme, openModal, closeModal
} = uiSlice.actions;

export default uiSlice.reducer;