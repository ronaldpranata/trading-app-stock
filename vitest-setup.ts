/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// Mock Web Worker
class Worker {
  url: string;
  onmessage: (event: MessageEvent) => void;
  onerror: (error: ErrorEvent) => void;
  onmessageerror: (event: MessageEvent) => void;

  constructor(stringUrl: string | URL, _options?: WorkerOptions) {
    this.url = stringUrl.toString();
    this.onmessage = () => {};
    this.onerror = () => {};
    this.onmessageerror = () => {};
  }

  postMessage(_msg: unknown) {
    // Mock processing - in tests we might want to manually trigger onmessage
    // or just ignore if we're testing component mounting
  }

  terminate() {}
  
  addEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: boolean | AddEventListenerOptions) {}
  removeEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: boolean | EventListenerOptions) {}
  dispatchEvent(_event: Event): boolean { return true; }
}

global.Worker = Worker as unknown as typeof Worker;
