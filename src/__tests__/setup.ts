import { vi, beforeEach } from 'vitest';

// jsdom does not implement matchMedia — stub it so reducedMotion() in chat.ts works
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // animations ON by default; individual tests override for reduced-motion cases
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock motion — we assert DOM state, not animation side-effects
vi.mock('motion', () => ({
  animate: vi.fn().mockReturnValue({ finished: Promise.resolve() }),
  stagger: vi.fn().mockReturnValue(0),
}));

// Mock router so navigate() calls don't crash
vi.mock('../router', () => ({
  router: { navigate: vi.fn() },
}));

// Clear all mock state between every test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
