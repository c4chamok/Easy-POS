// src/store/slices/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TabType } from '@/types/pos';

interface UIState {
  activeTab: TabType;
  renderCounter: number; // For testing re-renders
}

const initialState: UIState = {
  activeTab: 'overview',
  renderCounter: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabType>) {
      state.activeTab = action.payload;
    },
    incrementRenderCounter(state) {
      state.renderCounter += 1;
    },
  },
});

export const { setActiveTab, incrementRenderCounter } = uiSlice.actions;
export default uiSlice.reducer;