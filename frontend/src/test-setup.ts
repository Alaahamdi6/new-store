/**
 * Test Setup - Mock window.location.reload before tests run
 * This prevents actual page reloads during test execution
 */

// Create a wrapper for location that allows us to mock reload
const originalReload = window.location.reload;

// Use Object.defineProperty to override the reload method
try {
  Object.defineProperty(window.location, 'reload', {
    configurable: true,
    writable: true,
    value: function() {
      console.log('[Test] window.location.reload() called but mocked');
      return;
    }
  });
} catch (e) {
  // If defineProperty fails, try a simple assignment
  try {
    (window.location as any).reload = function() {
      console.log('[Test] window.location.reload() called but mocked');
      return;
    };
  } catch (e2) {
    console.warn('[Test] Could not mock window.location.reload, will rely on Jasmine spy');
  }
}

// Also prevent beforeunload from actually reloading
(window as any).addEventListener('beforeunload', (e: Event) => {
  e.preventDefault();
  (e as any).returnValue = false;
  return false;
}, true);
