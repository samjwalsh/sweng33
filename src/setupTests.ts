import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Ensure the global `expect` used in tests is Vitest's expect (not Chai's)
(globalThis as any).expect = expect;
