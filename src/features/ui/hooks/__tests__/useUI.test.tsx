import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUI } from '../useUI';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { uiReducer } from '@/features/ui/store/uiSlice';

const createTestStore = () => configureStore({
  reducer: {
    ui: uiReducer,
  },
});

describe('useUI Hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={createTestStore()}>{children}</Provider>
    );

    it('should return default state', () => {
        const { result } = renderHook(() => useUI(), { wrapper });
        expect(result.current.viewMode).toBe('single');
        expect(result.current.activeTab).toBe('overview');
    });

    it('should update view mode', () => {
        const { result } = renderHook(() => useUI(), { wrapper });
        
        act(() => {
            result.current.setViewMode('compare');
        });
        
        expect(result.current.viewMode).toBe('compare');
    });


});
