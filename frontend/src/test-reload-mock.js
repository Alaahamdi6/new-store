/**
 * Global test setup - Mock window.location.reload and jQuery before tests run
 * This prevents actual page reloads and jQuery errors during test execution
 * CRITICAL: This MUST load first before ANY other scripts or app code
 */

// IMMEDIATELY mock window.location.reload before anything else runs
window.location.reload = function() {
  console.log('[Test] window.location.reload() called but mocked - no actual reload');
  return;
};

// Prevent beforeunload from triggering reload
window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  e.returnValue = false;
  return false;
}, true);

// Override all navigation that could cause reload
var originalAssign = window.location.assign;
window.location.assign = function(url) {
  console.log('[Test] Blocked window.location.assign to', url);
  return;
};

var originalHref = window.location.href;
Object.defineProperty(window.location, 'href', {
  set: function(url) {
    console.log('[Test] Blocked window.location.href = ', url);
  },
  get: function() {
    return originalHref;
  },
  configurable: true
});

// Set up jQuery mock
if (typeof jQuery === 'undefined') {
  window.jQuery = function(selector) {
    return {
      owlCarousel: function(opts) { return this; },
      addClass: function(cls) { return this; },
      removeClass: function(cls) { return this; },
      on: function(event, callback) { return this; },
      off: function(event) { return this; },
      find: function(selector) { return this; },
      each: function(cb) { return this; },
      fadeIn: function() { return this; },
      fadeOut: function() { return this; },
      animate: function(props, duration, easing) { return this; },
      attr: function(name, value) { return this; },
      data: function(key) { return null; },
      click: function(cb) { return this; },
      length: 0,
    };
  };
  window.jQuery.fn = {
    owlCarousel: function() { return this; }
  };
  window.$ = window.jQuery;
}
