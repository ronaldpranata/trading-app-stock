"use client";

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed dispatch hook for use throughout the app
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Typed selector hook for use throughout the app
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
