import 'vitest';

export interface CustomMatchers<R = unknown> {
    toBeAccessible(): R;
}

export interface AxeMatchers<R = unknown> {
    toHaveNoViolations(): R;
}

declare module 'vitest' {
    interface Assertion<T = unknown> extends CustomMatchers<T>, AxeMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers, AxeMatchers {}
}
