"use strict";
self["webpackHotUpdateclient"]("index",{

/***/ "./node_modules/history/index.js":
/*!***************************************!*\
  !*** ./node_modules/history/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action),
/* harmony export */   "createBrowserHistory": () => (/* binding */ createBrowserHistory),
/* harmony export */   "createHashHistory": () => (/* binding */ createHashHistory),
/* harmony export */   "createMemoryHistory": () => (/* binding */ createMemoryHistory),
/* harmony export */   "createPath": () => (/* binding */ createPath),
/* harmony export */   "parsePath": () => (/* binding */ parsePath)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");


/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */
var Action;

(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */

  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */

  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));

var readOnly =  true ? function (obj) {
  return Object.freeze(obj);
} : 0;

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

var BeforeUnloadEventType = 'beforeunload';
var HashChangeEventType = 'hashchange';
var PopStateEventType = 'popstate';
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */

function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$window = _options.window,
      window = _options$window === void 0 ? document.defaultView : _options$window;
  var globalHistory = window.history;

  function getIndexAndLocation() {
    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedPopTx = null;

  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;

      var _getIndexAndLocation = getIndexAndLocation(),
          nextIndex = _getIndexAndLocation[0],
          nextLocation = _getIndexAndLocation[1];

      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;

          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
           true ? warning(false, // TODO: Write up a doc that explains our blocking strategy in
          // detail and link to it here so people can understand better what
          // is going on and how to avoid it.
          "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") : 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);
  var action = Action.Pop;

  var _getIndexAndLocation2 = getIndexAndLocation(),
      index = _getIndexAndLocation2[0],
      location = _getIndexAndLocation2[1];

  var listeners = createEvents();
  var blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, globalHistory.state, {
      idx: index
    }), '');
  }

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  } // state defaults to `null` because `window.history.state` does


  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    }, createHref(nextLocation)];
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction) {
    action = nextAction;

    var _getIndexAndLocation3 = getIndexAndLocation();

    index = _getIndexAndLocation3[0];
    location = _getIndexAndLocation3[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1),
          historyState = _getHistoryStateAndUr[0],
          url = _getHistoryStateAndUr[1]; // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/


      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index),
          historyState = _getHistoryStateAndUr2[0],
          url = _getHistoryStateAndUr2[1]; // TODO: Support forced reloading


      globalHistory.replaceState(historyState, '', url);
      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock(); // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */

function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options2 = options,
      _options2$window = _options2.window,
      window = _options2$window === void 0 ? document.defaultView : _options2$window;
  var globalHistory = window.history;

  function getIndexAndLocation() {
    var _parsePath = parsePath(window.location.hash.substr(1)),
        _parsePath$pathname = _parsePath.pathname,
        pathname = _parsePath$pathname === void 0 ? '/' : _parsePath$pathname,
        _parsePath$search = _parsePath.search,
        search = _parsePath$search === void 0 ? '' : _parsePath$search,
        _parsePath$hash = _parsePath.hash,
        hash = _parsePath$hash === void 0 ? '' : _parsePath$hash;

    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedPopTx = null;

  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;

      var _getIndexAndLocation4 = getIndexAndLocation(),
          nextIndex = _getIndexAndLocation4[0],
          nextLocation = _getIndexAndLocation4[1];

      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;

          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
           true ? warning(false, // TODO: Write up a doc that explains our blocking strategy in
          // detail and link to it here so people can understand better
          // what is going on and how to avoid it.
          "You are trying to block a POP navigation to a location that was not " + "created by the history library. The block will fail silently in " + "production, but in general you should do all navigation with the " + "history library (instead of using window.history.pushState directly) " + "to avoid this situation.") : 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop); // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event

  window.addEventListener(HashChangeEventType, function () {
    var _getIndexAndLocation5 = getIndexAndLocation(),
        nextLocation = _getIndexAndLocation5[1]; // Ignore extraneous hashchange events.


    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });
  var action = Action.Pop;

  var _getIndexAndLocation6 = getIndexAndLocation(),
      index = _getIndexAndLocation6[0],
      location = _getIndexAndLocation6[1];

  var listeners = createEvents();
  var blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, globalHistory.state, {
      idx: index
    }), '');
  }

  function getBaseHref() {
    var base = document.querySelector('base');
    var href = '';

    if (base && base.getAttribute('href')) {
      var url = window.location.href;
      var hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    }, createHref(nextLocation)];
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction) {
    action = nextAction;

    var _getIndexAndLocation7 = getIndexAndLocation();

    index = _getIndexAndLocation7[0];
    location = _getIndexAndLocation7[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

     true ? warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1),
          historyState = _getHistoryStateAndUr3[0],
          url = _getHistoryStateAndUr3[1]; // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/


      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

     true ? warning(nextLocation.pathname.charAt(0) === '/', "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index),
          historyState = _getHistoryStateAndUr4[0],
          url = _getHistoryStateAndUr4[1]; // TODO: Support forced reloading


      globalHistory.replaceState(historyState, '', url);
      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock(); // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
 */

function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options3 = options,
      _options3$initialEntr = _options3.initialEntries,
      initialEntries = _options3$initialEntr === void 0 ? ['/'] : _options3$initialEntr,
      initialIndex = _options3.initialIndex;
  var entries = initialEntries.map(function (entry) {
    var location = readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey()
    }, typeof entry === 'string' ? parsePath(entry) : entry));
     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(entry) + ")") : 0;
    return location;
  });
  var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
  var action = Action.Pop;
  var location = entries[index];
  var listeners = createEvents();
  var blockers = createEvents();

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readOnly((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      pathname: location.pathname,
      search: '',
      hash: ''
    }, typeof to === 'string' ? parsePath(to) : to, {
      state: state,
      key: createKey()
    }));
  }

  function allowTx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      push(to, state);
    }

     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.push(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);

    function retry() {
      replace(to, state);
    }

     true ? warning(location.pathname.charAt(0) === '/', "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(to) + ")") : 0;

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(delta) {
    var nextIndex = clamp(index + delta, 0, entries.length - 1);
    var nextAction = Action.Pop;
    var nextLocation = entries[nextIndex];

    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  var history = {
    get index() {
      return index;
    },

    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      return blockers.push(blocker);
    }
  };
  return history;
} ////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

function promptBeforeUnload(event) {
  // Cancel the event.
  event.preventDefault(); // Chrome (and legacy IE) requires returnValue to be set.

  event.returnValue = '';
}

function createEvents() {
  var handlers = [];
  return {
    get length() {
      return handlers.length;
    },

    push: function push(fn) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter(function (handler) {
          return handler !== fn;
        });
      };
    },
    call: function call(arg) {
      handlers.forEach(function (fn) {
        return fn && fn(arg);
      });
    }
  };
}

function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
 */


function createPath(_ref) {
  var _ref$pathname = _ref.pathname,
      pathname = _ref$pathname === void 0 ? '/' : _ref$pathname,
      _ref$search = _ref.search,
      search = _ref$search === void 0 ? '' : _ref$search,
      _ref$hash = _ref.hash,
      hash = _ref$hash === void 0 ? '' : _ref$hash;
  if (search && search !== '?') pathname += search.charAt(0) === '?' ? search : '?' + search;
  if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
 */

function parsePath(path) {
  var parsedPath = {};

  if (path) {
    var hashIndex = path.indexOf('#');

    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    var searchIndex = path.indexOf('?');

    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/react-router-dom/index.js":
/*!************************************************!*\
  !*** ./node_modules/react-router-dom/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MemoryRouter": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.MemoryRouter),
/* harmony export */   "Navigate": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Navigate),
/* harmony export */   "NavigationType": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Action),
/* harmony export */   "Outlet": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Outlet),
/* harmony export */   "Route": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Route),
/* harmony export */   "Router": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Router),
/* harmony export */   "Routes": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Routes),
/* harmony export */   "UNSAFE_LocationContext": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_LocationContext),
/* harmony export */   "UNSAFE_NavigationContext": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_NavigationContext),
/* harmony export */   "UNSAFE_RouteContext": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_RouteContext),
/* harmony export */   "createPath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.createPath),
/* harmony export */   "createRoutesFromChildren": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.createRoutesFromChildren),
/* harmony export */   "generatePath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.generatePath),
/* harmony export */   "matchPath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.matchPath),
/* harmony export */   "matchRoutes": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes),
/* harmony export */   "parsePath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.parsePath),
/* harmony export */   "renderMatches": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.renderMatches),
/* harmony export */   "resolvePath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.resolvePath),
/* harmony export */   "useHref": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useHref),
/* harmony export */   "useInRouterContext": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useInRouterContext),
/* harmony export */   "useLocation": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useLocation),
/* harmony export */   "useMatch": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useMatch),
/* harmony export */   "useNavigate": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useNavigate),
/* harmony export */   "useNavigationType": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useNavigationType),
/* harmony export */   "useOutlet": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useOutlet),
/* harmony export */   "useOutletContext": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useOutletContext),
/* harmony export */   "useParams": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useParams),
/* harmony export */   "useResolvedPath": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useResolvedPath),
/* harmony export */   "useRoutes": () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.useRoutes),
/* harmony export */   "BrowserRouter": () => (/* binding */ BrowserRouter),
/* harmony export */   "HashRouter": () => (/* binding */ HashRouter),
/* harmony export */   "Link": () => (/* binding */ Link),
/* harmony export */   "NavLink": () => (/* binding */ NavLink),
/* harmony export */   "createSearchParams": () => (/* binding */ createSearchParams),
/* harmony export */   "unstable_HistoryRouter": () => (/* binding */ HistoryRouter),
/* harmony export */   "useLinkClickHandler": () => (/* binding */ useLinkClickHandler),
/* harmony export */   "useSearchParams": () => (/* binding */ useSearchParams)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/history/index.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/index.js");
/**
 * React Router DOM v6.2.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */





function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const _excluded = ["onClick", "reloadDocument", "replace", "state", "target", "to"],
      _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"];

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
} ////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
////////////////////////////////////////////////////////////////////////////////

/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
function BrowserRouter(_ref) {
  let {
    basename,
    children,
    window
  } = _ref;
  let historyRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();

  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createBrowserHistory)({
      window
    });
  }

  let history = historyRef.current;
  let [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    action: history.action,
    location: history.location
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => history.listen(setState), [history]);
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router__WEBPACK_IMPORTED_MODULE_1__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
function HashRouter(_ref2) {
  let {
    basename,
    children,
    window
  } = _ref2;
  let historyRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();

  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createHashHistory)({
      window
    });
  }

  let history = historyRef.current;
  let [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    action: history.action,
    location: history.location
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => history.listen(setState), [history]);
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router__WEBPACK_IMPORTED_MODULE_1__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
function HistoryRouter(_ref3) {
  let {
    basename,
    children,
    history
  } = _ref3;
  const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    action: history.action,
    location: history.location
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => history.listen(setState), [history]);
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router__WEBPACK_IMPORTED_MODULE_1__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

if (true) {
  HistoryRouter.displayName = "unstable_HistoryRouter";
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * The public API for rendering a history-aware <a>.
 */
const Link = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function LinkWithRef(_ref4, ref) {
  let {
    onClick,
    reloadDocument,
    replace = false,
    state,
    target,
    to
  } = _ref4,
      rest = _objectWithoutPropertiesLoose(_ref4, _excluded);

  let href = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useHref)(to);
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target
  });

  function handleClick(event) {
    if (onClick) onClick(event);

    if (!event.defaultPrevented && !reloadDocument) {
      internalOnClick(event);
    }
  }

  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", _extends({}, rest, {
      href: href,
      onClick: handleClick,
      ref: ref,
      target: target
    }))
  );
});

if (true) {
  Link.displayName = "Link";
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
const NavLink = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function NavLinkWithRef(_ref5, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    children
  } = _ref5,
      rest = _objectWithoutPropertiesLoose(_ref5, _excluded2);

  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useResolvedPath)(to);
  let locationPathname = location.pathname;
  let toPathname = path.pathname;

  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    toPathname = toPathname.toLowerCase();
  }

  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;

  if (typeof classNameProp === "function") {
    className = classNameProp({
      isActive
    });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
  }

  let style = typeof styleProp === "function" ? styleProp({
    isActive
  }) : styleProp;
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className: className,
    ref: ref,
    style: style,
    to: to
  }), typeof children === "function" ? children({
    isActive
  }) : children);
});

if (true) {
  NavLink.displayName = "NavLink";
} ////////////////////////////////////////////////////////////////////////////////
// HOOKS
////////////////////////////////////////////////////////////////////////////////

/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */


function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state
  } = _temp === void 0 ? {} : _temp;
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useResolvedPath)(to);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (event.button === 0 && ( // Ignore everything but left clicks
    !target || target === "_self") && // Let browser handle "target=_blank" etc.
    !isModifiedEvent(event) // Ignore clicks with modifier keys
    ) {
      event.preventDefault(); // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here.

      let replace = !!replaceProp || (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createPath)(location) === (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createPath)(path);
      navigate(to, {
        replace,
        state
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to]);
}
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */

function useSearchParams(defaultInit) {
   true ? warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not " + "support the URLSearchParams API. If you need to support Internet " + "Explorer 11, we recommend you load a polyfill such as " + "https://github.com/ungap/url-search-params\n\n" + "If you're unsure how to load polyfills, we recommend you check out " + "https://polyfill.io/v3/ which provides some recommendations about how " + "to load polyfills only for users that need them, instead of for every " + "user.") : 0;
  let defaultSearchParamsRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(createSearchParams(defaultInit));
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  let searchParams = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    let searchParams = createSearchParams(location.search);

    for (let key of defaultSearchParamsRef.current.keys()) {
      if (!searchParams.has(key)) {
        defaultSearchParamsRef.current.getAll(key).forEach(value => {
          searchParams.append(key, value);
        });
      }
    }

    return searchParams;
  }, [location.search]);
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.useNavigate)();
  let setSearchParams = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((nextInit, navigateOptions) => {
    navigate("?" + createSearchParams(nextInit), navigateOptions);
  }, [navigate]);
  return [searchParams, setSearchParams];
}

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }

  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]);
  }, []));
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/react-router/index.js":
/*!********************************************!*\
  !*** ./node_modules/react-router/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NavigationType": () => (/* reexport safe */ history__WEBPACK_IMPORTED_MODULE_1__.Action),
/* harmony export */   "createPath": () => (/* reexport safe */ history__WEBPACK_IMPORTED_MODULE_1__.createPath),
/* harmony export */   "parsePath": () => (/* reexport safe */ history__WEBPACK_IMPORTED_MODULE_1__.parsePath),
/* harmony export */   "MemoryRouter": () => (/* binding */ MemoryRouter),
/* harmony export */   "Navigate": () => (/* binding */ Navigate),
/* harmony export */   "Outlet": () => (/* binding */ Outlet),
/* harmony export */   "Route": () => (/* binding */ Route),
/* harmony export */   "Router": () => (/* binding */ Router),
/* harmony export */   "Routes": () => (/* binding */ Routes),
/* harmony export */   "UNSAFE_LocationContext": () => (/* binding */ LocationContext),
/* harmony export */   "UNSAFE_NavigationContext": () => (/* binding */ NavigationContext),
/* harmony export */   "UNSAFE_RouteContext": () => (/* binding */ RouteContext),
/* harmony export */   "createRoutesFromChildren": () => (/* binding */ createRoutesFromChildren),
/* harmony export */   "generatePath": () => (/* binding */ generatePath),
/* harmony export */   "matchPath": () => (/* binding */ matchPath),
/* harmony export */   "matchRoutes": () => (/* binding */ matchRoutes),
/* harmony export */   "renderMatches": () => (/* binding */ renderMatches),
/* harmony export */   "resolvePath": () => (/* binding */ resolvePath),
/* harmony export */   "useHref": () => (/* binding */ useHref),
/* harmony export */   "useInRouterContext": () => (/* binding */ useInRouterContext),
/* harmony export */   "useLocation": () => (/* binding */ useLocation),
/* harmony export */   "useMatch": () => (/* binding */ useMatch),
/* harmony export */   "useNavigate": () => (/* binding */ useNavigate),
/* harmony export */   "useNavigationType": () => (/* binding */ useNavigationType),
/* harmony export */   "useOutlet": () => (/* binding */ useOutlet),
/* harmony export */   "useOutletContext": () => (/* binding */ useOutletContext),
/* harmony export */   "useParams": () => (/* binding */ useParams),
/* harmony export */   "useResolvedPath": () => (/* binding */ useResolvedPath),
/* harmony export */   "useRoutes": () => (/* binding */ useRoutes)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! history */ "./node_modules/history/index.js");
/**
 * React Router v6.2.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */




function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

const alreadyWarned = {};

function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
     true ? warning(false, message) : 0;
  }
} ///////////////////////////////////////////////////////////////////////////////
// CONTEXT
///////////////////////////////////////////////////////////////////////////////

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */


const NavigationContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

if (true) {
  NavigationContext.displayName = "Navigation";
}

const LocationContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

if (true) {
  LocationContext.displayName = "Location";
}

const RouteContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  outlet: null,
  matches: []
});

if (true) {
  RouteContext.displayName = "Route";
} ///////////////////////////////////////////////////////////////////////////////
// COMPONENTS
///////////////////////////////////////////////////////////////////////////////


/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://reactrouter.com/docs/en/v6/api#memoryrouter
 */
function MemoryRouter(_ref) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex
  } = _ref;
  let historyRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();

  if (historyRef.current == null) {
    historyRef.current = (0,history__WEBPACK_IMPORTED_MODULE_1__.createMemoryHistory)({
      initialEntries,
      initialIndex
    });
  }

  let history = historyRef.current;
  let [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    action: history.action,
    location: history.location
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => history.listen(setState), [history]);
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/docs/en/v6/api#navigate
 */
function Navigate(_ref2) {
  let {
    to,
    replace,
    state
  } = _ref2;
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of
  // the router loaded. We can help them understand how to avoid that.
  "<Navigate> may be used only in the context of a <Router> component.") : 0 : void 0;
   true ? warning(!(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NavigationContext).static, "<Navigate> must not be used on the initial render in a <StaticRouter>. " + "This is a no-op, but you should modify your code so the <Navigate> is " + "only ever rendered in response to some user interaction or state change.") : 0;
  let navigate = useNavigate();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    navigate(to, {
      replace,
      state
    });
  });
  return null;
}

/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/docs/en/v6/api#outlet
 */
function Outlet(props) {
  return useOutlet(props.context);
}

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#route
 */
function Route(_props) {
    true ? invariant(false, "A <Route> is only ever to be used as the child of <Routes> element, " + "never rendered directly. Please wrap your <Route> in a <Routes>.") : 0 ;
}

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/docs/en/v6/api#router
 */
function Router(_ref3) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = history__WEBPACK_IMPORTED_MODULE_1__.Action.Pop,
    navigator,
    static: staticProp = false
  } = _ref3;
  !!useInRouterContext() ?  true ? invariant(false, "You cannot render a <Router> inside another <Router>." + " You should never have more than one in your app.") : 0 : void 0;
  let basename = normalizePathname(basenameProp);
  let navigationContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    basename,
    navigator,
    static: staticProp
  }), [basename, navigator, staticProp]);

  if (typeof locationProp === "string") {
    locationProp = (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationProp);
  }

  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let location = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    let trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key
    };
  }, [basename, pathname, search, hash, state, key]);
   true ? warning(location != null, "<Router basename=\"" + basename + "\"> is not able to match the URL " + ("\"" + pathname + search + hash + "\" because it does not start with the ") + "basename, so the <Router> won't render anything.") : 0;

  if (location == null) {
    return null;
  }

  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(LocationContext.Provider, {
    children: children,
    value: {
      location,
      navigationType
    }
  }));
}

/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#routes
 */
function Routes(_ref4) {
  let {
    children,
    location
  } = _ref4;
  return useRoutes(createRoutesFromChildren(children), location);
} ///////////////////////////////////////////////////////////////////////////////
// HOOKS
///////////////////////////////////////////////////////////////////////////////

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usehref
 */

function useHref(to) {
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useHref() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    basename,
    navigator
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to);
  let joinedPathname = pathname;

  if (basename !== "/") {
    let toPathname = getToPathname(to);
    let endsWithSlash = toPathname != null && toPathname.endsWith("/");
    joinedPathname = pathname === "/" ? basename + (endsWithSlash ? "/" : "") : joinPaths([basename, pathname]);
  }

  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
/**
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useinroutercontext
 */

function useInRouterContext() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(LocationContext) != null;
}
/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/docs/en/v6/api#uselocation
 */

function useLocation() {
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useLocation() may be used only in the context of a <Router> component.") : 0 : void 0;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(LocationContext).location;
}

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigationtype
 */
function useNavigationType() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(LocationContext).navigationType;
}
/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usematch
 */

function useMatch(pattern) {
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useMatch() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    pathname
  } = useLocation();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => matchPath(pattern, pathname), [pathname, pattern]);
}
/**
 * The interface for the navigate() function returned from useNavigate().
 */

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigate
 */
function useNavigate() {
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useNavigate() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    basename,
    navigator
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NavigationContext);
  let {
    matches
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(matches.map(match => match.pathnameBase));
  let activeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    activeRef.current = true;
  });
  let navigate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (to, options) {
    if (options === void 0) {
      options = {};
    }

     true ? warning(activeRef.current, "You should call navigate() in a React.useEffect(), not when " + "your component is first rendered.") : 0;
    if (!activeRef.current) return;

    if (typeof to === "number") {
      navigator.go(to);
      return;
    }

    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname);

    if (basename !== "/") {
      path.pathname = joinPaths([basename, path.pathname]);
    }

    (!!options.replace ? navigator.replace : navigator.push)(path, options.state);
  }, [basename, navigator, routePathnamesJson, locationPathname]);
  return navigate;
}
const OutletContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
/**
 * Returns the context (if provided) for the child route at this level of the route
 * hierarchy.
 * @see https://reactrouter.com/docs/en/v6/api#useoutletcontext
 */

function useOutletContext() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(OutletContext);
}
/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useoutlet
 */

function useOutlet(context) {
  let outlet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext).outlet;

  if (outlet) {
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(OutletContext.Provider, {
      value: context
    }, outlet);
  }

  return outlet;
}
/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useparams
 */

function useParams() {
  let {
    matches
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useresolvedpath
 */

function useResolvedPath(to) {
  let {
    matches
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(matches.map(match => match.pathnameBase));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname), [to, routePathnamesJson, locationPathname]);
}
/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useroutes
 */

function useRoutes(routes, locationArg) {
  !useInRouterContext() ?  true ? invariant(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useRoutes() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    matches: parentMatches
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;

  if (true) {
    // You won't get a warning about 2 different <Routes> under a <Route>
    // without a trailing *, but this is a best-effort warning anyway since we
    // cannot even give the warning unless they land at the parent route.
    //
    // Example:
    //
    // <Routes>
    //   {/* This route path MUST end with /* because otherwise
    //       it will never match /blog/post/123 */}
    //   <Route path="blog" element={<Blog />} />
    //   <Route path="blog/feed" element={<BlogFeed />} />
    // </Routes>
    //
    // function Blog() {
    //   return (
    //     <Routes>
    //       <Route path="post/:id" element={<Post />} />
    //     </Routes>
    //   );
    // }
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ("\"" + parentPathname + "\" (under <Route path=\"" + parentPath + "\">) but the ") + "parent route path has no trailing \"*\". This means if you navigate " + "deeper, the parent won't match anymore and therefore the child " + "routes will never render.\n\n" + ("Please change the parent <Route path=\"" + parentPath + "\"> to <Route ") + ("path=\"" + (parentPath === "/" ? "*" : parentPath + "/*") + "\">."));
  }

  let locationFromContext = useLocation();
  let location;

  if (locationArg) {
    var _parsedLocationArg$pa;

    let parsedLocationArg = typeof locationArg === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ?  true ? invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, " + "the location pathname must begin with the portion of the URL pathname that was " + ("matched by all parent routes. The current pathname base is \"" + parentPathnameBase + "\" ") + ("but pathname \"" + parsedLocationArg.pathname + "\" was given in the `location` prop.")) : 0 : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  let pathname = location.pathname || "/";
  let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });

  if (true) {
     true ? warning(parentRoute || matches != null, "No routes matched location \"" + location.pathname + location.search + location.hash + "\" ") : 0;
     true ? warning(matches == null || matches[matches.length - 1].route.element !== undefined, "Matched leaf route at location \"" + location.pathname + location.search + location.hash + "\" does not have an element. " + "This means it will render an <Outlet /> with a null value by default resulting in an \"empty\" page.") : 0;
  }

  return _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([parentPathnameBase, match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase])
  })), parentMatches);
} ///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/docs/en/v6/api#createroutesfromchildren
 */

function createRoutesFromChildren(children) {
  let routes = [];
  react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, element => {
    if (! /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children));
      return;
    }

    !(element.type === Route) ?  true ? invariant(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : 0 : void 0;
    let route = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });
  return routes;
}
/**
 * The parameters that were parsed from the URL path.
 */

/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/docs/en/v6/api#generatepath
 */
function generatePath(path, params) {
  if (params === void 0) {
    params = {};
  }

  return path.replace(/:(\w+)/g, (_, key) => {
    !(params[key] != null) ?  true ? invariant(false, "Missing \":" + key + "\" param") : 0 : void 0;
    return params[key];
  }).replace(/\/*\*$/, _ => params["*"] == null ? "" : params["*"].replace(/^\/*/, "/"));
}
/**
 * A RouteMatch contains info about how a route matched a URL.
 */

/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchroutes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }

  let location = typeof locationArg === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);

  if (pathname == null) {
    return null;
  }

  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;

  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], pathname);
  }

  return matches;
}

function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }

  if (parentsMeta === void 0) {
    parentsMeta = [];
  }

  if (parentPath === void 0) {
    parentPath = "";
  }

  routes.forEach((route, index) => {
    let meta = {
      relativePath: route.path || "",
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };

    if (meta.relativePath.startsWith("/")) {
      !meta.relativePath.startsWith(parentPath) ?  true ? invariant(false, "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.") : 0 : void 0;
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }

    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta); // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.

    if (route.children && route.children.length > 0) {
      !(route.index !== true) ?  true ? invariant(false, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\".")) : 0 : void 0;
      flattenRoutes(route.children, branches, routesMeta, path);
    } // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.


    if (route.path == null && !route.index) {
      return;
    }

    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  });
  return branches;
}

function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;

const isSplat = s => s === "*";

function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;

  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}

function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] : // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}

function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];

  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match) return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });

    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }

  return matches;
}
/**
 * Renders the result of `matchRoutes()` into a React element.
 */


function renderMatches(matches) {
  return _renderMatches(matches);
}

function _renderMatches(matches, parentMatches) {
  if (parentMatches === void 0) {
    parentMatches = [];
  }

  if (matches == null) return null;
  return matches.reduceRight((outlet, match, index) => {
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RouteContext.Provider, {
      children: match.route.element !== undefined ? match.route.element : outlet,
      value: {
        outlet,
        matches: parentMatches.concat(matches.slice(0, index + 1))
      }
    });
  }, null);
}
/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */


/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }

  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }

    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}

function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }

  if (end === void 0) {
    end = true;
  }

   true ? warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\".")) : 0;
  let paramNames = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return "([^\\/]+)";
  });

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else {
    regexpSource += end ? "\\/*$" // When matching to the end, ignore trailing slashes
    : // Otherwise, match a word boundary or a proceeding /. The word boundary restricts
    // parent routes to matching only their own words and nothing more, e.g. parent
    // route "/home" should not match "/home2".
    // Additionally, allow paths starting with `.`, `-`, `~`, and url-encoded entities,
    // but do not consume the character in the matched path so they can match against
    // nested paths.
    "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)";
  }

  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, paramNames];
}

function safelyDecodeURIComponent(value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
     true ? warning(false, "The value for the URL param \"" + paramName + "\" will not be decoded because" + (" the string \"" + value + "\" is a malformed URL segment. This is probably") + (" due to a bad percent encoding (" + error + ").")) : 0;
    return value;
  }
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/docs/en/v6/api#resolvepath
 */


function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }

  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}

function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}

function resolveTo(toArg, routePathnames, locationPathname) {
  let to = typeof toArg === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(toArg) : toArg;
  let toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname; // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.

  let from;

  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;

    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/"); // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".

      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }

      to.pathname = toSegments.join("/");
    } // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.


    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }

  let path = resolvePath(to, from); // Ensure the pathname has a trailing slash if the original to value had one.

  if (toPathname && toPathname !== "/" && toPathname.endsWith("/") && !path.pathname.endsWith("/")) {
    path.pathname += "/";
  }

  return path;
}

function getToPathname(to) {
  // Empty strings should be treated the same as / paths
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_1__.parsePath)(to).pathname : to.pathname;
}

function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  let nextChar = pathname.charAt(basename.length);

  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(basename.length) || "/";
}

const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");

const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;

const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash; ///////////////////////////////////////////////////////////////////////////////


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./src/components/App.tsx":
/*!********************************!*\
  !*** ./src/components/App.tsx ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './App.css'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const react_router_dom_1 = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
function App() {
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Routes, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: '/home/login', element: react_1.default.createElement(react_1.default.Fragment, null, " login") }),
            react_1.default.createElement(react_router_dom_1.Route, { path: '/home/register', element: react_1.default.createElement(react_1.default.Fragment, null, " register ") }))));
}
exports["default"] = App;


/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"));
const App_1 = __importDefault(__webpack_require__(/*! ./components/App */ "./src/components/App.tsx"));
react_dom_1.default.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(App_1.default, null)), document.getElementById("root"));


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("de3b45373b3c8f970e24")
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguNDFlNzFlZmM2ZDQ2Y2IxYmM3MTQuaG90LXVwZGF0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTBEOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQyx3QkFBd0I7O0FBRXpCLGVBQWUsS0FBcUM7QUFDcEQ7QUFDQSxFQUFFLEVBQUUsQ0FFSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVSxLQUFxQztBQUMvQztBQUNBO0FBQ0Esc1VBQXNVLENBQU07QUFDNVU7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLDhFQUFRLEdBQUc7QUFDMUM7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLElBQUk7OztBQUdKO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiw4RUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDOzs7QUFHQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQzs7O0FBRzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7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O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEscUdBQXFHOztBQUUrVTtBQUNwYjs7Ozs7Ozs7Ozs7Ozs7OztBQzE4QkEsOEpBQW1CO0FBQ25CLG1IQUkwQjtBQUMxQixtR0FBMEI7QUFFMUIsU0FBUyxHQUFHO0lBQ1YsT0FBTyxDQUNMLDhCQUFDLGdDQUFNO1FBQ0wsOEJBQUMseUJBQU07WUFDSCw4QkFBQyx3QkFBSyxJQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsT0FBTyxFQUFFLHVFQUFXLEdBQUk7WUFDbEQsOEJBQUMsd0JBQUssSUFBQyxJQUFJLEVBQUMsZ0JBQWdCLEVBQUMsT0FBTyxFQUFFLDJFQUFlLEdBQUksQ0FDcEQsQ0FDRixDQUNWLENBQUM7QUFDSixDQUFDO0FBRUQscUJBQWUsR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJuQixtR0FBMEI7QUFDMUIsK0dBQWlDO0FBRWpDLHVHQUFtQztBQUduQyxtQkFBUSxDQUFDLE1BQU0sQ0FDYiw4QkFBQyxlQUFLLENBQUMsVUFBVTtJQUNiLDhCQUFDLGFBQUcsT0FBRyxDQUNRLEVBQ25CLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQ2hDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ1hhO0FBQ2Y7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O1VDaEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL2hpc3RvcnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci1kb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvY29tcG9uZW50cy9BcHAudHN4Iiwid2VicGFjazovL2NsaWVudC8uL3NyYy9pbmRleC50c3giLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMuanMiLCJ3ZWJwYWNrOi8vY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jbGllbnQvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIiwid2VicGFjazovL2NsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZXh0ZW5kcyBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzJztcblxuLyoqXHJcbiAqIEFjdGlvbnMgcmVwcmVzZW50IHRoZSB0eXBlIG9mIGNoYW5nZSB0byBhIGxvY2F0aW9uIHZhbHVlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2FjdGlvblxyXG4gKi9cbnZhciBBY3Rpb247XG5cbihmdW5jdGlvbiAoQWN0aW9uKSB7XG4gIC8qKlxyXG4gICAqIEEgUE9QIGluZGljYXRlcyBhIGNoYW5nZSB0byBhbiBhcmJpdHJhcnkgaW5kZXggaW4gdGhlIGhpc3Rvcnkgc3RhY2ssIHN1Y2hcclxuICAgKiBhcyBhIGJhY2sgb3IgZm9yd2FyZCBuYXZpZ2F0aW9uLiBJdCBkb2VzIG5vdCBkZXNjcmliZSB0aGUgZGlyZWN0aW9uIG9mIHRoZVxyXG4gICAqIG5hdmlnYXRpb24sIG9ubHkgdGhhdCB0aGUgY3VycmVudCBpbmRleCBjaGFuZ2VkLlxyXG4gICAqXHJcbiAgICogTm90ZTogVGhpcyBpcyB0aGUgZGVmYXVsdCBhY3Rpb24gZm9yIG5ld2x5IGNyZWF0ZWQgaGlzdG9yeSBvYmplY3RzLlxyXG4gICAqL1xuICBBY3Rpb25bXCJQb3BcIl0gPSBcIlBPUFwiO1xuICAvKipcclxuICAgKiBBIFBVU0ggaW5kaWNhdGVzIGEgbmV3IGVudHJ5IGJlaW5nIGFkZGVkIHRvIHRoZSBoaXN0b3J5IHN0YWNrLCBzdWNoIGFzIHdoZW5cclxuICAgKiBhIGxpbmsgaXMgY2xpY2tlZCBhbmQgYSBuZXcgcGFnZSBsb2Fkcy4gV2hlbiB0aGlzIGhhcHBlbnMsIGFsbCBzdWJzZXF1ZW50XHJcbiAgICogZW50cmllcyBpbiB0aGUgc3RhY2sgYXJlIGxvc3QuXHJcbiAgICovXG5cbiAgQWN0aW9uW1wiUHVzaFwiXSA9IFwiUFVTSFwiO1xuICAvKipcclxuICAgKiBBIFJFUExBQ0UgaW5kaWNhdGVzIHRoZSBlbnRyeSBhdCB0aGUgY3VycmVudCBpbmRleCBpbiB0aGUgaGlzdG9yeSBzdGFja1xyXG4gICAqIGJlaW5nIHJlcGxhY2VkIGJ5IGEgbmV3IG9uZS5cclxuICAgKi9cblxuICBBY3Rpb25bXCJSZXBsYWNlXCJdID0gXCJSRVBMQUNFXCI7XG59KShBY3Rpb24gfHwgKEFjdGlvbiA9IHt9KSk7XG5cbnZhciByZWFkT25seSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5mcmVlemUob2JqKTtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiB3YXJuaW5nKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSBjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gV2VsY29tZSB0byBkZWJ1Z2dpbmcgaGlzdG9yeSFcbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIGVycm9yIGlzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHlvdSBjYW4gbW9yZSBlYXNpbHlcbiAgICAgIC8vIGZpbmQgdGhlIHNvdXJjZSBmb3IgYSB3YXJuaW5nIHRoYXQgYXBwZWFycyBpbiB0aGUgY29uc29sZSBieVxuICAgICAgLy8gZW5hYmxpbmcgXCJwYXVzZSBvbiBleGNlcHRpb25zXCIgaW4geW91ciBKYXZhU2NyaXB0IGRlYnVnZ2VyLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59XG5cbnZhciBCZWZvcmVVbmxvYWRFdmVudFR5cGUgPSAnYmVmb3JldW5sb2FkJztcbnZhciBIYXNoQ2hhbmdlRXZlbnRUeXBlID0gJ2hhc2hjaGFuZ2UnO1xudmFyIFBvcFN0YXRlRXZlbnRUeXBlID0gJ3BvcHN0YXRlJztcbi8qKlxyXG4gKiBCcm93c2VyIGhpc3Rvcnkgc3RvcmVzIHRoZSBsb2NhdGlvbiBpbiByZWd1bGFyIFVSTHMuIFRoaXMgaXMgdGhlIHN0YW5kYXJkIGZvclxyXG4gKiBtb3N0IHdlYiBhcHBzLCBidXQgaXQgcmVxdWlyZXMgc29tZSBjb25maWd1cmF0aW9uIG9uIHRoZSBzZXJ2ZXIgdG8gZW5zdXJlIHlvdVxyXG4gKiBzZXJ2ZSB0aGUgc2FtZSBhcHAgYXQgbXVsdGlwbGUgVVJMcy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVicm93c2VyaGlzdG9yeVxyXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQnJvd3Nlckhpc3Rvcnkob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHdpbmRvdyA9IF9vcHRpb25zLndpbmRvdyxcbiAgICAgIHdpbmRvdyA9IF9vcHRpb25zJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9ucyR3aW5kb3c7XG4gIHZhciBnbG9iYWxIaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG5cbiAgZnVuY3Rpb24gZ2V0SW5kZXhBbmRMb2NhdGlvbigpIHtcbiAgICB2YXIgX3dpbmRvdyRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbixcbiAgICAgICAgcGF0aG5hbWUgPSBfd2luZG93JGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBzZWFyY2ggPSBfd2luZG93JGxvY2F0aW9uLnNlYXJjaCxcbiAgICAgICAgaGFzaCA9IF93aW5kb3ckbG9jYXRpb24uaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb24gPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICAgICAgbmV4dEluZGV4ID0gX2dldEluZGV4QW5kTG9jYXRpb25bMF0sXG4gICAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb25bMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXIgd2hhdFxuICAgICAgICAgIC8vIGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjIgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uMlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb24yWzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfSAvLyBzdGF0ZSBkZWZhdWx0cyB0byBgbnVsbGAgYmVjYXVzZSBgd2luZG93Lmhpc3Rvcnkuc3RhdGVgIGRvZXNcblxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHNlYXJjaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHVzcjogbmV4dExvY2F0aW9uLnN0YXRlLFxuICAgICAga2V5OiBuZXh0TG9jYXRpb24ua2V5LFxuICAgICAgaWR4OiBpbmRleFxuICAgIH0sIGNyZWF0ZUhyZWYobmV4dExvY2F0aW9uKV07XG4gIH1cblxuICBmdW5jdGlvbiBhbGxvd1R4KGFjdGlvbiwgbG9jYXRpb24sIHJldHJ5KSB7XG4gICAgcmV0dXJuICFibG9ja2Vycy5sZW5ndGggfHwgKGJsb2NrZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICByZXRyeTogcmV0cnlcbiAgICB9KSwgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlUeChuZXh0QWN0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcblxuICAgIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjMgPSBnZXRJbmRleEFuZExvY2F0aW9uKCk7XG5cbiAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1swXTtcbiAgICBsb2NhdGlvbiA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1sxXTtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICB2YXIgX2dldEhpc3RvcnlTdGF0ZUFuZFVyID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXggKyAxKSxcbiAgICAgICAgICBoaXN0b3J5U3RhdGUgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXJbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcbiAgICAgIC8vIHRyeS4uLmNhdGNoIGJlY2F1c2UgaU9TIGxpbWl0cyB1cyB0byAxMDAgcHVzaFN0YXRlIGNhbGxzIDovXG5cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsSGlzdG9yeS5wdXNoU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFRoZXkgYXJlIGdvaW5nIHRvIGxvc2Ugc3RhdGUgaGVyZSwgYnV0IHRoZXJlIGlzIG5vIHJlYWxcbiAgICAgICAgLy8gd2F5IHRvIHdhcm4gdGhlbSBhYm91dCBpdCBzaW5jZSB0aGUgcGFnZSB3aWxsIHJlZnJlc2guLi5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xuICAgICAgfVxuXG4gICAgICBhcHBseVR4KG5leHRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2UodG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUmVwbGFjZTtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHJlcGxhY2UodG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjIgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCksXG4gICAgICAgICAgaGlzdG9yeVN0YXRlID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyMlswXSxcbiAgICAgICAgICB1cmwgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXIyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcblxuXG4gICAgICBnbG9iYWxIaXN0b3J5LnJlcGxhY2VTdGF0ZShoaXN0b3J5U3RhdGUsICcnLCB1cmwpO1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIGdsb2JhbEhpc3RvcnkuZ28oZGVsdGEpO1xuICB9XG5cbiAgdmFyIGhpc3RvcnkgPSB7XG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICB2YXIgdW5ibG9jayA9IGJsb2NrZXJzLnB1c2goYmxvY2tlcik7XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB1bmJsb2NrKCk7IC8vIFJlbW92ZSB0aGUgYmVmb3JldW5sb2FkIGxpc3RlbmVyIHNvIHRoZSBkb2N1bWVudCBtYXlcbiAgICAgICAgLy8gc3RpbGwgYmUgc2FsdmFnZWFibGUgaW4gdGhlIHBhZ2VoaWRlIGV2ZW50LlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jdW5sb2FkaW5nLWRvY3VtZW50c1xuXG4gICAgICAgIGlmICghYmxvY2tlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGhpc3Rvcnk7XG59XG4vKipcclxuICogSGFzaCBoaXN0b3J5IHN0b3JlcyB0aGUgbG9jYXRpb24gaW4gd2luZG93LmxvY2F0aW9uLmhhc2guIFRoaXMgbWFrZXMgaXQgaWRlYWxcclxuICogZm9yIHNpdHVhdGlvbnMgd2hlcmUgeW91IGRvbid0IHdhbnQgdG8gc2VuZCB0aGUgbG9jYXRpb24gdG8gdGhlIHNlcnZlciBmb3JcclxuICogc29tZSByZWFzb24sIGVpdGhlciBiZWNhdXNlIHlvdSBkbyBjYW5ub3QgY29uZmlndXJlIGl0IG9yIHRoZSBVUkwgc3BhY2UgaXNcclxuICogcmVzZXJ2ZWQgZm9yIHNvbWV0aGluZyBlbHNlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2NyZWF0ZWhhc2hoaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVIYXNoSGlzdG9yeShvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMyID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zMiR3aW5kb3cgPSBfb3B0aW9uczIud2luZG93LFxuICAgICAgd2luZG93ID0gX29wdGlvbnMyJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9uczIkd2luZG93O1xuICB2YXIgZ2xvYmFsSGlzdG9yeSA9IHdpbmRvdy5oaXN0b3J5O1xuXG4gIGZ1bmN0aW9uIGdldEluZGV4QW5kTG9jYXRpb24oKSB7XG4gICAgdmFyIF9wYXJzZVBhdGggPSBwYXJzZVBhdGgod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKSxcbiAgICAgICAgX3BhcnNlUGF0aCRwYXRobmFtZSA9IF9wYXJzZVBhdGgucGF0aG5hbWUsXG4gICAgICAgIHBhdGhuYW1lID0gX3BhcnNlUGF0aCRwYXRobmFtZSA9PT0gdm9pZCAwID8gJy8nIDogX3BhcnNlUGF0aCRwYXRobmFtZSxcbiAgICAgICAgX3BhcnNlUGF0aCRzZWFyY2ggPSBfcGFyc2VQYXRoLnNlYXJjaCxcbiAgICAgICAgc2VhcmNoID0gX3BhcnNlUGF0aCRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3BhcnNlUGF0aCRzZWFyY2gsXG4gICAgICAgIF9wYXJzZVBhdGgkaGFzaCA9IF9wYXJzZVBhdGguaGFzaCxcbiAgICAgICAgaGFzaCA9IF9wYXJzZVBhdGgkaGFzaCA9PT0gdm9pZCAwID8gJycgOiBfcGFyc2VQYXRoJGhhc2g7XG5cbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb240ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpLFxuICAgICAgICAgIG5leHRJbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNFswXSxcbiAgICAgICAgICBuZXh0TG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjRbMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXJcbiAgICAgICAgICAvLyB3aGF0IGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7IC8vIHBvcHN0YXRlIGRvZXMgbm90IGZpcmUgb24gaGFzaGNoYW5nZSBpbiBJRSAxMSBhbmQgb2xkICh0cmlkZW50KSBFZGdlXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0FQSS9XaW5kb3cvcG9wc3RhdGVfZXZlbnRcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihIYXNoQ2hhbmdlRXZlbnRUeXBlLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9nZXRJbmRleEFuZExvY2F0aW9uNSA9IGdldEluZGV4QW5kTG9jYXRpb24oKSxcbiAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb241WzFdOyAvLyBJZ25vcmUgZXh0cmFuZW91cyBoYXNoY2hhbmdlIGV2ZW50cy5cblxuXG4gICAgaWYgKGNyZWF0ZVBhdGgobmV4dExvY2F0aW9uKSAhPT0gY3JlYXRlUGF0aChsb2NhdGlvbikpIHtcbiAgICAgIGhhbmRsZVBvcCgpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjYgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb242WzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QmFzZUhyZWYoKSB7XG4gICAgdmFyIGJhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdiYXNlJyk7XG4gICAgdmFyIGhyZWYgPSAnJztcblxuICAgIGlmIChiYXNlICYmIGJhc2UuZ2V0QXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgIHZhciBoYXNoSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgICAgaHJlZiA9IGhhc2hJbmRleCA9PT0gLTEgPyB1cmwgOiB1cmwuc2xpY2UoMCwgaGFzaEluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHJlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUhyZWYodG8pIHtcbiAgICByZXR1cm4gZ2V0QmFzZUhyZWYoKSArICcjJyArICh0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgaGFzaDogJycsXG4gICAgICBzZWFyY2g6ICcnXG4gICAgfSwgdHlwZW9mIHRvID09PSAnc3RyaW5nJyA/IHBhcnNlUGF0aCh0bykgOiB0bywge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEhpc3RvcnlTdGF0ZUFuZFVybChuZXh0TG9jYXRpb24sIGluZGV4KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB1c3I6IG5leHRMb2NhdGlvbi5zdGF0ZSxcbiAgICAgIGtleTogbmV4dExvY2F0aW9uLmtleSxcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9LCBjcmVhdGVIcmVmKG5leHRMb2NhdGlvbildO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbikge1xuICAgIGFjdGlvbiA9IG5leHRBY3Rpb247XG5cbiAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb243ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpO1xuXG4gICAgaW5kZXggPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMF07XG4gICAgbG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMV07XG4gICAgbGlzdGVuZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2godG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUHVzaDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHB1c2godG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKG5leHRMb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gaGFzaCBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjMgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCArIDEpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjNbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyM1sxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG4gICAgICAvLyB0cnkuLi5jYXRjaCBiZWNhdXNlIGlPUyBsaW1pdHMgdXMgdG8gMTAwIHB1c2hTdGF0ZSBjYWxscyA6L1xuXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbEhpc3RvcnkucHVzaFN0YXRlKGhpc3RvcnlTdGF0ZSwgJycsIHVybCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBUaGV5IGFyZSBnb2luZyB0byBsb3NlIHN0YXRlIGhlcmUsIGJ1dCB0aGVyZSBpcyBubyByZWFsXG4gICAgICAgIC8vIHdheSB0byB3YXJuIHRoZW0gYWJvdXQgaXQgc2luY2UgdGhlIHBhZ2Ugd2lsbCByZWZyZXNoLi4uXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhuZXh0TG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIGhhc2ggaGlzdG9yeS5yZXBsYWNlKFwiICsgSlNPTi5zdHJpbmdpZnkodG8pICsgXCIpXCIpIDogdm9pZCAwO1xuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIHZhciBfZ2V0SGlzdG9yeVN0YXRlQW5kVXI0ID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjRbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyNFsxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG5cblxuICAgICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ28oZGVsdGEpIHtcbiAgICBnbG9iYWxIaXN0b3J5LmdvKGRlbHRhKTtcbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBnZXQgbG9jYXRpb24oKSB7XG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfSxcblxuICAgIGNyZWF0ZUhyZWY6IGNyZWF0ZUhyZWYsXG4gICAgcHVzaDogcHVzaCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIGdvOiBnbyxcbiAgICBiYWNrOiBmdW5jdGlvbiBiYWNrKCkge1xuICAgICAgZ28oLTEpO1xuICAgIH0sXG4gICAgZm9yd2FyZDogZnVuY3Rpb24gZm9yd2FyZCgpIHtcbiAgICAgIGdvKDEpO1xuICAgIH0sXG4gICAgbGlzdGVuOiBmdW5jdGlvbiBsaXN0ZW4obGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSxcbiAgICBibG9jazogZnVuY3Rpb24gYmxvY2soYmxvY2tlcikge1xuICAgICAgdmFyIHVuYmxvY2sgPSBibG9ja2Vycy5wdXNoKGJsb2NrZXIpO1xuXG4gICAgICBpZiAoYmxvY2tlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdW5ibG9jaygpOyAvLyBSZW1vdmUgdGhlIGJlZm9yZXVubG9hZCBsaXN0ZW5lciBzbyB0aGUgZG9jdW1lbnQgbWF5XG4gICAgICAgIC8vIHN0aWxsIGJlIHNhbHZhZ2VhYmxlIGluIHRoZSBwYWdlaGlkZSBldmVudC5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvI3VubG9hZGluZy1kb2N1bWVudHNcblxuICAgICAgICBpZiAoIWJsb2NrZXJzLmxlbmd0aCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufVxuLyoqXHJcbiAqIE1lbW9yeSBoaXN0b3J5IHN0b3JlcyB0aGUgY3VycmVudCBsb2NhdGlvbiBpbiBtZW1vcnkuIEl0IGlzIGRlc2lnbmVkIGZvciB1c2VcclxuICogaW4gc3RhdGVmdWwgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzIGxpa2UgdGVzdHMgYW5kIFJlYWN0IE5hdGl2ZS5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVtZW1vcnloaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnlIaXN0b3J5KG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9uczMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMzJGluaXRpYWxFbnRyID0gX29wdGlvbnMzLmluaXRpYWxFbnRyaWVzLFxuICAgICAgaW5pdGlhbEVudHJpZXMgPSBfb3B0aW9uczMkaW5pdGlhbEVudHIgPT09IHZvaWQgMCA/IFsnLyddIDogX29wdGlvbnMzJGluaXRpYWxFbnRyLFxuICAgICAgaW5pdGlhbEluZGV4ID0gX29wdGlvbnMzLmluaXRpYWxJbmRleDtcbiAgdmFyIGVudHJpZXMgPSBpbml0aWFsRW50cmllcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgdmFyIGxvY2F0aW9uID0gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6ICcvJyxcbiAgICAgIHNlYXJjaDogJycsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHN0YXRlOiBudWxsLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0sIHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycgPyBwYXJzZVBhdGgoZW50cnkpIDogZW50cnkpKTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGxvY2F0aW9uLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nLCBcIlJlbGF0aXZlIHBhdGhuYW1lcyBhcmUgbm90IHN1cHBvcnRlZCBpbiBjcmVhdGVNZW1vcnlIaXN0b3J5KHsgaW5pdGlhbEVudHJpZXMgfSkgKGludmFsaWQgZW50cnk6IFwiICsgSlNPTi5zdHJpbmdpZnkoZW50cnkpICsgXCIpXCIpIDogdm9pZCAwO1xuICAgIHJldHVybiBsb2NhdGlvbjtcbiAgfSk7XG4gIHZhciBpbmRleCA9IGNsYW1wKGluaXRpYWxJbmRleCA9PSBudWxsID8gZW50cmllcy5sZW5ndGggLSAxIDogaW5pdGlhbEluZGV4LCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICB2YXIgYWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgdmFyIGxvY2F0aW9uID0gZW50cmllc1tpbmRleF07XG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBzZWFyY2g6ICcnLFxuICAgICAgaGFzaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcbiAgICBsb2NhdGlvbiA9IG5leHRMb2NhdGlvbjtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcobG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIG1lbW9yeSBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgaW5kZXggKz0gMTtcbiAgICAgIGVudHJpZXMuc3BsaWNlKGluZGV4LCBlbnRyaWVzLmxlbmd0aCwgbmV4dExvY2F0aW9uKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhsb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gbWVtb3J5IGhpc3RvcnkucmVwbGFjZShcIiArIEpTT04uc3RyaW5naWZ5KHRvKSArIFwiKVwiKSA6IHZvaWQgMDtcblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICBlbnRyaWVzW2luZGV4XSA9IG5leHRMb2NhdGlvbjtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIHZhciBuZXh0SW5kZXggPSBjbGFtcChpbmRleCArIGRlbHRhLCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZW50cmllc1tuZXh0SW5kZXhdO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICBnbyhkZWx0YSk7XG4gICAgfVxuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBpbmRleCgpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICByZXR1cm4gYmxvY2tlcnMucHVzaChibG9ja2VyKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gVVRJTFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGNsYW1wKG4sIGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sIGxvd2VyQm91bmQpLCB1cHBlckJvdW5kKTtcbn1cblxuZnVuY3Rpb24gcHJvbXB0QmVmb3JlVW5sb2FkKGV2ZW50KSB7XG4gIC8vIENhbmNlbCB0aGUgZXZlbnQuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIENocm9tZSAoYW5kIGxlZ2FjeSBJRSkgcmVxdWlyZXMgcmV0dXJuVmFsdWUgdG8gYmUgc2V0LlxuXG4gIGV2ZW50LnJldHVyblZhbHVlID0gJyc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50cygpIHtcbiAgdmFyIGhhbmRsZXJzID0gW107XG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBoYW5kbGVycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIHB1c2g6IGZ1bmN0aW9uIHB1c2goZm4pIHtcbiAgICAgIGhhbmRsZXJzLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlcnMgPSBoYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlciAhPT0gZm47XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGNhbGw6IGZ1bmN0aW9uIGNhbGwoYXJnKSB7XG4gICAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4gJiYgZm4oYXJnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5KCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDgpO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzdHJpbmcgVVJMIHBhdGggZnJvbSB0aGUgZ2l2ZW4gcGF0aG5hbWUsIHNlYXJjaCwgYW5kIGhhc2ggY29tcG9uZW50cy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVwYXRoXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdGgoX3JlZikge1xuICB2YXIgX3JlZiRwYXRobmFtZSA9IF9yZWYucGF0aG5hbWUsXG4gICAgICBwYXRobmFtZSA9IF9yZWYkcGF0aG5hbWUgPT09IHZvaWQgMCA/ICcvJyA6IF9yZWYkcGF0aG5hbWUsXG4gICAgICBfcmVmJHNlYXJjaCA9IF9yZWYuc2VhcmNoLFxuICAgICAgc2VhcmNoID0gX3JlZiRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3JlZiRzZWFyY2gsXG4gICAgICBfcmVmJGhhc2ggPSBfcmVmLmhhc2gsXG4gICAgICBoYXNoID0gX3JlZiRoYXNoID09PSB2b2lkIDAgPyAnJyA6IF9yZWYkaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2ggIT09ICc/JykgcGF0aG5hbWUgKz0gc2VhcmNoLmNoYXJBdCgwKSA9PT0gJz8nID8gc2VhcmNoIDogJz8nICsgc2VhcmNoO1xuICBpZiAoaGFzaCAmJiBoYXNoICE9PSAnIycpIHBhdGhuYW1lICs9IGhhc2guY2hhckF0KDApID09PSAnIycgPyBoYXNoIDogJyMnICsgaGFzaDtcbiAgcmV0dXJuIHBhdGhuYW1lO1xufVxuLyoqXHJcbiAqIFBhcnNlcyBhIHN0cmluZyBVUkwgcGF0aCBpbnRvIGl0cyBzZXBhcmF0ZSBwYXRobmFtZSwgc2VhcmNoLCBhbmQgaGFzaCBjb21wb25lbnRzLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI3BhcnNlcGF0aFxyXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgpIHtcbiAgdmFyIHBhcnNlZFBhdGggPSB7fTtcblxuICBpZiAocGF0aCkge1xuICAgIHZhciBoYXNoSW5kZXggPSBwYXRoLmluZGV4T2YoJyMnKTtcblxuICAgIGlmIChoYXNoSW5kZXggPj0gMCkge1xuICAgICAgcGFyc2VkUGF0aC5oYXNoID0gcGF0aC5zdWJzdHIoaGFzaEluZGV4KTtcbiAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBoYXNoSW5kZXgpO1xuICAgIH1cblxuICAgIHZhciBzZWFyY2hJbmRleCA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgaWYgKHNlYXJjaEluZGV4ID49IDApIHtcbiAgICAgIHBhcnNlZFBhdGguc2VhcmNoID0gcGF0aC5zdWJzdHIoc2VhcmNoSW5kZXgpO1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHNlYXJjaEluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgcGFyc2VkUGF0aC5wYXRobmFtZSA9IHBhdGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZFBhdGg7XG59XG5cbmV4cG9ydCB7IEFjdGlvbiwgY3JlYXRlQnJvd3Nlckhpc3RvcnksIGNyZWF0ZUhhc2hIaXN0b3J5LCBjcmVhdGVNZW1vcnlIaXN0b3J5LCBjcmVhdGVQYXRoLCBwYXJzZVBhdGggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiLyoqXG4gKiBSZWFjdCBSb3V0ZXIgRE9NIHY2LjIuMlxuICpcbiAqIENvcHlyaWdodCAoYykgUmVtaXggU29mdHdhcmUgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS5tZCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5pbXBvcnQgeyB1c2VSZWYsIHVzZVN0YXRlLCB1c2VMYXlvdXRFZmZlY3QsIGNyZWF0ZUVsZW1lbnQsIGZvcndhcmRSZWYsIHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlQnJvd3Nlckhpc3RvcnksIGNyZWF0ZUhhc2hIaXN0b3J5IH0gZnJvbSAnaGlzdG9yeSc7XG5pbXBvcnQgeyBSb3V0ZXIsIHVzZUhyZWYsIGNyZWF0ZVBhdGgsIHVzZUxvY2F0aW9uLCB1c2VSZXNvbHZlZFBhdGgsIHVzZU5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcbmV4cG9ydCB7IE1lbW9yeVJvdXRlciwgTmF2aWdhdGUsIE5hdmlnYXRpb25UeXBlLCBPdXRsZXQsIFJvdXRlLCBSb3V0ZXIsIFJvdXRlcywgVU5TQUZFX0xvY2F0aW9uQ29udGV4dCwgVU5TQUZFX05hdmlnYXRpb25Db250ZXh0LCBVTlNBRkVfUm91dGVDb250ZXh0LCBjcmVhdGVQYXRoLCBjcmVhdGVSb3V0ZXNGcm9tQ2hpbGRyZW4sIGdlbmVyYXRlUGF0aCwgbWF0Y2hQYXRoLCBtYXRjaFJvdXRlcywgcGFyc2VQYXRoLCByZW5kZXJNYXRjaGVzLCByZXNvbHZlUGF0aCwgdXNlSHJlZiwgdXNlSW5Sb3V0ZXJDb250ZXh0LCB1c2VMb2NhdGlvbiwgdXNlTWF0Y2gsIHVzZU5hdmlnYXRlLCB1c2VOYXZpZ2F0aW9uVHlwZSwgdXNlT3V0bGV0LCB1c2VPdXRsZXRDb250ZXh0LCB1c2VQYXJhbXMsIHVzZVJlc29sdmVkUGF0aCwgdXNlUm91dGVzIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IF9leGNsdWRlZCA9IFtcIm9uQ2xpY2tcIiwgXCJyZWxvYWREb2N1bWVudFwiLCBcInJlcGxhY2VcIiwgXCJzdGF0ZVwiLCBcInRhcmdldFwiLCBcInRvXCJdLFxuICAgICAgX2V4Y2x1ZGVkMiA9IFtcImFyaWEtY3VycmVudFwiLCBcImNhc2VTZW5zaXRpdmVcIiwgXCJjbGFzc05hbWVcIiwgXCJlbmRcIiwgXCJzdHlsZVwiLCBcInRvXCIsIFwiY2hpbGRyZW5cIl07XG5cbmZ1bmN0aW9uIHdhcm5pbmcoY29uZCwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmQpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IFJvdXRlciFcbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIGVycm9yIGlzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHlvdSBjYW4gbW9yZSBlYXNpbHlcbiAgICAgIC8vIGZpbmQgdGhlIHNvdXJjZSBmb3IgYSB3YXJuaW5nIHRoYXQgYXBwZWFycyBpbiB0aGUgY29uc29sZSBieVxuICAgICAgLy8gZW5hYmxpbmcgXCJwYXVzZSBvbiBleGNlcHRpb25zXCIgaW4geW91ciBKYXZhU2NyaXB0IGRlYnVnZ2VyLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIEEgYDxSb3V0ZXI+YCBmb3IgdXNlIGluIHdlYiBicm93c2Vycy4gUHJvdmlkZXMgdGhlIGNsZWFuZXN0IFVSTHMuXG4gKi9cbmZ1bmN0aW9uIEJyb3dzZXJSb3V0ZXIoX3JlZikge1xuICBsZXQge1xuICAgIGJhc2VuYW1lLFxuICAgIGNoaWxkcmVuLFxuICAgIHdpbmRvd1xuICB9ID0gX3JlZjtcbiAgbGV0IGhpc3RvcnlSZWYgPSB1c2VSZWYoKTtcblxuICBpZiAoaGlzdG9yeVJlZi5jdXJyZW50ID09IG51bGwpIHtcbiAgICBoaXN0b3J5UmVmLmN1cnJlbnQgPSBjcmVhdGVCcm93c2VySGlzdG9yeSh7XG4gICAgICB3aW5kb3dcbiAgICB9KTtcbiAgfVxuXG4gIGxldCBoaXN0b3J5ID0gaGlzdG9yeVJlZi5jdXJyZW50O1xuICBsZXQgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSh7XG4gICAgYWN0aW9uOiBoaXN0b3J5LmFjdGlvbixcbiAgICBsb2NhdGlvbjogaGlzdG9yeS5sb2NhdGlvblxuICB9KTtcbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IGhpc3RvcnkubGlzdGVuKHNldFN0YXRlKSwgW2hpc3RvcnldKTtcbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9jcmVhdGVFbGVtZW50KFJvdXRlciwge1xuICAgIGJhc2VuYW1lOiBiYXNlbmFtZSxcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgbG9jYXRpb246IHN0YXRlLmxvY2F0aW9uLFxuICAgIG5hdmlnYXRpb25UeXBlOiBzdGF0ZS5hY3Rpb24sXG4gICAgbmF2aWdhdG9yOiBoaXN0b3J5XG4gIH0pO1xufVxuXG4vKipcbiAqIEEgYDxSb3V0ZXI+YCBmb3IgdXNlIGluIHdlYiBicm93c2Vycy4gU3RvcmVzIHRoZSBsb2NhdGlvbiBpbiB0aGUgaGFzaFxuICogcG9ydGlvbiBvZiB0aGUgVVJMIHNvIGl0IGlzIG5vdCBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIEhhc2hSb3V0ZXIoX3JlZjIpIHtcbiAgbGV0IHtcbiAgICBiYXNlbmFtZSxcbiAgICBjaGlsZHJlbixcbiAgICB3aW5kb3dcbiAgfSA9IF9yZWYyO1xuICBsZXQgaGlzdG9yeVJlZiA9IHVzZVJlZigpO1xuXG4gIGlmIChoaXN0b3J5UmVmLmN1cnJlbnQgPT0gbnVsbCkge1xuICAgIGhpc3RvcnlSZWYuY3VycmVudCA9IGNyZWF0ZUhhc2hIaXN0b3J5KHtcbiAgICAgIHdpbmRvd1xuICAgIH0pO1xuICB9XG5cbiAgbGV0IGhpc3RvcnkgPSBoaXN0b3J5UmVmLmN1cnJlbnQ7XG4gIGxldCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKHtcbiAgICBhY3Rpb246IGhpc3RvcnkuYWN0aW9uLFxuICAgIGxvY2F0aW9uOiBoaXN0b3J5LmxvY2F0aW9uXG4gIH0pO1xuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4gaGlzdG9yeS5saXN0ZW4oc2V0U3RhdGUpLCBbaGlzdG9yeV0pO1xuICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoUm91dGVyLCB7XG4gICAgYmFzZW5hbWU6IGJhc2VuYW1lLFxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBsb2NhdGlvbjogc3RhdGUubG9jYXRpb24sXG4gICAgbmF2aWdhdGlvblR5cGU6IHN0YXRlLmFjdGlvbixcbiAgICBuYXZpZ2F0b3I6IGhpc3RvcnlcbiAgfSk7XG59XG5cbi8qKlxuICogQSBgPFJvdXRlcj5gIHRoYXQgYWNjZXB0cyBhIHByZS1pbnN0YW50aWF0ZWQgaGlzdG9yeSBvYmplY3QuIEl0J3MgaW1wb3J0YW50XG4gKiB0byBub3RlIHRoYXQgdXNpbmcgeW91ciBvd24gaGlzdG9yeSBvYmplY3QgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIGFuZCBtYXkgYWRkXG4gKiB0d28gdmVyc2lvbnMgb2YgdGhlIGhpc3RvcnkgbGlicmFyeSB0byB5b3VyIGJ1bmRsZXMgdW5sZXNzIHlvdSB1c2UgdGhlIHNhbWVcbiAqIHZlcnNpb24gb2YgdGhlIGhpc3RvcnkgbGlicmFyeSB0aGF0IFJlYWN0IFJvdXRlciB1c2VzIGludGVybmFsbHkuXG4gKi9cbmZ1bmN0aW9uIEhpc3RvcnlSb3V0ZXIoX3JlZjMpIHtcbiAgbGV0IHtcbiAgICBiYXNlbmFtZSxcbiAgICBjaGlsZHJlbixcbiAgICBoaXN0b3J5XG4gIH0gPSBfcmVmMztcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSh7XG4gICAgYWN0aW9uOiBoaXN0b3J5LmFjdGlvbixcbiAgICBsb2NhdGlvbjogaGlzdG9yeS5sb2NhdGlvblxuICB9KTtcbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IGhpc3RvcnkubGlzdGVuKHNldFN0YXRlKSwgW2hpc3RvcnldKTtcbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9jcmVhdGVFbGVtZW50KFJvdXRlciwge1xuICAgIGJhc2VuYW1lOiBiYXNlbmFtZSxcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgbG9jYXRpb246IHN0YXRlLmxvY2F0aW9uLFxuICAgIG5hdmlnYXRpb25UeXBlOiBzdGF0ZS5hY3Rpb24sXG4gICAgbmF2aWdhdG9yOiBoaXN0b3J5XG4gIH0pO1xufVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIEhpc3RvcnlSb3V0ZXIuZGlzcGxheU5hbWUgPSBcInVuc3RhYmxlX0hpc3RvcnlSb3V0ZXJcIjtcbn1cblxuZnVuY3Rpb24gaXNNb2RpZmllZEV2ZW50KGV2ZW50KSB7XG4gIHJldHVybiAhIShldmVudC5tZXRhS2V5IHx8IGV2ZW50LmFsdEtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KTtcbn1cblxuLyoqXG4gKiBUaGUgcHVibGljIEFQSSBmb3IgcmVuZGVyaW5nIGEgaGlzdG9yeS1hd2FyZSA8YT4uXG4gKi9cbmNvbnN0IExpbmsgPSAvKiNfX1BVUkVfXyovZm9yd2FyZFJlZihmdW5jdGlvbiBMaW5rV2l0aFJlZihfcmVmNCwgcmVmKSB7XG4gIGxldCB7XG4gICAgb25DbGljayxcbiAgICByZWxvYWREb2N1bWVudCxcbiAgICByZXBsYWNlID0gZmFsc2UsXG4gICAgc3RhdGUsXG4gICAgdGFyZ2V0LFxuICAgIHRvXG4gIH0gPSBfcmVmNCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNCwgX2V4Y2x1ZGVkKTtcblxuICBsZXQgaHJlZiA9IHVzZUhyZWYodG8pO1xuICBsZXQgaW50ZXJuYWxPbkNsaWNrID0gdXNlTGlua0NsaWNrSGFuZGxlcih0bywge1xuICAgIHJlcGxhY2UsXG4gICAgc3RhdGUsXG4gICAgdGFyZ2V0XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soZXZlbnQpO1xuXG4gICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkICYmICFyZWxvYWREb2N1bWVudCkge1xuICAgICAgaW50ZXJuYWxPbkNsaWNrKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIC8qI19fUFVSRV9fKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvYW5jaG9yLWhhcy1jb250ZW50XG4gICAgY3JlYXRlRWxlbWVudChcImFcIiwgX2V4dGVuZHMoe30sIHJlc3QsIHtcbiAgICAgIGhyZWY6IGhyZWYsXG4gICAgICBvbkNsaWNrOiBoYW5kbGVDbGljayxcbiAgICAgIHJlZjogcmVmLFxuICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KSlcbiAgKTtcbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIExpbmsuZGlzcGxheU5hbWUgPSBcIkxpbmtcIjtcbn1cblxuLyoqXG4gKiBBIDxMaW5rPiB3cmFwcGVyIHRoYXQga25vd3MgaWYgaXQncyBcImFjdGl2ZVwiIG9yIG5vdC5cbiAqL1xuY29uc3QgTmF2TGluayA9IC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKGZ1bmN0aW9uIE5hdkxpbmtXaXRoUmVmKF9yZWY1LCByZWYpIHtcbiAgbGV0IHtcbiAgICBcImFyaWEtY3VycmVudFwiOiBhcmlhQ3VycmVudFByb3AgPSBcInBhZ2VcIixcbiAgICBjYXNlU2Vuc2l0aXZlID0gZmFsc2UsXG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWVQcm9wID0gXCJcIixcbiAgICBlbmQgPSBmYWxzZSxcbiAgICBzdHlsZTogc3R5bGVQcm9wLFxuICAgIHRvLFxuICAgIGNoaWxkcmVuXG4gIH0gPSBfcmVmNSxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkMik7XG5cbiAgbGV0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcbiAgbGV0IHBhdGggPSB1c2VSZXNvbHZlZFBhdGgodG8pO1xuICBsZXQgbG9jYXRpb25QYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICBsZXQgdG9QYXRobmFtZSA9IHBhdGgucGF0aG5hbWU7XG5cbiAgaWYgKCFjYXNlU2Vuc2l0aXZlKSB7XG4gICAgbG9jYXRpb25QYXRobmFtZSA9IGxvY2F0aW9uUGF0aG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB0b1BhdGhuYW1lID0gdG9QYXRobmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgbGV0IGlzQWN0aXZlID0gbG9jYXRpb25QYXRobmFtZSA9PT0gdG9QYXRobmFtZSB8fCAhZW5kICYmIGxvY2F0aW9uUGF0aG5hbWUuc3RhcnRzV2l0aCh0b1BhdGhuYW1lKSAmJiBsb2NhdGlvblBhdGhuYW1lLmNoYXJBdCh0b1BhdGhuYW1lLmxlbmd0aCkgPT09IFwiL1wiO1xuICBsZXQgYXJpYUN1cnJlbnQgPSBpc0FjdGl2ZSA/IGFyaWFDdXJyZW50UHJvcCA6IHVuZGVmaW5lZDtcbiAgbGV0IGNsYXNzTmFtZTtcblxuICBpZiAodHlwZW9mIGNsYXNzTmFtZVByb3AgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZVByb3Aoe1xuICAgICAgaXNBY3RpdmVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0aGUgY2xhc3NOYW1lIHByb3AgaXMgbm90IGEgZnVuY3Rpb24sIHdlIHVzZSBhIGRlZmF1bHQgYGFjdGl2ZWBcbiAgICAvLyBjbGFzcyBmb3IgPE5hdkxpbmsgLz5zIHRoYXQgYXJlIGFjdGl2ZS4gSW4gdjUgYGFjdGl2ZWAgd2FzIHRoZSBkZWZhdWx0XG4gICAgLy8gdmFsdWUgZm9yIGBhY3RpdmVDbGFzc05hbWVgLCBidXQgd2UgYXJlIHJlbW92aW5nIHRoYXQgQVBJIGFuZCBjYW4gc3RpbGxcbiAgICAvLyB1c2UgdGhlIG9sZCBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIGNsZWFuZXIgdXBncmFkZSBwYXRoIGFuZCBrZWVwIHRoZVxuICAgIC8vIHNpbXBsZSBzdHlsaW5nIHJ1bGVzIHdvcmtpbmcgYXMgdGhleSBjdXJyZW50bHkgZG8uXG4gICAgY2xhc3NOYW1lID0gW2NsYXNzTmFtZVByb3AsIGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IG51bGxdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIGxldCBzdHlsZSA9IHR5cGVvZiBzdHlsZVByb3AgPT09IFwiZnVuY3Rpb25cIiA/IHN0eWxlUHJvcCh7XG4gICAgaXNBY3RpdmVcbiAgfSkgOiBzdHlsZVByb3A7XG4gIHJldHVybiAvKiNfX1BVUkVfXyovY3JlYXRlRWxlbWVudChMaW5rLCBfZXh0ZW5kcyh7fSwgcmVzdCwge1xuICAgIFwiYXJpYS1jdXJyZW50XCI6IGFyaWFDdXJyZW50LFxuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgIHJlZjogcmVmLFxuICAgIHN0eWxlOiBzdHlsZSxcbiAgICB0bzogdG9cbiAgfSksIHR5cGVvZiBjaGlsZHJlbiA9PT0gXCJmdW5jdGlvblwiID8gY2hpbGRyZW4oe1xuICAgIGlzQWN0aXZlXG4gIH0pIDogY2hpbGRyZW4pO1xufSk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgTmF2TGluay5kaXNwbGF5TmFtZSA9IFwiTmF2TGlua1wiO1xufSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gSE9PS1Ncbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgY2xpY2sgYmVoYXZpb3IgZm9yIHJvdXRlciBgPExpbms+YCBjb21wb25lbnRzLiBUaGlzIGlzIHVzZWZ1bCBpZlxuICogeW91IG5lZWQgdG8gY3JlYXRlIGN1c3RvbSBgPExpbms+YCBjb21wb25lbnRzIHdpdGggdGhlIHNhbWUgY2xpY2sgYmVoYXZpb3Igd2VcbiAqIHVzZSBpbiBvdXIgZXhwb3J0ZWQgYDxMaW5rPmAuXG4gKi9cblxuXG5mdW5jdGlvbiB1c2VMaW5rQ2xpY2tIYW5kbGVyKHRvLCBfdGVtcCkge1xuICBsZXQge1xuICAgIHRhcmdldCxcbiAgICByZXBsYWNlOiByZXBsYWNlUHJvcCxcbiAgICBzdGF0ZVxuICB9ID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA7XG4gIGxldCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gIGxldCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG4gIGxldCBwYXRoID0gdXNlUmVzb2x2ZWRQYXRoKHRvKTtcbiAgcmV0dXJuIHVzZUNhbGxiYWNrKGV2ZW50ID0+IHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwICYmICggLy8gSWdub3JlIGV2ZXJ5dGhpbmcgYnV0IGxlZnQgY2xpY2tzXG4gICAgIXRhcmdldCB8fCB0YXJnZXQgPT09IFwiX3NlbGZcIikgJiYgLy8gTGV0IGJyb3dzZXIgaGFuZGxlIFwidGFyZ2V0PV9ibGFua1wiIGV0Yy5cbiAgICAhaXNNb2RpZmllZEV2ZW50KGV2ZW50KSAvLyBJZ25vcmUgY2xpY2tzIHdpdGggbW9kaWZpZXIga2V5c1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gSWYgdGhlIFVSTCBoYXNuJ3QgY2hhbmdlZCwgYSByZWd1bGFyIDxhPiB3aWxsIGRvIGEgcmVwbGFjZSBpbnN0ZWFkIG9mXG4gICAgICAvLyBhIHB1c2gsIHNvIGRvIHRoZSBzYW1lIGhlcmUuXG5cbiAgICAgIGxldCByZXBsYWNlID0gISFyZXBsYWNlUHJvcCB8fCBjcmVhdGVQYXRoKGxvY2F0aW9uKSA9PT0gY3JlYXRlUGF0aChwYXRoKTtcbiAgICAgIG5hdmlnYXRlKHRvLCB7XG4gICAgICAgIHJlcGxhY2UsXG4gICAgICAgIHN0YXRlXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtsb2NhdGlvbiwgbmF2aWdhdGUsIHBhdGgsIHJlcGxhY2VQcm9wLCBzdGF0ZSwgdGFyZ2V0LCB0b10pO1xufVxuLyoqXG4gKiBBIGNvbnZlbmllbnQgd3JhcHBlciBmb3IgcmVhZGluZyBhbmQgd3JpdGluZyBzZWFyY2ggcGFyYW1ldGVycyB2aWEgdGhlXG4gKiBVUkxTZWFyY2hQYXJhbXMgaW50ZXJmYWNlLlxuICovXG5cbmZ1bmN0aW9uIHVzZVNlYXJjaFBhcmFtcyhkZWZhdWx0SW5pdCkge1xuICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09IFwidW5kZWZpbmVkXCIsIFwiWW91IGNhbm5vdCB1c2UgdGhlIGB1c2VTZWFyY2hQYXJhbXNgIGhvb2sgaW4gYSBicm93c2VyIHRoYXQgZG9lcyBub3QgXCIgKyBcInN1cHBvcnQgdGhlIFVSTFNlYXJjaFBhcmFtcyBBUEkuIElmIHlvdSBuZWVkIHRvIHN1cHBvcnQgSW50ZXJuZXQgXCIgKyBcIkV4cGxvcmVyIDExLCB3ZSByZWNvbW1lbmQgeW91IGxvYWQgYSBwb2x5ZmlsbCBzdWNoIGFzIFwiICsgXCJodHRwczovL2dpdGh1Yi5jb20vdW5nYXAvdXJsLXNlYXJjaC1wYXJhbXNcXG5cXG5cIiArIFwiSWYgeW91J3JlIHVuc3VyZSBob3cgdG8gbG9hZCBwb2x5ZmlsbHMsIHdlIHJlY29tbWVuZCB5b3UgY2hlY2sgb3V0IFwiICsgXCJodHRwczovL3BvbHlmaWxsLmlvL3YzLyB3aGljaCBwcm92aWRlcyBzb21lIHJlY29tbWVuZGF0aW9ucyBhYm91dCBob3cgXCIgKyBcInRvIGxvYWQgcG9seWZpbGxzIG9ubHkgZm9yIHVzZXJzIHRoYXQgbmVlZCB0aGVtLCBpbnN0ZWFkIG9mIGZvciBldmVyeSBcIiArIFwidXNlci5cIikgOiB2b2lkIDA7XG4gIGxldCBkZWZhdWx0U2VhcmNoUGFyYW1zUmVmID0gdXNlUmVmKGNyZWF0ZVNlYXJjaFBhcmFtcyhkZWZhdWx0SW5pdCkpO1xuICBsZXQgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuICBsZXQgc2VhcmNoUGFyYW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IHNlYXJjaFBhcmFtcyA9IGNyZWF0ZVNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuXG4gICAgZm9yIChsZXQga2V5IG9mIGRlZmF1bHRTZWFyY2hQYXJhbXNSZWYuY3VycmVudC5rZXlzKCkpIHtcbiAgICAgIGlmICghc2VhcmNoUGFyYW1zLmhhcyhrZXkpKSB7XG4gICAgICAgIGRlZmF1bHRTZWFyY2hQYXJhbXNSZWYuY3VycmVudC5nZXRBbGwoa2V5KS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICBzZWFyY2hQYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VhcmNoUGFyYW1zO1xuICB9LCBbbG9jYXRpb24uc2VhcmNoXSk7XG4gIGxldCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKCk7XG4gIGxldCBzZXRTZWFyY2hQYXJhbXMgPSB1c2VDYWxsYmFjaygobmV4dEluaXQsIG5hdmlnYXRlT3B0aW9ucykgPT4ge1xuICAgIG5hdmlnYXRlKFwiP1wiICsgY3JlYXRlU2VhcmNoUGFyYW1zKG5leHRJbml0KSwgbmF2aWdhdGVPcHRpb25zKTtcbiAgfSwgW25hdmlnYXRlXSk7XG4gIHJldHVybiBbc2VhcmNoUGFyYW1zLCBzZXRTZWFyY2hQYXJhbXNdO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0IHVzaW5nIHRoZSBnaXZlbiBpbml0aWFsaXplci5cbiAqXG4gKiBUaGlzIGlzIGlkZW50aWNhbCB0byBgbmV3IFVSTFNlYXJjaFBhcmFtcyhpbml0KWAgZXhjZXB0IGl0IGFsc29cbiAqIHN1cHBvcnRzIGFycmF5cyBhcyB2YWx1ZXMgaW4gdGhlIG9iamVjdCBmb3JtIG9mIHRoZSBpbml0aWFsaXplclxuICogaW5zdGVhZCBvZiBqdXN0IHN0cmluZ3MuIFRoaXMgaXMgY29udmVuaWVudCB3aGVuIHlvdSBuZWVkIG11bHRpcGxlXG4gKiB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5LCBidXQgZG9uJ3Qgd2FudCB0byB1c2UgYW4gYXJyYXkgaW5pdGlhbGl6ZXIuXG4gKlxuICogRm9yIGV4YW1wbGUsIGluc3RlYWQgb2Y6XG4gKlxuICogICBsZXQgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhbXG4gKiAgICAgWydzb3J0JywgJ25hbWUnXSxcbiAqICAgICBbJ3NvcnQnLCAncHJpY2UnXVxuICogICBdKTtcbiAqXG4gKiB5b3UgY2FuIGRvOlxuICpcbiAqICAgbGV0IHNlYXJjaFBhcmFtcyA9IGNyZWF0ZVNlYXJjaFBhcmFtcyh7XG4gKiAgICAgc29ydDogWyduYW1lJywgJ3ByaWNlJ11cbiAqICAgfSk7XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaFBhcmFtcyhpbml0KSB7XG4gIGlmIChpbml0ID09PSB2b2lkIDApIHtcbiAgICBpbml0ID0gXCJcIjtcbiAgfVxuXG4gIHJldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKHR5cGVvZiBpbml0ID09PSBcInN0cmluZ1wiIHx8IEFycmF5LmlzQXJyYXkoaW5pdCkgfHwgaW5pdCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcyA/IGluaXQgOiBPYmplY3Qua2V5cyhpbml0KS5yZWR1Y2UoKG1lbW8sIGtleSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGluaXRba2V5XTtcbiAgICByZXR1cm4gbWVtby5jb25jYXQoQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5tYXAodiA9PiBba2V5LCB2XSkgOiBbW2tleSwgdmFsdWVdXSk7XG4gIH0sIFtdKSk7XG59XG5cbmV4cG9ydCB7IEJyb3dzZXJSb3V0ZXIsIEhhc2hSb3V0ZXIsIExpbmssIE5hdkxpbmssIGNyZWF0ZVNlYXJjaFBhcmFtcywgSGlzdG9yeVJvdXRlciBhcyB1bnN0YWJsZV9IaXN0b3J5Um91dGVyLCB1c2VMaW5rQ2xpY2tIYW5kbGVyLCB1c2VTZWFyY2hQYXJhbXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiLyoqXG4gKiBSZWFjdCBSb3V0ZXIgdjYuMi4yXG4gKlxuICogQ29weXJpZ2h0IChjKSBSZW1peCBTb2Z0d2FyZSBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLm1kIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZVJlZiwgdXNlU3RhdGUsIHVzZUxheW91dEVmZmVjdCwgY3JlYXRlRWxlbWVudCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VDYWxsYmFjaywgQ2hpbGRyZW4sIGlzVmFsaWRFbGVtZW50LCBGcmFnbWVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZU1lbW9yeUhpc3RvcnksIEFjdGlvbiwgcGFyc2VQYXRoIH0gZnJvbSAnaGlzdG9yeSc7XG5leHBvcnQgeyBBY3Rpb24gYXMgTmF2aWdhdGlvblR5cGUsIGNyZWF0ZVBhdGgsIHBhcnNlUGF0aCB9IGZyb20gJ2hpc3RvcnknO1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZCwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmQpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gd2FybmluZyhjb25kLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSBjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgUm91dGVyIVxuICAgICAgLy9cbiAgICAgIC8vIFRoaXMgZXJyb3IgaXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28geW91IGNhbiBtb3JlIGVhc2lseVxuICAgICAgLy8gZmluZCB0aGUgc291cmNlIGZvciBhIHdhcm5pbmcgdGhhdCBhcHBlYXJzIGluIHRoZSBjb25zb2xlIGJ5XG4gICAgICAvLyBlbmFibGluZyBcInBhdXNlIG9uIGV4Y2VwdGlvbnNcIiBpbiB5b3VyIEphdmFTY3JpcHQgZGVidWdnZXIuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbn1cblxuY29uc3QgYWxyZWFkeVdhcm5lZCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuaW5nT25jZShrZXksIGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kICYmICFhbHJlYWR5V2FybmVkW2tleV0pIHtcbiAgICBhbHJlYWR5V2FybmVkW2tleV0gPSB0cnVlO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcoZmFsc2UsIG1lc3NhZ2UpIDogdm9pZCAwO1xuICB9XG59IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIENPTlRFWFRcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBBIE5hdmlnYXRvciBpcyBhIFwibG9jYXRpb24gY2hhbmdlclwiOyBpdCdzIGhvdyB5b3UgZ2V0IHRvIGRpZmZlcmVudCBsb2NhdGlvbnMuXG4gKlxuICogRXZlcnkgaGlzdG9yeSBpbnN0YW5jZSBjb25mb3JtcyB0byB0aGUgTmF2aWdhdG9yIGludGVyZmFjZSwgYnV0IHRoZVxuICogZGlzdGluY3Rpb24gaXMgdXNlZnVsIHByaW1hcmlseSB3aGVuIGl0IGNvbWVzIHRvIHRoZSBsb3ctbGV2ZWwgPFJvdXRlcj4gQVBJXG4gKiB3aGVyZSBib3RoIHRoZSBsb2NhdGlvbiBhbmQgYSBuYXZpZ2F0b3IgbXVzdCBiZSBwcm92aWRlZCBzZXBhcmF0ZWx5IGluIG9yZGVyXG4gKiB0byBhdm9pZCBcInRlYXJpbmdcIiB0aGF0IG1heSBvY2N1ciBpbiBhIHN1c3BlbnNlLWVuYWJsZWQgYXBwIGlmIHRoZSBhY3Rpb25cbiAqIGFuZC9vciBsb2NhdGlvbiB3ZXJlIHRvIGJlIHJlYWQgZGlyZWN0bHkgZnJvbSB0aGUgaGlzdG9yeSBpbnN0YW5jZS5cbiAqL1xuXG5cbmNvbnN0IE5hdmlnYXRpb25Db250ZXh0ID0gLyojX19QVVJFX18qL2NyZWF0ZUNvbnRleHQobnVsbCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgTmF2aWdhdGlvbkNvbnRleHQuZGlzcGxheU5hbWUgPSBcIk5hdmlnYXRpb25cIjtcbn1cblxuY29uc3QgTG9jYXRpb25Db250ZXh0ID0gLyojX19QVVJFX18qL2NyZWF0ZUNvbnRleHQobnVsbCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgTG9jYXRpb25Db250ZXh0LmRpc3BsYXlOYW1lID0gXCJMb2NhdGlvblwiO1xufVxuXG5jb25zdCBSb3V0ZUNvbnRleHQgPSAvKiNfX1BVUkVfXyovY3JlYXRlQ29udGV4dCh7XG4gIG91dGxldDogbnVsbCxcbiAgbWF0Y2hlczogW11cbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIFJvdXRlQ29udGV4dC5kaXNwbGF5TmFtZSA9IFwiUm91dGVcIjtcbn0gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ09NUE9ORU5UU1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8qKlxuICogQSA8Um91dGVyPiB0aGF0IHN0b3JlcyBhbGwgZW50cmllcyBpbiBtZW1vcnkuXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSNtZW1vcnlyb3V0ZXJcbiAqL1xuZnVuY3Rpb24gTWVtb3J5Um91dGVyKF9yZWYpIHtcbiAgbGV0IHtcbiAgICBiYXNlbmFtZSxcbiAgICBjaGlsZHJlbixcbiAgICBpbml0aWFsRW50cmllcyxcbiAgICBpbml0aWFsSW5kZXhcbiAgfSA9IF9yZWY7XG4gIGxldCBoaXN0b3J5UmVmID0gdXNlUmVmKCk7XG5cbiAgaWYgKGhpc3RvcnlSZWYuY3VycmVudCA9PSBudWxsKSB7XG4gICAgaGlzdG9yeVJlZi5jdXJyZW50ID0gY3JlYXRlTWVtb3J5SGlzdG9yeSh7XG4gICAgICBpbml0aWFsRW50cmllcyxcbiAgICAgIGluaXRpYWxJbmRleFxuICAgIH0pO1xuICB9XG5cbiAgbGV0IGhpc3RvcnkgPSBoaXN0b3J5UmVmLmN1cnJlbnQ7XG4gIGxldCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKHtcbiAgICBhY3Rpb246IGhpc3RvcnkuYWN0aW9uLFxuICAgIGxvY2F0aW9uOiBoaXN0b3J5LmxvY2F0aW9uXG4gIH0pO1xuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4gaGlzdG9yeS5saXN0ZW4oc2V0U3RhdGUpLCBbaGlzdG9yeV0pO1xuICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoUm91dGVyLCB7XG4gICAgYmFzZW5hbWU6IGJhc2VuYW1lLFxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBsb2NhdGlvbjogc3RhdGUubG9jYXRpb24sXG4gICAgbmF2aWdhdGlvblR5cGU6IHN0YXRlLmFjdGlvbixcbiAgICBuYXZpZ2F0b3I6IGhpc3RvcnlcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hhbmdlcyB0aGUgY3VycmVudCBsb2NhdGlvbi5cbiAqXG4gKiBOb3RlOiBUaGlzIEFQSSBpcyBtb3N0bHkgdXNlZnVsIGluIFJlYWN0LkNvbXBvbmVudCBzdWJjbGFzc2VzIHRoYXQgYXJlIG5vdFxuICogYWJsZSB0byB1c2UgaG9va3MuIEluIGZ1bmN0aW9uYWwgY29tcG9uZW50cywgd2UgcmVjb21tZW5kIHlvdSB1c2UgdGhlXG4gKiBgdXNlTmF2aWdhdGVgIGhvb2sgaW5zdGVhZC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI25hdmlnYXRlXG4gKi9cbmZ1bmN0aW9uIE5hdmlnYXRlKF9yZWYyKSB7XG4gIGxldCB7XG4gICAgdG8sXG4gICAgcmVwbGFjZSxcbiAgICBzdGF0ZVxuICB9ID0gX3JlZjI7XG4gICF1c2VJblJvdXRlckNvbnRleHQoKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgLy8gVE9ETzogVGhpcyBlcnJvciBpcyBwcm9iYWJseSBiZWNhdXNlIHRoZXkgc29tZWhvdyBoYXZlIDIgdmVyc2lvbnMgb2ZcbiAgLy8gdGhlIHJvdXRlciBsb2FkZWQuIFdlIGNhbiBoZWxwIHRoZW0gdW5kZXJzdGFuZCBob3cgdG8gYXZvaWQgdGhhdC5cbiAgXCI8TmF2aWdhdGU+IG1heSBiZSB1c2VkIG9ubHkgaW4gdGhlIGNvbnRleHQgb2YgYSA8Um91dGVyPiBjb21wb25lbnQuXCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyghdXNlQ29udGV4dChOYXZpZ2F0aW9uQ29udGV4dCkuc3RhdGljLCBcIjxOYXZpZ2F0ZT4gbXVzdCBub3QgYmUgdXNlZCBvbiB0aGUgaW5pdGlhbCByZW5kZXIgaW4gYSA8U3RhdGljUm91dGVyPi4gXCIgKyBcIlRoaXMgaXMgYSBuby1vcCwgYnV0IHlvdSBzaG91bGQgbW9kaWZ5IHlvdXIgY29kZSBzbyB0aGUgPE5hdmlnYXRlPiBpcyBcIiArIFwib25seSBldmVyIHJlbmRlcmVkIGluIHJlc3BvbnNlIHRvIHNvbWUgdXNlciBpbnRlcmFjdGlvbiBvciBzdGF0ZSBjaGFuZ2UuXCIpIDogdm9pZCAwO1xuICBsZXQgbmF2aWdhdGUgPSB1c2VOYXZpZ2F0ZSgpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIG5hdmlnYXRlKHRvLCB7XG4gICAgICByZXBsYWNlLFxuICAgICAgc3RhdGVcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIGNoaWxkIHJvdXRlJ3MgZWxlbWVudCwgaWYgdGhlcmUgaXMgb25lLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9yZWFjdHJvdXRlci5jb20vZG9jcy9lbi92Ni9hcGkjb3V0bGV0XG4gKi9cbmZ1bmN0aW9uIE91dGxldChwcm9wcykge1xuICByZXR1cm4gdXNlT3V0bGV0KHByb3BzLmNvbnRleHQpO1xufVxuXG4vKipcbiAqIERlY2xhcmVzIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQgYXQgYSBjZXJ0YWluIFVSTCBwYXRoLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9yZWFjdHJvdXRlci5jb20vZG9jcy9lbi92Ni9hcGkjcm91dGVcbiAqL1xuZnVuY3Rpb24gUm91dGUoX3Byb3BzKSB7XG4gICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIFwiQSA8Um91dGU+IGlzIG9ubHkgZXZlciB0byBiZSB1c2VkIGFzIHRoZSBjaGlsZCBvZiA8Um91dGVzPiBlbGVtZW50LCBcIiArIFwibmV2ZXIgcmVuZGVyZWQgZGlyZWN0bHkuIFBsZWFzZSB3cmFwIHlvdXIgPFJvdXRlPiBpbiBhIDxSb3V0ZXM+LlwiKSA6IGludmFyaWFudChmYWxzZSkgO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGxvY2F0aW9uIGNvbnRleHQgZm9yIHRoZSByZXN0IG9mIHRoZSBhcHAuXG4gKlxuICogTm90ZTogWW91IHVzdWFsbHkgd29uJ3QgcmVuZGVyIGEgPFJvdXRlcj4gZGlyZWN0bHkuIEluc3RlYWQsIHlvdSdsbCByZW5kZXIgYVxuICogcm91dGVyIHRoYXQgaXMgbW9yZSBzcGVjaWZpYyB0byB5b3VyIGVudmlyb25tZW50IHN1Y2ggYXMgYSA8QnJvd3NlclJvdXRlcj5cbiAqIGluIHdlYiBicm93c2VycyBvciBhIDxTdGF0aWNSb3V0ZXI+IGZvciBzZXJ2ZXIgcmVuZGVyaW5nLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9yZWFjdHJvdXRlci5jb20vZG9jcy9lbi92Ni9hcGkjcm91dGVyXG4gKi9cbmZ1bmN0aW9uIFJvdXRlcihfcmVmMykge1xuICBsZXQge1xuICAgIGJhc2VuYW1lOiBiYXNlbmFtZVByb3AgPSBcIi9cIixcbiAgICBjaGlsZHJlbiA9IG51bGwsXG4gICAgbG9jYXRpb246IGxvY2F0aW9uUHJvcCxcbiAgICBuYXZpZ2F0aW9uVHlwZSA9IEFjdGlvbi5Qb3AsXG4gICAgbmF2aWdhdG9yLFxuICAgIHN0YXRpYzogc3RhdGljUHJvcCA9IGZhbHNlXG4gIH0gPSBfcmVmMztcbiAgISF1c2VJblJvdXRlckNvbnRleHQoKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgXCJZb3UgY2Fubm90IHJlbmRlciBhIDxSb3V0ZXI+IGluc2lkZSBhbm90aGVyIDxSb3V0ZXI+LlwiICsgXCIgWW91IHNob3VsZCBuZXZlciBoYXZlIG1vcmUgdGhhbiBvbmUgaW4geW91ciBhcHAuXCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgbGV0IGJhc2VuYW1lID0gbm9ybWFsaXplUGF0aG5hbWUoYmFzZW5hbWVQcm9wKTtcbiAgbGV0IG5hdmlnYXRpb25Db250ZXh0ID0gdXNlTWVtbygoKSA9PiAoe1xuICAgIGJhc2VuYW1lLFxuICAgIG5hdmlnYXRvcixcbiAgICBzdGF0aWM6IHN0YXRpY1Byb3BcbiAgfSksIFtiYXNlbmFtZSwgbmF2aWdhdG9yLCBzdGF0aWNQcm9wXSk7XG5cbiAgaWYgKHR5cGVvZiBsb2NhdGlvblByb3AgPT09IFwic3RyaW5nXCIpIHtcbiAgICBsb2NhdGlvblByb3AgPSBwYXJzZVBhdGgobG9jYXRpb25Qcm9wKTtcbiAgfVxuXG4gIGxldCB7XG4gICAgcGF0aG5hbWUgPSBcIi9cIixcbiAgICBzZWFyY2ggPSBcIlwiLFxuICAgIGhhc2ggPSBcIlwiLFxuICAgIHN0YXRlID0gbnVsbCxcbiAgICBrZXkgPSBcImRlZmF1bHRcIlxuICB9ID0gbG9jYXRpb25Qcm9wO1xuICBsZXQgbG9jYXRpb24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBsZXQgdHJhaWxpbmdQYXRobmFtZSA9IHN0cmlwQmFzZW5hbWUocGF0aG5hbWUsIGJhc2VuYW1lKTtcblxuICAgIGlmICh0cmFpbGluZ1BhdGhuYW1lID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwYXRobmFtZTogdHJhaWxpbmdQYXRobmFtZSxcbiAgICAgIHNlYXJjaCxcbiAgICAgIGhhc2gsXG4gICAgICBzdGF0ZSxcbiAgICAgIGtleVxuICAgIH07XG4gIH0sIFtiYXNlbmFtZSwgcGF0aG5hbWUsIHNlYXJjaCwgaGFzaCwgc3RhdGUsIGtleV0pO1xuICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGxvY2F0aW9uICE9IG51bGwsIFwiPFJvdXRlciBiYXNlbmFtZT1cXFwiXCIgKyBiYXNlbmFtZSArIFwiXFxcIj4gaXMgbm90IGFibGUgdG8gbWF0Y2ggdGhlIFVSTCBcIiArIChcIlxcXCJcIiArIHBhdGhuYW1lICsgc2VhcmNoICsgaGFzaCArIFwiXFxcIiBiZWNhdXNlIGl0IGRvZXMgbm90IHN0YXJ0IHdpdGggdGhlIFwiKSArIFwiYmFzZW5hbWUsIHNvIHRoZSA8Um91dGVyPiB3b24ndCByZW5kZXIgYW55dGhpbmcuXCIpIDogdm9pZCAwO1xuXG4gIGlmIChsb2NhdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoTmF2aWdhdGlvbkNvbnRleHQuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogbmF2aWdhdGlvbkNvbnRleHRcbiAgfSwgLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoTG9jYXRpb25Db250ZXh0LlByb3ZpZGVyLCB7XG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIHZhbHVlOiB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIG5hdmlnYXRpb25UeXBlXG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogQSBjb250YWluZXIgZm9yIGEgbmVzdGVkIHRyZWUgb2YgPFJvdXRlPiBlbGVtZW50cyB0aGF0IHJlbmRlcnMgdGhlIGJyYW5jaFxuICogdGhhdCBiZXN0IG1hdGNoZXMgdGhlIGN1cnJlbnQgbG9jYXRpb24uXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSNyb3V0ZXNcbiAqL1xuZnVuY3Rpb24gUm91dGVzKF9yZWY0KSB7XG4gIGxldCB7XG4gICAgY2hpbGRyZW4sXG4gICAgbG9jYXRpb25cbiAgfSA9IF9yZWY0O1xuICByZXR1cm4gdXNlUm91dGVzKGNyZWF0ZVJvdXRlc0Zyb21DaGlsZHJlbihjaGlsZHJlbiksIGxvY2F0aW9uKTtcbn0gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gSE9PS1Ncbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGhyZWYgZm9yIHRoZSBnaXZlbiBcInRvXCIgdmFsdWUuIFRoaXMgaXMgdXNlZnVsIGZvciBidWlsZGluZ1xuICogY3VzdG9tIGxpbmtzIHRoYXQgYXJlIGFsc28gYWNjZXNzaWJsZSBhbmQgcHJlc2VydmUgcmlnaHQtY2xpY2sgYmVoYXZpb3IuXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2VocmVmXG4gKi9cblxuZnVuY3Rpb24gdXNlSHJlZih0bykge1xuICAhdXNlSW5Sb3V0ZXJDb250ZXh0KCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIC8vIFRPRE86IFRoaXMgZXJyb3IgaXMgcHJvYmFibHkgYmVjYXVzZSB0aGV5IHNvbWVob3cgaGF2ZSAyIHZlcnNpb25zIG9mIHRoZVxuICAvLyByb3V0ZXIgbG9hZGVkLiBXZSBjYW4gaGVscCB0aGVtIHVuZGVyc3RhbmQgaG93IHRvIGF2b2lkIHRoYXQuXG4gIFwidXNlSHJlZigpIG1heSBiZSB1c2VkIG9ubHkgaW4gdGhlIGNvbnRleHQgb2YgYSA8Um91dGVyPiBjb21wb25lbnQuXCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgbGV0IHtcbiAgICBiYXNlbmFtZSxcbiAgICBuYXZpZ2F0b3JcbiAgfSA9IHVzZUNvbnRleHQoTmF2aWdhdGlvbkNvbnRleHQpO1xuICBsZXQge1xuICAgIGhhc2gsXG4gICAgcGF0aG5hbWUsXG4gICAgc2VhcmNoXG4gIH0gPSB1c2VSZXNvbHZlZFBhdGgodG8pO1xuICBsZXQgam9pbmVkUGF0aG5hbWUgPSBwYXRobmFtZTtcblxuICBpZiAoYmFzZW5hbWUgIT09IFwiL1wiKSB7XG4gICAgbGV0IHRvUGF0aG5hbWUgPSBnZXRUb1BhdGhuYW1lKHRvKTtcbiAgICBsZXQgZW5kc1dpdGhTbGFzaCA9IHRvUGF0aG5hbWUgIT0gbnVsbCAmJiB0b1BhdGhuYW1lLmVuZHNXaXRoKFwiL1wiKTtcbiAgICBqb2luZWRQYXRobmFtZSA9IHBhdGhuYW1lID09PSBcIi9cIiA/IGJhc2VuYW1lICsgKGVuZHNXaXRoU2xhc2ggPyBcIi9cIiA6IFwiXCIpIDogam9pblBhdGhzKFtiYXNlbmFtZSwgcGF0aG5hbWVdKTtcbiAgfVxuXG4gIHJldHVybiBuYXZpZ2F0b3IuY3JlYXRlSHJlZih7XG4gICAgcGF0aG5hbWU6IGpvaW5lZFBhdGhuYW1lLFxuICAgIHNlYXJjaCxcbiAgICBoYXNoXG4gIH0pO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBjb21wb25lbnQgaXMgYSBkZXNjZW5kYW50IG9mIGEgPFJvdXRlcj4uXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2VpbnJvdXRlcmNvbnRleHRcbiAqL1xuXG5mdW5jdGlvbiB1c2VJblJvdXRlckNvbnRleHQoKSB7XG4gIHJldHVybiB1c2VDb250ZXh0KExvY2F0aW9uQ29udGV4dCkgIT0gbnVsbDtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCBsb2NhdGlvbiBvYmplY3QsIHdoaWNoIHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgVVJMIGluIHdlYlxuICogYnJvd3NlcnMuXG4gKlxuICogTm90ZTogSWYgeW91J3JlIHVzaW5nIHRoaXMgaXQgbWF5IG1lYW4geW91J3JlIGRvaW5nIHNvbWUgb2YgeW91ciBvd25cbiAqIFwicm91dGluZ1wiIGluIHlvdXIgYXBwLCBhbmQgd2UnZCBsaWtlIHRvIGtub3cgd2hhdCB5b3VyIHVzZSBjYXNlIGlzLiBXZSBtYXlcbiAqIGJlIGFibGUgdG8gcHJvdmlkZSBzb21ldGhpbmcgaGlnaGVyLWxldmVsIHRvIGJldHRlciBzdWl0IHlvdXIgbmVlZHMuXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2Vsb2NhdGlvblxuICovXG5cbmZ1bmN0aW9uIHVzZUxvY2F0aW9uKCkge1xuICAhdXNlSW5Sb3V0ZXJDb250ZXh0KCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIC8vIFRPRE86IFRoaXMgZXJyb3IgaXMgcHJvYmFibHkgYmVjYXVzZSB0aGV5IHNvbWVob3cgaGF2ZSAyIHZlcnNpb25zIG9mIHRoZVxuICAvLyByb3V0ZXIgbG9hZGVkLiBXZSBjYW4gaGVscCB0aGVtIHVuZGVyc3RhbmQgaG93IHRvIGF2b2lkIHRoYXQuXG4gIFwidXNlTG9jYXRpb24oKSBtYXkgYmUgdXNlZCBvbmx5IGluIHRoZSBjb250ZXh0IG9mIGEgPFJvdXRlcj4gY29tcG9uZW50LlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gIHJldHVybiB1c2VDb250ZXh0KExvY2F0aW9uQ29udGV4dCkubG9jYXRpb247XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCBuYXZpZ2F0aW9uIGFjdGlvbiB3aGljaCBkZXNjcmliZXMgaG93IHRoZSByb3V0ZXIgY2FtZSB0b1xuICogdGhlIGN1cnJlbnQgbG9jYXRpb24sIGVpdGhlciBieSBhIHBvcCwgcHVzaCwgb3IgcmVwbGFjZSBvbiB0aGUgaGlzdG9yeSBzdGFjay5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI3VzZW5hdmlnYXRpb250eXBlXG4gKi9cbmZ1bmN0aW9uIHVzZU5hdmlnYXRpb25UeXBlKCkge1xuICByZXR1cm4gdXNlQ29udGV4dChMb2NhdGlvbkNvbnRleHQpLm5hdmlnYXRpb25UeXBlO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIFVSTCBmb3IgdGhlIGdpdmVuIFwidG9cIiB2YWx1ZSBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTC5cbiAqIFRoaXMgaXMgdXNlZnVsIGZvciBjb21wb25lbnRzIHRoYXQgbmVlZCB0byBrbm93IFwiYWN0aXZlXCIgc3RhdGUsIGUuZy5cbiAqIDxOYXZMaW5rPi5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI3VzZW1hdGNoXG4gKi9cblxuZnVuY3Rpb24gdXNlTWF0Y2gocGF0dGVybikge1xuICAhdXNlSW5Sb3V0ZXJDb250ZXh0KCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIC8vIFRPRE86IFRoaXMgZXJyb3IgaXMgcHJvYmFibHkgYmVjYXVzZSB0aGV5IHNvbWVob3cgaGF2ZSAyIHZlcnNpb25zIG9mIHRoZVxuICAvLyByb3V0ZXIgbG9hZGVkLiBXZSBjYW4gaGVscCB0aGVtIHVuZGVyc3RhbmQgaG93IHRvIGF2b2lkIHRoYXQuXG4gIFwidXNlTWF0Y2goKSBtYXkgYmUgdXNlZCBvbmx5IGluIHRoZSBjb250ZXh0IG9mIGEgPFJvdXRlcj4gY29tcG9uZW50LlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gIGxldCB7XG4gICAgcGF0aG5hbWVcbiAgfSA9IHVzZUxvY2F0aW9uKCk7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IG1hdGNoUGF0aChwYXR0ZXJuLCBwYXRobmFtZSksIFtwYXRobmFtZSwgcGF0dGVybl0pO1xufVxuLyoqXG4gKiBUaGUgaW50ZXJmYWNlIGZvciB0aGUgbmF2aWdhdGUoKSBmdW5jdGlvbiByZXR1cm5lZCBmcm9tIHVzZU5hdmlnYXRlKCkuXG4gKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGltcGVyYXRpdmUgbWV0aG9kIGZvciBjaGFuZ2luZyB0aGUgbG9jYXRpb24uIFVzZWQgYnkgPExpbms+cywgYnV0XG4gKiBtYXkgYWxzbyBiZSB1c2VkIGJ5IG90aGVyIGVsZW1lbnRzIHRvIGNoYW5nZSB0aGUgbG9jYXRpb24uXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2VuYXZpZ2F0ZVxuICovXG5mdW5jdGlvbiB1c2VOYXZpZ2F0ZSgpIHtcbiAgIXVzZUluUm91dGVyQ29udGV4dCgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAvLyBUT0RPOiBUaGlzIGVycm9yIGlzIHByb2JhYmx5IGJlY2F1c2UgdGhleSBzb21laG93IGhhdmUgMiB2ZXJzaW9ucyBvZiB0aGVcbiAgLy8gcm91dGVyIGxvYWRlZC4gV2UgY2FuIGhlbHAgdGhlbSB1bmRlcnN0YW5kIGhvdyB0byBhdm9pZCB0aGF0LlxuICBcInVzZU5hdmlnYXRlKCkgbWF5IGJlIHVzZWQgb25seSBpbiB0aGUgY29udGV4dCBvZiBhIDxSb3V0ZXI+IGNvbXBvbmVudC5cIikgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICBsZXQge1xuICAgIGJhc2VuYW1lLFxuICAgIG5hdmlnYXRvclxuICB9ID0gdXNlQ29udGV4dChOYXZpZ2F0aW9uQ29udGV4dCk7XG4gIGxldCB7XG4gICAgbWF0Y2hlc1xuICB9ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xuICBsZXQge1xuICAgIHBhdGhuYW1lOiBsb2NhdGlvblBhdGhuYW1lXG4gIH0gPSB1c2VMb2NhdGlvbigpO1xuICBsZXQgcm91dGVQYXRobmFtZXNKc29uID0gSlNPTi5zdHJpbmdpZnkobWF0Y2hlcy5tYXAobWF0Y2ggPT4gbWF0Y2gucGF0aG5hbWVCYXNlKSk7XG4gIGxldCBhY3RpdmVSZWYgPSB1c2VSZWYoZmFsc2UpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFjdGl2ZVJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgfSk7XG4gIGxldCBuYXZpZ2F0ZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0bywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGFjdGl2ZVJlZi5jdXJyZW50LCBcIllvdSBzaG91bGQgY2FsbCBuYXZpZ2F0ZSgpIGluIGEgUmVhY3QudXNlRWZmZWN0KCksIG5vdCB3aGVuIFwiICsgXCJ5b3VyIGNvbXBvbmVudCBpcyBmaXJzdCByZW5kZXJlZC5cIikgOiB2b2lkIDA7XG4gICAgaWYgKCFhY3RpdmVSZWYuY3VycmVudCkgcmV0dXJuO1xuXG4gICAgaWYgKHR5cGVvZiB0byA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbmF2aWdhdG9yLmdvKHRvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcGF0aCA9IHJlc29sdmVUbyh0bywgSlNPTi5wYXJzZShyb3V0ZVBhdGhuYW1lc0pzb24pLCBsb2NhdGlvblBhdGhuYW1lKTtcblxuICAgIGlmIChiYXNlbmFtZSAhPT0gXCIvXCIpIHtcbiAgICAgIHBhdGgucGF0aG5hbWUgPSBqb2luUGF0aHMoW2Jhc2VuYW1lLCBwYXRoLnBhdGhuYW1lXSk7XG4gICAgfVxuXG4gICAgKCEhb3B0aW9ucy5yZXBsYWNlID8gbmF2aWdhdG9yLnJlcGxhY2UgOiBuYXZpZ2F0b3IucHVzaCkocGF0aCwgb3B0aW9ucy5zdGF0ZSk7XG4gIH0sIFtiYXNlbmFtZSwgbmF2aWdhdG9yLCByb3V0ZVBhdGhuYW1lc0pzb24sIGxvY2F0aW9uUGF0aG5hbWVdKTtcbiAgcmV0dXJuIG5hdmlnYXRlO1xufVxuY29uc3QgT3V0bGV0Q29udGV4dCA9IC8qI19fUFVSRV9fKi9jcmVhdGVDb250ZXh0KG51bGwpO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBjb250ZXh0IChpZiBwcm92aWRlZCkgZm9yIHRoZSBjaGlsZCByb3V0ZSBhdCB0aGlzIGxldmVsIG9mIHRoZSByb3V0ZVxuICogaGllcmFyY2h5LlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2VvdXRsZXRjb250ZXh0XG4gKi9cblxuZnVuY3Rpb24gdXNlT3V0bGV0Q29udGV4dCgpIHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoT3V0bGV0Q29udGV4dCk7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGVsZW1lbnQgZm9yIHRoZSBjaGlsZCByb3V0ZSBhdCB0aGlzIGxldmVsIG9mIHRoZSByb3V0ZVxuICogaGllcmFyY2h5LiBVc2VkIGludGVybmFsbHkgYnkgPE91dGxldD4gdG8gcmVuZGVyIGNoaWxkIHJvdXRlcy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI3VzZW91dGxldFxuICovXG5cbmZ1bmN0aW9uIHVzZU91dGxldChjb250ZXh0KSB7XG4gIGxldCBvdXRsZXQgPSB1c2VDb250ZXh0KFJvdXRlQ29udGV4dCkub3V0bGV0O1xuXG4gIGlmIChvdXRsZXQpIHtcbiAgICByZXR1cm4gLyojX19QVVJFX18qL2NyZWF0ZUVsZW1lbnQoT3V0bGV0Q29udGV4dC5Qcm92aWRlciwge1xuICAgICAgdmFsdWU6IGNvbnRleHRcbiAgICB9LCBvdXRsZXQpO1xuICB9XG5cbiAgcmV0dXJuIG91dGxldDtcbn1cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzIG9mIHRoZSBkeW5hbWljIHBhcmFtcyBmcm9tIHRoZSBjdXJyZW50XG4gKiBVUkwgdGhhdCB3ZXJlIG1hdGNoZWQgYnkgdGhlIHJvdXRlIHBhdGguXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSN1c2VwYXJhbXNcbiAqL1xuXG5mdW5jdGlvbiB1c2VQYXJhbXMoKSB7XG4gIGxldCB7XG4gICAgbWF0Y2hlc1xuICB9ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xuICBsZXQgcm91dGVNYXRjaCA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXTtcbiAgcmV0dXJuIHJvdXRlTWF0Y2ggPyByb3V0ZU1hdGNoLnBhcmFtcyA6IHt9O1xufVxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgcGF0aG5hbWUgb2YgdGhlIGdpdmVuIGB0b2AgdmFsdWUgYWdhaW5zdCB0aGUgY3VycmVudCBsb2NhdGlvbi5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI3VzZXJlc29sdmVkcGF0aFxuICovXG5cbmZ1bmN0aW9uIHVzZVJlc29sdmVkUGF0aCh0bykge1xuICBsZXQge1xuICAgIG1hdGNoZXNcbiAgfSA9IHVzZUNvbnRleHQoUm91dGVDb250ZXh0KTtcbiAgbGV0IHtcbiAgICBwYXRobmFtZTogbG9jYXRpb25QYXRobmFtZVxuICB9ID0gdXNlTG9jYXRpb24oKTtcbiAgbGV0IHJvdXRlUGF0aG5hbWVzSnNvbiA9IEpTT04uc3RyaW5naWZ5KG1hdGNoZXMubWFwKG1hdGNoID0+IG1hdGNoLnBhdGhuYW1lQmFzZSkpO1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiByZXNvbHZlVG8odG8sIEpTT04ucGFyc2Uocm91dGVQYXRobmFtZXNKc29uKSwgbG9jYXRpb25QYXRobmFtZSksIFt0bywgcm91dGVQYXRobmFtZXNKc29uLCBsb2NhdGlvblBhdGhuYW1lXSk7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGVsZW1lbnQgb2YgdGhlIHJvdXRlIHRoYXQgbWF0Y2hlZCB0aGUgY3VycmVudCBsb2NhdGlvbiwgcHJlcGFyZWRcbiAqIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dCB0byByZW5kZXIgdGhlIHJlbWFpbmRlciBvZiB0aGUgcm91dGUgdHJlZS4gUm91dGVcbiAqIGVsZW1lbnRzIGluIHRoZSB0cmVlIG11c3QgcmVuZGVyIGFuIDxPdXRsZXQ+IHRvIHJlbmRlciB0aGVpciBjaGlsZCByb3V0ZSdzXG4gKiBlbGVtZW50LlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9yZWFjdHJvdXRlci5jb20vZG9jcy9lbi92Ni9hcGkjdXNlcm91dGVzXG4gKi9cblxuZnVuY3Rpb24gdXNlUm91dGVzKHJvdXRlcywgbG9jYXRpb25BcmcpIHtcbiAgIXVzZUluUm91dGVyQ29udGV4dCgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCAvLyBUT0RPOiBUaGlzIGVycm9yIGlzIHByb2JhYmx5IGJlY2F1c2UgdGhleSBzb21laG93IGhhdmUgMiB2ZXJzaW9ucyBvZiB0aGVcbiAgLy8gcm91dGVyIGxvYWRlZC4gV2UgY2FuIGhlbHAgdGhlbSB1bmRlcnN0YW5kIGhvdyB0byBhdm9pZCB0aGF0LlxuICBcInVzZVJvdXRlcygpIG1heSBiZSB1c2VkIG9ubHkgaW4gdGhlIGNvbnRleHQgb2YgYSA8Um91dGVyPiBjb21wb25lbnQuXCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgbGV0IHtcbiAgICBtYXRjaGVzOiBwYXJlbnRNYXRjaGVzXG4gIH0gPSB1c2VDb250ZXh0KFJvdXRlQ29udGV4dCk7XG4gIGxldCByb3V0ZU1hdGNoID0gcGFyZW50TWF0Y2hlc1twYXJlbnRNYXRjaGVzLmxlbmd0aCAtIDFdO1xuICBsZXQgcGFyZW50UGFyYW1zID0gcm91dGVNYXRjaCA/IHJvdXRlTWF0Y2gucGFyYW1zIDoge307XG4gIGxldCBwYXJlbnRQYXRobmFtZSA9IHJvdXRlTWF0Y2ggPyByb3V0ZU1hdGNoLnBhdGhuYW1lIDogXCIvXCI7XG4gIGxldCBwYXJlbnRQYXRobmFtZUJhc2UgPSByb3V0ZU1hdGNoID8gcm91dGVNYXRjaC5wYXRobmFtZUJhc2UgOiBcIi9cIjtcbiAgbGV0IHBhcmVudFJvdXRlID0gcm91dGVNYXRjaCAmJiByb3V0ZU1hdGNoLnJvdXRlO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAvLyBZb3Ugd29uJ3QgZ2V0IGEgd2FybmluZyBhYm91dCAyIGRpZmZlcmVudCA8Um91dGVzPiB1bmRlciBhIDxSb3V0ZT5cbiAgICAvLyB3aXRob3V0IGEgdHJhaWxpbmcgKiwgYnV0IHRoaXMgaXMgYSBiZXN0LWVmZm9ydCB3YXJuaW5nIGFueXdheSBzaW5jZSB3ZVxuICAgIC8vIGNhbm5vdCBldmVuIGdpdmUgdGhlIHdhcm5pbmcgdW5sZXNzIHRoZXkgbGFuZCBhdCB0aGUgcGFyZW50IHJvdXRlLlxuICAgIC8vXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvL1xuICAgIC8vIDxSb3V0ZXM+XG4gICAgLy8gICB7LyogVGhpcyByb3V0ZSBwYXRoIE1VU1QgZW5kIHdpdGggLyogYmVjYXVzZSBvdGhlcndpc2VcbiAgICAvLyAgICAgICBpdCB3aWxsIG5ldmVyIG1hdGNoIC9ibG9nL3Bvc3QvMTIzICovfVxuICAgIC8vICAgPFJvdXRlIHBhdGg9XCJibG9nXCIgZWxlbWVudD17PEJsb2cgLz59IC8+XG4gICAgLy8gICA8Um91dGUgcGF0aD1cImJsb2cvZmVlZFwiIGVsZW1lbnQ9ezxCbG9nRmVlZCAvPn0gLz5cbiAgICAvLyA8L1JvdXRlcz5cbiAgICAvL1xuICAgIC8vIGZ1bmN0aW9uIEJsb2coKSB7XG4gICAgLy8gICByZXR1cm4gKFxuICAgIC8vICAgICA8Um91dGVzPlxuICAgIC8vICAgICAgIDxSb3V0ZSBwYXRoPVwicG9zdC86aWRcIiBlbGVtZW50PXs8UG9zdCAvPn0gLz5cbiAgICAvLyAgICAgPC9Sb3V0ZXM+XG4gICAgLy8gICApO1xuICAgIC8vIH1cbiAgICBsZXQgcGFyZW50UGF0aCA9IHBhcmVudFJvdXRlICYmIHBhcmVudFJvdXRlLnBhdGggfHwgXCJcIjtcbiAgICB3YXJuaW5nT25jZShwYXJlbnRQYXRobmFtZSwgIXBhcmVudFJvdXRlIHx8IHBhcmVudFBhdGguZW5kc1dpdGgoXCIqXCIpLCBcIllvdSByZW5kZXJlZCBkZXNjZW5kYW50IDxSb3V0ZXM+IChvciBjYWxsZWQgYHVzZVJvdXRlcygpYCkgYXQgXCIgKyAoXCJcXFwiXCIgKyBwYXJlbnRQYXRobmFtZSArIFwiXFxcIiAodW5kZXIgPFJvdXRlIHBhdGg9XFxcIlwiICsgcGFyZW50UGF0aCArIFwiXFxcIj4pIGJ1dCB0aGUgXCIpICsgXCJwYXJlbnQgcm91dGUgcGF0aCBoYXMgbm8gdHJhaWxpbmcgXFxcIipcXFwiLiBUaGlzIG1lYW5zIGlmIHlvdSBuYXZpZ2F0ZSBcIiArIFwiZGVlcGVyLCB0aGUgcGFyZW50IHdvbid0IG1hdGNoIGFueW1vcmUgYW5kIHRoZXJlZm9yZSB0aGUgY2hpbGQgXCIgKyBcInJvdXRlcyB3aWxsIG5ldmVyIHJlbmRlci5cXG5cXG5cIiArIChcIlBsZWFzZSBjaGFuZ2UgdGhlIHBhcmVudCA8Um91dGUgcGF0aD1cXFwiXCIgKyBwYXJlbnRQYXRoICsgXCJcXFwiPiB0byA8Um91dGUgXCIpICsgKFwicGF0aD1cXFwiXCIgKyAocGFyZW50UGF0aCA9PT0gXCIvXCIgPyBcIipcIiA6IHBhcmVudFBhdGggKyBcIi8qXCIpICsgXCJcXFwiPi5cIikpO1xuICB9XG5cbiAgbGV0IGxvY2F0aW9uRnJvbUNvbnRleHQgPSB1c2VMb2NhdGlvbigpO1xuICBsZXQgbG9jYXRpb247XG5cbiAgaWYgKGxvY2F0aW9uQXJnKSB7XG4gICAgdmFyIF9wYXJzZWRMb2NhdGlvbkFyZyRwYTtcblxuICAgIGxldCBwYXJzZWRMb2NhdGlvbkFyZyA9IHR5cGVvZiBsb2NhdGlvbkFyZyA9PT0gXCJzdHJpbmdcIiA/IHBhcnNlUGF0aChsb2NhdGlvbkFyZykgOiBsb2NhdGlvbkFyZztcbiAgICAhKHBhcmVudFBhdGhuYW1lQmFzZSA9PT0gXCIvXCIgfHwgKChfcGFyc2VkTG9jYXRpb25BcmckcGEgPSBwYXJzZWRMb2NhdGlvbkFyZy5wYXRobmFtZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9wYXJzZWRMb2NhdGlvbkFyZyRwYS5zdGFydHNXaXRoKHBhcmVudFBhdGhuYW1lQmFzZSkpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgXCJXaGVuIG92ZXJyaWRpbmcgdGhlIGxvY2F0aW9uIHVzaW5nIGA8Um91dGVzIGxvY2F0aW9uPmAgb3IgYHVzZVJvdXRlcyhyb3V0ZXMsIGxvY2F0aW9uKWAsIFwiICsgXCJ0aGUgbG9jYXRpb24gcGF0aG5hbWUgbXVzdCBiZWdpbiB3aXRoIHRoZSBwb3J0aW9uIG9mIHRoZSBVUkwgcGF0aG5hbWUgdGhhdCB3YXMgXCIgKyAoXCJtYXRjaGVkIGJ5IGFsbCBwYXJlbnQgcm91dGVzLiBUaGUgY3VycmVudCBwYXRobmFtZSBiYXNlIGlzIFxcXCJcIiArIHBhcmVudFBhdGhuYW1lQmFzZSArIFwiXFxcIiBcIikgKyAoXCJidXQgcGF0aG5hbWUgXFxcIlwiICsgcGFyc2VkTG9jYXRpb25BcmcucGF0aG5hbWUgKyBcIlxcXCIgd2FzIGdpdmVuIGluIHRoZSBgbG9jYXRpb25gIHByb3AuXCIpKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgbG9jYXRpb24gPSBwYXJzZWRMb2NhdGlvbkFyZztcbiAgfSBlbHNlIHtcbiAgICBsb2NhdGlvbiA9IGxvY2F0aW9uRnJvbUNvbnRleHQ7XG4gIH1cblxuICBsZXQgcGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZSB8fCBcIi9cIjtcbiAgbGV0IHJlbWFpbmluZ1BhdGhuYW1lID0gcGFyZW50UGF0aG5hbWVCYXNlID09PSBcIi9cIiA/IHBhdGhuYW1lIDogcGF0aG5hbWUuc2xpY2UocGFyZW50UGF0aG5hbWVCYXNlLmxlbmd0aCkgfHwgXCIvXCI7XG4gIGxldCBtYXRjaGVzID0gbWF0Y2hSb3V0ZXMocm91dGVzLCB7XG4gICAgcGF0aG5hbWU6IHJlbWFpbmluZ1BhdGhuYW1lXG4gIH0pO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKHBhcmVudFJvdXRlIHx8IG1hdGNoZXMgIT0gbnVsbCwgXCJObyByb3V0ZXMgbWF0Y2hlZCBsb2NhdGlvbiBcXFwiXCIgKyBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2ggKyBcIlxcXCIgXCIpIDogdm9pZCAwO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcobWF0Y2hlcyA9PSBudWxsIHx8IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXS5yb3V0ZS5lbGVtZW50ICE9PSB1bmRlZmluZWQsIFwiTWF0Y2hlZCBsZWFmIHJvdXRlIGF0IGxvY2F0aW9uIFxcXCJcIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaCArIFwiXFxcIiBkb2VzIG5vdCBoYXZlIGFuIGVsZW1lbnQuIFwiICsgXCJUaGlzIG1lYW5zIGl0IHdpbGwgcmVuZGVyIGFuIDxPdXRsZXQgLz4gd2l0aCBhIG51bGwgdmFsdWUgYnkgZGVmYXVsdCByZXN1bHRpbmcgaW4gYW4gXFxcImVtcHR5XFxcIiBwYWdlLlwiKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHJldHVybiBfcmVuZGVyTWF0Y2hlcyhtYXRjaGVzICYmIG1hdGNoZXMubWFwKG1hdGNoID0+IE9iamVjdC5hc3NpZ24oe30sIG1hdGNoLCB7XG4gICAgcGFyYW1zOiBPYmplY3QuYXNzaWduKHt9LCBwYXJlbnRQYXJhbXMsIG1hdGNoLnBhcmFtcyksXG4gICAgcGF0aG5hbWU6IGpvaW5QYXRocyhbcGFyZW50UGF0aG5hbWVCYXNlLCBtYXRjaC5wYXRobmFtZV0pLFxuICAgIHBhdGhuYW1lQmFzZTogbWF0Y2gucGF0aG5hbWVCYXNlID09PSBcIi9cIiA/IHBhcmVudFBhdGhuYW1lQmFzZSA6IGpvaW5QYXRocyhbcGFyZW50UGF0aG5hbWVCYXNlLCBtYXRjaC5wYXRobmFtZUJhc2VdKVxuICB9KSksIHBhcmVudE1hdGNoZXMpO1xufSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBVVElMU1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIENyZWF0ZXMgYSByb3V0ZSBjb25maWcgZnJvbSBhIFJlYWN0IFwiY2hpbGRyZW5cIiBvYmplY3QsIHdoaWNoIGlzIHVzdWFsbHlcbiAqIGVpdGhlciBhIGA8Um91dGU+YCBlbGVtZW50IG9yIGFuIGFycmF5IG9mIHRoZW0uIFVzZWQgaW50ZXJuYWxseSBieVxuICogYDxSb3V0ZXM+YCB0byBjcmVhdGUgYSByb3V0ZSBjb25maWcgZnJvbSBpdHMgY2hpbGRyZW4uXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSNjcmVhdGVyb3V0ZXNmcm9tY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVSb3V0ZXNGcm9tQ2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgbGV0IHJvdXRlcyA9IFtdO1xuICBDaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCBlbGVtZW50ID0+IHtcbiAgICBpZiAoISAvKiNfX1BVUkVfXyovaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgIC8vIElnbm9yZSBub24tZWxlbWVudHMuIFRoaXMgYWxsb3dzIHBlb3BsZSB0byBtb3JlIGVhc2lseSBpbmxpbmVcbiAgICAgIC8vIGNvbmRpdGlvbmFscyBpbiB0aGVpciByb3V0ZSBjb25maWcuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQudHlwZSA9PT0gRnJhZ21lbnQpIHtcbiAgICAgIC8vIFRyYW5zcGFyZW50bHkgc3VwcG9ydCBSZWFjdC5GcmFnbWVudCBhbmQgaXRzIGNoaWxkcmVuLlxuICAgICAgcm91dGVzLnB1c2guYXBwbHkocm91dGVzLCBjcmVhdGVSb3V0ZXNGcm9tQ2hpbGRyZW4oZWxlbWVudC5wcm9wcy5jaGlsZHJlbikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICEoZWxlbWVudC50eXBlID09PSBSb3V0ZSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIFwiW1wiICsgKHR5cGVvZiBlbGVtZW50LnR5cGUgPT09IFwic3RyaW5nXCIgPyBlbGVtZW50LnR5cGUgOiBlbGVtZW50LnR5cGUubmFtZSkgKyBcIl0gaXMgbm90IGEgPFJvdXRlPiBjb21wb25lbnQuIEFsbCBjb21wb25lbnQgY2hpbGRyZW4gb2YgPFJvdXRlcz4gbXVzdCBiZSBhIDxSb3V0ZT4gb3IgPFJlYWN0LkZyYWdtZW50PlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgbGV0IHJvdXRlID0ge1xuICAgICAgY2FzZVNlbnNpdGl2ZTogZWxlbWVudC5wcm9wcy5jYXNlU2Vuc2l0aXZlLFxuICAgICAgZWxlbWVudDogZWxlbWVudC5wcm9wcy5lbGVtZW50LFxuICAgICAgaW5kZXg6IGVsZW1lbnQucHJvcHMuaW5kZXgsXG4gICAgICBwYXRoOiBlbGVtZW50LnByb3BzLnBhdGhcbiAgICB9O1xuXG4gICAgaWYgKGVsZW1lbnQucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgIHJvdXRlLmNoaWxkcmVuID0gY3JlYXRlUm91dGVzRnJvbUNoaWxkcmVuKGVsZW1lbnQucHJvcHMuY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIHJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgfSk7XG4gIHJldHVybiByb3V0ZXM7XG59XG4vKipcbiAqIFRoZSBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBwYXJzZWQgZnJvbSB0aGUgVVJMIHBhdGguXG4gKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgcGF0aCB3aXRoIHBhcmFtcyBpbnRlcnBvbGF0ZWQuXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSNnZW5lcmF0ZXBhdGhcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVQYXRoKHBhdGgsIHBhcmFtcykge1xuICBpZiAocGFyYW1zID09PSB2b2lkIDApIHtcbiAgICBwYXJhbXMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiBwYXRoLnJlcGxhY2UoLzooXFx3KykvZywgKF8sIGtleSkgPT4ge1xuICAgICEocGFyYW1zW2tleV0gIT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIFwiTWlzc2luZyBcXFwiOlwiICsga2V5ICsgXCJcXFwiIHBhcmFtXCIpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgICByZXR1cm4gcGFyYW1zW2tleV07XG4gIH0pLnJlcGxhY2UoL1xcLypcXCokLywgXyA9PiBwYXJhbXNbXCIqXCJdID09IG51bGwgPyBcIlwiIDogcGFyYW1zW1wiKlwiXS5yZXBsYWNlKC9eXFwvKi8sIFwiL1wiKSk7XG59XG4vKipcbiAqIEEgUm91dGVNYXRjaCBjb250YWlucyBpbmZvIGFib3V0IGhvdyBhIHJvdXRlIG1hdGNoZWQgYSBVUkwuXG4gKi9cblxuLyoqXG4gKiBNYXRjaGVzIHRoZSBnaXZlbiByb3V0ZXMgdG8gYSBsb2NhdGlvbiBhbmQgcmV0dXJucyB0aGUgbWF0Y2ggZGF0YS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI21hdGNocm91dGVzXG4gKi9cbmZ1bmN0aW9uIG1hdGNoUm91dGVzKHJvdXRlcywgbG9jYXRpb25BcmcsIGJhc2VuYW1lKSB7XG4gIGlmIChiYXNlbmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZW5hbWUgPSBcIi9cIjtcbiAgfVxuXG4gIGxldCBsb2NhdGlvbiA9IHR5cGVvZiBsb2NhdGlvbkFyZyA9PT0gXCJzdHJpbmdcIiA/IHBhcnNlUGF0aChsb2NhdGlvbkFyZykgOiBsb2NhdGlvbkFyZztcbiAgbGV0IHBhdGhuYW1lID0gc3RyaXBCYXNlbmFtZShsb2NhdGlvbi5wYXRobmFtZSB8fCBcIi9cIiwgYmFzZW5hbWUpO1xuXG4gIGlmIChwYXRobmFtZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgYnJhbmNoZXMgPSBmbGF0dGVuUm91dGVzKHJvdXRlcyk7XG4gIHJhbmtSb3V0ZUJyYW5jaGVzKGJyYW5jaGVzKTtcbiAgbGV0IG1hdGNoZXMgPSBudWxsO1xuXG4gIGZvciAobGV0IGkgPSAwOyBtYXRjaGVzID09IG51bGwgJiYgaSA8IGJyYW5jaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgbWF0Y2hlcyA9IG1hdGNoUm91dGVCcmFuY2goYnJhbmNoZXNbaV0sIHBhdGhuYW1lKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuUm91dGVzKHJvdXRlcywgYnJhbmNoZXMsIHBhcmVudHNNZXRhLCBwYXJlbnRQYXRoKSB7XG4gIGlmIChicmFuY2hlcyA9PT0gdm9pZCAwKSB7XG4gICAgYnJhbmNoZXMgPSBbXTtcbiAgfVxuXG4gIGlmIChwYXJlbnRzTWV0YSA9PT0gdm9pZCAwKSB7XG4gICAgcGFyZW50c01ldGEgPSBbXTtcbiAgfVxuXG4gIGlmIChwYXJlbnRQYXRoID09PSB2b2lkIDApIHtcbiAgICBwYXJlbnRQYXRoID0gXCJcIjtcbiAgfVxuXG4gIHJvdXRlcy5mb3JFYWNoKChyb3V0ZSwgaW5kZXgpID0+IHtcbiAgICBsZXQgbWV0YSA9IHtcbiAgICAgIHJlbGF0aXZlUGF0aDogcm91dGUucGF0aCB8fCBcIlwiLFxuICAgICAgY2FzZVNlbnNpdGl2ZTogcm91dGUuY2FzZVNlbnNpdGl2ZSA9PT0gdHJ1ZSxcbiAgICAgIGNoaWxkcmVuSW5kZXg6IGluZGV4LFxuICAgICAgcm91dGVcbiAgICB9O1xuXG4gICAgaWYgKG1ldGEucmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XG4gICAgICAhbWV0YS5yZWxhdGl2ZVBhdGguc3RhcnRzV2l0aChwYXJlbnRQYXRoKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmYWxzZSwgXCJBYnNvbHV0ZSByb3V0ZSBwYXRoIFxcXCJcIiArIG1ldGEucmVsYXRpdmVQYXRoICsgXCJcXFwiIG5lc3RlZCB1bmRlciBwYXRoIFwiICsgKFwiXFxcIlwiICsgcGFyZW50UGF0aCArIFwiXFxcIiBpcyBub3QgdmFsaWQuIEFuIGFic29sdXRlIGNoaWxkIHJvdXRlIHBhdGggXCIpICsgXCJtdXN0IHN0YXJ0IHdpdGggdGhlIGNvbWJpbmVkIHBhdGggb2YgYWxsIGl0cyBwYXJlbnQgcm91dGVzLlwiKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgICBtZXRhLnJlbGF0aXZlUGF0aCA9IG1ldGEucmVsYXRpdmVQYXRoLnNsaWNlKHBhcmVudFBhdGgubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBsZXQgcGF0aCA9IGpvaW5QYXRocyhbcGFyZW50UGF0aCwgbWV0YS5yZWxhdGl2ZVBhdGhdKTtcbiAgICBsZXQgcm91dGVzTWV0YSA9IHBhcmVudHNNZXRhLmNvbmNhdChtZXRhKTsgLy8gQWRkIHRoZSBjaGlsZHJlbiBiZWZvcmUgYWRkaW5nIHRoaXMgcm91dGUgdG8gdGhlIGFycmF5IHNvIHdlIHRyYXZlcnNlIHRoZVxuICAgIC8vIHJvdXRlIHRyZWUgZGVwdGgtZmlyc3QgYW5kIGNoaWxkIHJvdXRlcyBhcHBlYXIgYmVmb3JlIHRoZWlyIHBhcmVudHMgaW5cbiAgICAvLyB0aGUgXCJmbGF0dGVuZWRcIiB2ZXJzaW9uLlxuXG4gICAgaWYgKHJvdXRlLmNoaWxkcmVuICYmIHJvdXRlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICEocm91dGUuaW5kZXggIT09IHRydWUpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZhbHNlLCBcIkluZGV4IHJvdXRlcyBtdXN0IG5vdCBoYXZlIGNoaWxkIHJvdXRlcy4gUGxlYXNlIHJlbW92ZSBcIiArIChcImFsbCBjaGlsZCByb3V0ZXMgZnJvbSByb3V0ZSBwYXRoIFxcXCJcIiArIHBhdGggKyBcIlxcXCIuXCIpKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gICAgICBmbGF0dGVuUm91dGVzKHJvdXRlLmNoaWxkcmVuLCBicmFuY2hlcywgcm91dGVzTWV0YSwgcGF0aCk7XG4gICAgfSAvLyBSb3V0ZXMgd2l0aG91dCBhIHBhdGggc2hvdWxkbid0IGV2ZXIgbWF0Y2ggYnkgdGhlbXNlbHZlcyB1bmxlc3MgdGhleSBhcmVcbiAgICAvLyBpbmRleCByb3V0ZXMsIHNvIGRvbid0IGFkZCB0aGVtIHRvIHRoZSBsaXN0IG9mIHBvc3NpYmxlIGJyYW5jaGVzLlxuXG5cbiAgICBpZiAocm91dGUucGF0aCA9PSBudWxsICYmICFyb3V0ZS5pbmRleCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJyYW5jaGVzLnB1c2goe1xuICAgICAgcGF0aCxcbiAgICAgIHNjb3JlOiBjb21wdXRlU2NvcmUocGF0aCwgcm91dGUuaW5kZXgpLFxuICAgICAgcm91dGVzTWV0YVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGJyYW5jaGVzO1xufVxuXG5mdW5jdGlvbiByYW5rUm91dGVCcmFuY2hlcyhicmFuY2hlcykge1xuICBicmFuY2hlcy5zb3J0KChhLCBiKSA9PiBhLnNjb3JlICE9PSBiLnNjb3JlID8gYi5zY29yZSAtIGEuc2NvcmUgLy8gSGlnaGVyIHNjb3JlIGZpcnN0XG4gIDogY29tcGFyZUluZGV4ZXMoYS5yb3V0ZXNNZXRhLm1hcChtZXRhID0+IG1ldGEuY2hpbGRyZW5JbmRleCksIGIucm91dGVzTWV0YS5tYXAobWV0YSA9PiBtZXRhLmNoaWxkcmVuSW5kZXgpKSk7XG59XG5cbmNvbnN0IHBhcmFtUmUgPSAvXjpcXHcrJC87XG5jb25zdCBkeW5hbWljU2VnbWVudFZhbHVlID0gMztcbmNvbnN0IGluZGV4Um91dGVWYWx1ZSA9IDI7XG5jb25zdCBlbXB0eVNlZ21lbnRWYWx1ZSA9IDE7XG5jb25zdCBzdGF0aWNTZWdtZW50VmFsdWUgPSAxMDtcbmNvbnN0IHNwbGF0UGVuYWx0eSA9IC0yO1xuXG5jb25zdCBpc1NwbGF0ID0gcyA9PiBzID09PSBcIipcIjtcblxuZnVuY3Rpb24gY29tcHV0ZVNjb3JlKHBhdGgsIGluZGV4KSB7XG4gIGxldCBzZWdtZW50cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICBsZXQgaW5pdGlhbFNjb3JlID0gc2VnbWVudHMubGVuZ3RoO1xuXG4gIGlmIChzZWdtZW50cy5zb21lKGlzU3BsYXQpKSB7XG4gICAgaW5pdGlhbFNjb3JlICs9IHNwbGF0UGVuYWx0eTtcbiAgfVxuXG4gIGlmIChpbmRleCkge1xuICAgIGluaXRpYWxTY29yZSArPSBpbmRleFJvdXRlVmFsdWU7XG4gIH1cblxuICByZXR1cm4gc2VnbWVudHMuZmlsdGVyKHMgPT4gIWlzU3BsYXQocykpLnJlZHVjZSgoc2NvcmUsIHNlZ21lbnQpID0+IHNjb3JlICsgKHBhcmFtUmUudGVzdChzZWdtZW50KSA/IGR5bmFtaWNTZWdtZW50VmFsdWUgOiBzZWdtZW50ID09PSBcIlwiID8gZW1wdHlTZWdtZW50VmFsdWUgOiBzdGF0aWNTZWdtZW50VmFsdWUpLCBpbml0aWFsU2NvcmUpO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlSW5kZXhlcyhhLCBiKSB7XG4gIGxldCBzaWJsaW5ncyA9IGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLnNsaWNlKDAsIC0xKS5ldmVyeSgobiwgaSkgPT4gbiA9PT0gYltpXSk7XG4gIHJldHVybiBzaWJsaW5ncyA/IC8vIElmIHR3byByb3V0ZXMgYXJlIHNpYmxpbmdzLCB3ZSBzaG91bGQgdHJ5IHRvIG1hdGNoIHRoZSBlYXJsaWVyIHNpYmxpbmdcbiAgLy8gZmlyc3QuIFRoaXMgYWxsb3dzIHBlb3BsZSB0byBoYXZlIGZpbmUtZ3JhaW5lZCBjb250cm9sIG92ZXIgdGhlIG1hdGNoaW5nXG4gIC8vIGJlaGF2aW9yIGJ5IHNpbXBseSBwdXR0aW5nIHJvdXRlcyB3aXRoIGlkZW50aWNhbCBwYXRocyBpbiB0aGUgb3JkZXIgdGhleVxuICAvLyB3YW50IHRoZW0gdHJpZWQuXG4gIGFbYS5sZW5ndGggLSAxXSAtIGJbYi5sZW5ndGggLSAxXSA6IC8vIE90aGVyd2lzZSwgaXQgZG9lc24ndCByZWFsbHkgbWFrZSBzZW5zZSB0byByYW5rIG5vbi1zaWJsaW5ncyBieSBpbmRleCxcbiAgLy8gc28gdGhleSBzb3J0IGVxdWFsbHkuXG4gIDA7XG59XG5cbmZ1bmN0aW9uIG1hdGNoUm91dGVCcmFuY2goYnJhbmNoLCBwYXRobmFtZSkge1xuICBsZXQge1xuICAgIHJvdXRlc01ldGFcbiAgfSA9IGJyYW5jaDtcbiAgbGV0IG1hdGNoZWRQYXJhbXMgPSB7fTtcbiAgbGV0IG1hdGNoZWRQYXRobmFtZSA9IFwiL1wiO1xuICBsZXQgbWF0Y2hlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcm91dGVzTWV0YS5sZW5ndGg7ICsraSkge1xuICAgIGxldCBtZXRhID0gcm91dGVzTWV0YVtpXTtcbiAgICBsZXQgZW5kID0gaSA9PT0gcm91dGVzTWV0YS5sZW5ndGggLSAxO1xuICAgIGxldCByZW1haW5pbmdQYXRobmFtZSA9IG1hdGNoZWRQYXRobmFtZSA9PT0gXCIvXCIgPyBwYXRobmFtZSA6IHBhdGhuYW1lLnNsaWNlKG1hdGNoZWRQYXRobmFtZS5sZW5ndGgpIHx8IFwiL1wiO1xuICAgIGxldCBtYXRjaCA9IG1hdGNoUGF0aCh7XG4gICAgICBwYXRoOiBtZXRhLnJlbGF0aXZlUGF0aCxcbiAgICAgIGNhc2VTZW5zaXRpdmU6IG1ldGEuY2FzZVNlbnNpdGl2ZSxcbiAgICAgIGVuZFxuICAgIH0sIHJlbWFpbmluZ1BhdGhuYW1lKTtcbiAgICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcbiAgICBPYmplY3QuYXNzaWduKG1hdGNoZWRQYXJhbXMsIG1hdGNoLnBhcmFtcyk7XG4gICAgbGV0IHJvdXRlID0gbWV0YS5yb3V0ZTtcbiAgICBtYXRjaGVzLnB1c2goe1xuICAgICAgcGFyYW1zOiBtYXRjaGVkUGFyYW1zLFxuICAgICAgcGF0aG5hbWU6IGpvaW5QYXRocyhbbWF0Y2hlZFBhdGhuYW1lLCBtYXRjaC5wYXRobmFtZV0pLFxuICAgICAgcGF0aG5hbWVCYXNlOiBub3JtYWxpemVQYXRobmFtZShqb2luUGF0aHMoW21hdGNoZWRQYXRobmFtZSwgbWF0Y2gucGF0aG5hbWVCYXNlXSkpLFxuICAgICAgcm91dGVcbiAgICB9KTtcblxuICAgIGlmIChtYXRjaC5wYXRobmFtZUJhc2UgIT09IFwiL1wiKSB7XG4gICAgICBtYXRjaGVkUGF0aG5hbWUgPSBqb2luUGF0aHMoW21hdGNoZWRQYXRobmFtZSwgbWF0Y2gucGF0aG5hbWVCYXNlXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59XG4vKipcbiAqIFJlbmRlcnMgdGhlIHJlc3VsdCBvZiBgbWF0Y2hSb3V0ZXMoKWAgaW50byBhIFJlYWN0IGVsZW1lbnQuXG4gKi9cblxuXG5mdW5jdGlvbiByZW5kZXJNYXRjaGVzKG1hdGNoZXMpIHtcbiAgcmV0dXJuIF9yZW5kZXJNYXRjaGVzKG1hdGNoZXMpO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyTWF0Y2hlcyhtYXRjaGVzLCBwYXJlbnRNYXRjaGVzKSB7XG4gIGlmIChwYXJlbnRNYXRjaGVzID09PSB2b2lkIDApIHtcbiAgICBwYXJlbnRNYXRjaGVzID0gW107XG4gIH1cblxuICBpZiAobWF0Y2hlcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG1hdGNoZXMucmVkdWNlUmlnaHQoKG91dGxldCwgbWF0Y2gsIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIC8qI19fUFVSRV9fKi9jcmVhdGVFbGVtZW50KFJvdXRlQ29udGV4dC5Qcm92aWRlciwge1xuICAgICAgY2hpbGRyZW46IG1hdGNoLnJvdXRlLmVsZW1lbnQgIT09IHVuZGVmaW5lZCA/IG1hdGNoLnJvdXRlLmVsZW1lbnQgOiBvdXRsZXQsXG4gICAgICB2YWx1ZToge1xuICAgICAgICBvdXRsZXQsXG4gICAgICAgIG1hdGNoZXM6IHBhcmVudE1hdGNoZXMuY29uY2F0KG1hdGNoZXMuc2xpY2UoMCwgaW5kZXggKyAxKSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgbnVsbCk7XG59XG4vKipcbiAqIEEgUGF0aFBhdHRlcm4gaXMgdXNlZCB0byBtYXRjaCBvbiBzb21lIHBvcnRpb24gb2YgYSBVUkwgcGF0aG5hbWUuXG4gKi9cblxuXG4vKipcbiAqIFBlcmZvcm1zIHBhdHRlcm4gbWF0Y2hpbmcgb24gYSBVUkwgcGF0aG5hbWUgYW5kIHJldHVybnMgaW5mb3JtYXRpb24gYWJvdXRcbiAqIHRoZSBtYXRjaC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vcmVhY3Ryb3V0ZXIuY29tL2RvY3MvZW4vdjYvYXBpI21hdGNocGF0aFxuICovXG5mdW5jdGlvbiBtYXRjaFBhdGgocGF0dGVybiwgcGF0aG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSBcInN0cmluZ1wiKSB7XG4gICAgcGF0dGVybiA9IHtcbiAgICAgIHBhdGg6IHBhdHRlcm4sXG4gICAgICBjYXNlU2Vuc2l0aXZlOiBmYWxzZSxcbiAgICAgIGVuZDogdHJ1ZVxuICAgIH07XG4gIH1cblxuICBsZXQgW21hdGNoZXIsIHBhcmFtTmFtZXNdID0gY29tcGlsZVBhdGgocGF0dGVybi5wYXRoLCBwYXR0ZXJuLmNhc2VTZW5zaXRpdmUsIHBhdHRlcm4uZW5kKTtcbiAgbGV0IG1hdGNoID0gcGF0aG5hbWUubWF0Y2gobWF0Y2hlcik7XG4gIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuICBsZXQgbWF0Y2hlZFBhdGhuYW1lID0gbWF0Y2hbMF07XG4gIGxldCBwYXRobmFtZUJhc2UgPSBtYXRjaGVkUGF0aG5hbWUucmVwbGFjZSgvKC4pXFwvKyQvLCBcIiQxXCIpO1xuICBsZXQgY2FwdHVyZUdyb3VwcyA9IG1hdGNoLnNsaWNlKDEpO1xuICBsZXQgcGFyYW1zID0gcGFyYW1OYW1lcy5yZWR1Y2UoKG1lbW8sIHBhcmFtTmFtZSwgaW5kZXgpID0+IHtcbiAgICAvLyBXZSBuZWVkIHRvIGNvbXB1dGUgdGhlIHBhdGhuYW1lQmFzZSBoZXJlIHVzaW5nIHRoZSByYXcgc3BsYXQgdmFsdWVcbiAgICAvLyBpbnN0ZWFkIG9mIHVzaW5nIHBhcmFtc1tcIipcIl0gbGF0ZXIgYmVjYXVzZSBpdCB3aWxsIGJlIGRlY29kZWQgdGhlblxuICAgIGlmIChwYXJhbU5hbWUgPT09IFwiKlwiKSB7XG4gICAgICBsZXQgc3BsYXRWYWx1ZSA9IGNhcHR1cmVHcm91cHNbaW5kZXhdIHx8IFwiXCI7XG4gICAgICBwYXRobmFtZUJhc2UgPSBtYXRjaGVkUGF0aG5hbWUuc2xpY2UoMCwgbWF0Y2hlZFBhdGhuYW1lLmxlbmd0aCAtIHNwbGF0VmFsdWUubGVuZ3RoKS5yZXBsYWNlKC8oLilcXC8rJC8sIFwiJDFcIik7XG4gICAgfVxuXG4gICAgbWVtb1twYXJhbU5hbWVdID0gc2FmZWx5RGVjb2RlVVJJQ29tcG9uZW50KGNhcHR1cmVHcm91cHNbaW5kZXhdIHx8IFwiXCIsIHBhcmFtTmFtZSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbiAgcmV0dXJuIHtcbiAgICBwYXJhbXMsXG4gICAgcGF0aG5hbWU6IG1hdGNoZWRQYXRobmFtZSxcbiAgICBwYXRobmFtZUJhc2UsXG4gICAgcGF0dGVyblxuICB9O1xufVxuXG5mdW5jdGlvbiBjb21waWxlUGF0aChwYXRoLCBjYXNlU2Vuc2l0aXZlLCBlbmQpIHtcbiAgaWYgKGNhc2VTZW5zaXRpdmUgPT09IHZvaWQgMCkge1xuICAgIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChlbmQgPT09IHZvaWQgMCkge1xuICAgIGVuZCA9IHRydWU7XG4gIH1cblxuICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKHBhdGggPT09IFwiKlwiIHx8ICFwYXRoLmVuZHNXaXRoKFwiKlwiKSB8fCBwYXRoLmVuZHNXaXRoKFwiLypcIiksIFwiUm91dGUgcGF0aCBcXFwiXCIgKyBwYXRoICsgXCJcXFwiIHdpbGwgYmUgdHJlYXRlZCBhcyBpZiBpdCB3ZXJlIFwiICsgKFwiXFxcIlwiICsgcGF0aC5yZXBsYWNlKC9cXCokLywgXCIvKlwiKSArIFwiXFxcIiBiZWNhdXNlIHRoZSBgKmAgY2hhcmFjdGVyIG11c3QgXCIpICsgXCJhbHdheXMgZm9sbG93IGEgYC9gIGluIHRoZSBwYXR0ZXJuLiBUbyBnZXQgcmlkIG9mIHRoaXMgd2FybmluZywgXCIgKyAoXCJwbGVhc2UgY2hhbmdlIHRoZSByb3V0ZSBwYXRoIHRvIFxcXCJcIiArIHBhdGgucmVwbGFjZSgvXFwqJC8sIFwiLypcIikgKyBcIlxcXCIuXCIpKSA6IHZvaWQgMDtcbiAgbGV0IHBhcmFtTmFtZXMgPSBbXTtcbiAgbGV0IHJlZ2V4cFNvdXJjZSA9IFwiXlwiICsgcGF0aC5yZXBsYWNlKC9cXC8qXFwqPyQvLCBcIlwiKSAvLyBJZ25vcmUgdHJhaWxpbmcgLyBhbmQgLyosIHdlJ2xsIGhhbmRsZSBpdCBiZWxvd1xuICAucmVwbGFjZSgvXlxcLyovLCBcIi9cIikgLy8gTWFrZSBzdXJlIGl0IGhhcyBhIGxlYWRpbmcgL1xuICAucmVwbGFjZSgvW1xcXFwuKiteJD97fXwoKVtcXF1dL2csIFwiXFxcXCQmXCIpIC8vIEVzY2FwZSBzcGVjaWFsIHJlZ2V4IGNoYXJzXG4gIC5yZXBsYWNlKC86KFxcdyspL2csIChfLCBwYXJhbU5hbWUpID0+IHtcbiAgICBwYXJhbU5hbWVzLnB1c2gocGFyYW1OYW1lKTtcbiAgICByZXR1cm4gXCIoW15cXFxcL10rKVwiO1xuICB9KTtcblxuICBpZiAocGF0aC5lbmRzV2l0aChcIipcIikpIHtcbiAgICBwYXJhbU5hbWVzLnB1c2goXCIqXCIpO1xuICAgIHJlZ2V4cFNvdXJjZSArPSBwYXRoID09PSBcIipcIiB8fCBwYXRoID09PSBcIi8qXCIgPyBcIiguKikkXCIgLy8gQWxyZWFkeSBtYXRjaGVkIHRoZSBpbml0aWFsIC8sIGp1c3QgbWF0Y2ggdGhlIHJlc3RcbiAgICA6IFwiKD86XFxcXC8oLispfFxcXFwvKikkXCI7IC8vIERvbid0IGluY2x1ZGUgdGhlIC8gaW4gcGFyYW1zW1wiKlwiXVxuICB9IGVsc2Uge1xuICAgIHJlZ2V4cFNvdXJjZSArPSBlbmQgPyBcIlxcXFwvKiRcIiAvLyBXaGVuIG1hdGNoaW5nIHRvIHRoZSBlbmQsIGlnbm9yZSB0cmFpbGluZyBzbGFzaGVzXG4gICAgOiAvLyBPdGhlcndpc2UsIG1hdGNoIGEgd29yZCBib3VuZGFyeSBvciBhIHByb2NlZWRpbmcgLy4gVGhlIHdvcmQgYm91bmRhcnkgcmVzdHJpY3RzXG4gICAgLy8gcGFyZW50IHJvdXRlcyB0byBtYXRjaGluZyBvbmx5IHRoZWlyIG93biB3b3JkcyBhbmQgbm90aGluZyBtb3JlLCBlLmcuIHBhcmVudFxuICAgIC8vIHJvdXRlIFwiL2hvbWVcIiBzaG91bGQgbm90IG1hdGNoIFwiL2hvbWUyXCIuXG4gICAgLy8gQWRkaXRpb25hbGx5LCBhbGxvdyBwYXRocyBzdGFydGluZyB3aXRoIGAuYCwgYC1gLCBgfmAsIGFuZCB1cmwtZW5jb2RlZCBlbnRpdGllcyxcbiAgICAvLyBidXQgZG8gbm90IGNvbnN1bWUgdGhlIGNoYXJhY3RlciBpbiB0aGUgbWF0Y2hlZCBwYXRoIHNvIHRoZXkgY2FuIG1hdGNoIGFnYWluc3RcbiAgICAvLyBuZXN0ZWQgcGF0aHMuXG4gICAgXCIoPzooPz1bLn4tXXwlWzAtOUEtRl17Mn0pfFxcXFxifFxcXFwvfCQpXCI7XG4gIH1cblxuICBsZXQgbWF0Y2hlciA9IG5ldyBSZWdFeHAocmVnZXhwU291cmNlLCBjYXNlU2Vuc2l0aXZlID8gdW5kZWZpbmVkIDogXCJpXCIpO1xuICByZXR1cm4gW21hdGNoZXIsIHBhcmFtTmFtZXNdO1xufVxuXG5mdW5jdGlvbiBzYWZlbHlEZWNvZGVVUklDb21wb25lbnQodmFsdWUsIHBhcmFtTmFtZSkge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcoZmFsc2UsIFwiVGhlIHZhbHVlIGZvciB0aGUgVVJMIHBhcmFtIFxcXCJcIiArIHBhcmFtTmFtZSArIFwiXFxcIiB3aWxsIG5vdCBiZSBkZWNvZGVkIGJlY2F1c2VcIiArIChcIiB0aGUgc3RyaW5nIFxcXCJcIiArIHZhbHVlICsgXCJcXFwiIGlzIGEgbWFsZm9ybWVkIFVSTCBzZWdtZW50LiBUaGlzIGlzIHByb2JhYmx5XCIpICsgKFwiIGR1ZSB0byBhIGJhZCBwZXJjZW50IGVuY29kaW5nIChcIiArIGVycm9yICsgXCIpLlwiKSkgOiB2b2lkIDA7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG4vKipcbiAqIFJldHVybnMgYSByZXNvbHZlZCBwYXRoIG9iamVjdCByZWxhdGl2ZSB0byB0aGUgZ2l2ZW4gcGF0aG5hbWUuXG4gKlxuICogQHNlZSBodHRwczovL3JlYWN0cm91dGVyLmNvbS9kb2NzL2VuL3Y2L2FwaSNyZXNvbHZlcGF0aFxuICovXG5cblxuZnVuY3Rpb24gcmVzb2x2ZVBhdGgodG8sIGZyb21QYXRobmFtZSkge1xuICBpZiAoZnJvbVBhdGhuYW1lID09PSB2b2lkIDApIHtcbiAgICBmcm9tUGF0aG5hbWUgPSBcIi9cIjtcbiAgfVxuXG4gIGxldCB7XG4gICAgcGF0aG5hbWU6IHRvUGF0aG5hbWUsXG4gICAgc2VhcmNoID0gXCJcIixcbiAgICBoYXNoID0gXCJcIlxuICB9ID0gdHlwZW9mIHRvID09PSBcInN0cmluZ1wiID8gcGFyc2VQYXRoKHRvKSA6IHRvO1xuICBsZXQgcGF0aG5hbWUgPSB0b1BhdGhuYW1lID8gdG9QYXRobmFtZS5zdGFydHNXaXRoKFwiL1wiKSA/IHRvUGF0aG5hbWUgOiByZXNvbHZlUGF0aG5hbWUodG9QYXRobmFtZSwgZnJvbVBhdGhuYW1lKSA6IGZyb21QYXRobmFtZTtcbiAgcmV0dXJuIHtcbiAgICBwYXRobmFtZSxcbiAgICBzZWFyY2g6IG5vcm1hbGl6ZVNlYXJjaChzZWFyY2gpLFxuICAgIGhhc2g6IG5vcm1hbGl6ZUhhc2goaGFzaClcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVBhdGhuYW1lKHJlbGF0aXZlUGF0aCwgZnJvbVBhdGhuYW1lKSB7XG4gIGxldCBzZWdtZW50cyA9IGZyb21QYXRobmFtZS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpLnNwbGl0KFwiL1wiKTtcbiAgbGV0IHJlbGF0aXZlU2VnbWVudHMgPSByZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xuICByZWxhdGl2ZVNlZ21lbnRzLmZvckVhY2goc2VnbWVudCA9PiB7XG4gICAgaWYgKHNlZ21lbnQgPT09IFwiLi5cIikge1xuICAgICAgLy8gS2VlcCB0aGUgcm9vdCBcIlwiIHNlZ21lbnQgc28gdGhlIHBhdGhuYW1lIHN0YXJ0cyBhdCAvXG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMSkgc2VnbWVudHMucG9wKCk7XG4gICAgfSBlbHNlIGlmIChzZWdtZW50ICE9PSBcIi5cIikge1xuICAgICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VnbWVudHMubGVuZ3RoID4gMSA/IHNlZ21lbnRzLmpvaW4oXCIvXCIpIDogXCIvXCI7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUbyh0b0FyZywgcm91dGVQYXRobmFtZXMsIGxvY2F0aW9uUGF0aG5hbWUpIHtcbiAgbGV0IHRvID0gdHlwZW9mIHRvQXJnID09PSBcInN0cmluZ1wiID8gcGFyc2VQYXRoKHRvQXJnKSA6IHRvQXJnO1xuICBsZXQgdG9QYXRobmFtZSA9IHRvQXJnID09PSBcIlwiIHx8IHRvLnBhdGhuYW1lID09PSBcIlwiID8gXCIvXCIgOiB0by5wYXRobmFtZTsgLy8gSWYgYSBwYXRobmFtZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkIGluIGB0b2AsIGl0IHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGVcbiAgLy8gcm91dGUgY29udGV4dC4gVGhpcyBpcyBleHBsYWluZWQgaW4gYE5vdGUgb24gYDxMaW5rIHRvPmAgdmFsdWVzYCBpbiBvdXJcbiAgLy8gbWlncmF0aW9uIGd1aWRlIGZyb20gdjUgYXMgYSBtZWFucyBvZiBkaXNhbWJpZ3VhdGlvbiBiZXR3ZWVuIGB0b2AgdmFsdWVzXG4gIC8vIHRoYXQgYmVnaW4gd2l0aCBgL2AgYW5kIHRob3NlIHRoYXQgZG8gbm90LiBIb3dldmVyLCB0aGlzIGlzIHByb2JsZW1hdGljIGZvclxuICAvLyBgdG9gIHZhbHVlcyB0aGF0IGRvIG5vdCBwcm92aWRlIGEgcGF0aG5hbWUuIGB0b2AgY2FuIHNpbXBseSBiZSBhIHNlYXJjaCBvclxuICAvLyBoYXNoIHN0cmluZywgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgYXNzdW1lIHRoYXQgdGhlIG5hdmlnYXRpb24gaXMgcmVsYXRpdmVcbiAgLy8gdG8gdGhlIGN1cnJlbnQgbG9jYXRpb24ncyBwYXRobmFtZSBhbmQgKm5vdCogdGhlIHJvdXRlIHBhdGhuYW1lLlxuXG4gIGxldCBmcm9tO1xuXG4gIGlmICh0b1BhdGhuYW1lID09IG51bGwpIHtcbiAgICBmcm9tID0gbG9jYXRpb25QYXRobmFtZTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcm91dGVQYXRobmFtZUluZGV4ID0gcm91dGVQYXRobmFtZXMubGVuZ3RoIC0gMTtcblxuICAgIGlmICh0b1BhdGhuYW1lLnN0YXJ0c1dpdGgoXCIuLlwiKSkge1xuICAgICAgbGV0IHRvU2VnbWVudHMgPSB0b1BhdGhuYW1lLnNwbGl0KFwiL1wiKTsgLy8gRWFjaCBsZWFkaW5nIC4uIHNlZ21lbnQgbWVhbnMgXCJnbyB1cCBvbmUgcm91dGVcIiBpbnN0ZWFkIG9mIFwiZ28gdXAgb25lXG4gICAgICAvLyBVUkwgc2VnbWVudFwiLiAgVGhpcyBpcyBhIGtleSBkaWZmZXJlbmNlIGZyb20gaG93IDxhIGhyZWY+IHdvcmtzIGFuZCBhXG4gICAgICAvLyBtYWpvciByZWFzb24gd2UgY2FsbCB0aGlzIGEgXCJ0b1wiIHZhbHVlIGluc3RlYWQgb2YgYSBcImhyZWZcIi5cblxuICAgICAgd2hpbGUgKHRvU2VnbWVudHNbMF0gPT09IFwiLi5cIikge1xuICAgICAgICB0b1NlZ21lbnRzLnNoaWZ0KCk7XG4gICAgICAgIHJvdXRlUGF0aG5hbWVJbmRleCAtPSAxO1xuICAgICAgfVxuXG4gICAgICB0by5wYXRobmFtZSA9IHRvU2VnbWVudHMuam9pbihcIi9cIik7XG4gICAgfSAvLyBJZiB0aGVyZSBhcmUgbW9yZSBcIi4uXCIgc2VnbWVudHMgdGhhbiBwYXJlbnQgcm91dGVzLCByZXNvbHZlIHJlbGF0aXZlIHRvXG4gICAgLy8gdGhlIHJvb3QgLyBVUkwuXG5cblxuICAgIGZyb20gPSByb3V0ZVBhdGhuYW1lSW5kZXggPj0gMCA/IHJvdXRlUGF0aG5hbWVzW3JvdXRlUGF0aG5hbWVJbmRleF0gOiBcIi9cIjtcbiAgfVxuXG4gIGxldCBwYXRoID0gcmVzb2x2ZVBhdGgodG8sIGZyb20pOyAvLyBFbnN1cmUgdGhlIHBhdGhuYW1lIGhhcyBhIHRyYWlsaW5nIHNsYXNoIGlmIHRoZSBvcmlnaW5hbCB0byB2YWx1ZSBoYWQgb25lLlxuXG4gIGlmICh0b1BhdGhuYW1lICYmIHRvUGF0aG5hbWUgIT09IFwiL1wiICYmIHRvUGF0aG5hbWUuZW5kc1dpdGgoXCIvXCIpICYmICFwYXRoLnBhdGhuYW1lLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgIHBhdGgucGF0aG5hbWUgKz0gXCIvXCI7XG4gIH1cblxuICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gZ2V0VG9QYXRobmFtZSh0bykge1xuICAvLyBFbXB0eSBzdHJpbmdzIHNob3VsZCBiZSB0cmVhdGVkIHRoZSBzYW1lIGFzIC8gcGF0aHNcbiAgcmV0dXJuIHRvID09PSBcIlwiIHx8IHRvLnBhdGhuYW1lID09PSBcIlwiID8gXCIvXCIgOiB0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIgPyBwYXJzZVBhdGgodG8pLnBhdGhuYW1lIDogdG8ucGF0aG5hbWU7XG59XG5cbmZ1bmN0aW9uIHN0cmlwQmFzZW5hbWUocGF0aG5hbWUsIGJhc2VuYW1lKSB7XG4gIGlmIChiYXNlbmFtZSA9PT0gXCIvXCIpIHJldHVybiBwYXRobmFtZTtcblxuICBpZiAoIXBhdGhuYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChiYXNlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IG5leHRDaGFyID0gcGF0aG5hbWUuY2hhckF0KGJhc2VuYW1lLmxlbmd0aCk7XG5cbiAgaWYgKG5leHRDaGFyICYmIG5leHRDaGFyICE9PSBcIi9cIikge1xuICAgIC8vIHBhdGhuYW1lIGRvZXMgbm90IHN0YXJ0IHdpdGggYmFzZW5hbWUvXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGF0aG5hbWUuc2xpY2UoYmFzZW5hbWUubGVuZ3RoKSB8fCBcIi9cIjtcbn1cblxuY29uc3Qgam9pblBhdGhzID0gcGF0aHMgPT4gcGF0aHMuam9pbihcIi9cIikucmVwbGFjZSgvXFwvXFwvKy9nLCBcIi9cIik7XG5cbmNvbnN0IG5vcm1hbGl6ZVBhdGhuYW1lID0gcGF0aG5hbWUgPT4gcGF0aG5hbWUucmVwbGFjZSgvXFwvKyQvLCBcIlwiKS5yZXBsYWNlKC9eXFwvKi8sIFwiL1wiKTtcblxuY29uc3Qgbm9ybWFsaXplU2VhcmNoID0gc2VhcmNoID0+ICFzZWFyY2ggfHwgc2VhcmNoID09PSBcIj9cIiA/IFwiXCIgOiBzZWFyY2guc3RhcnRzV2l0aChcIj9cIikgPyBzZWFyY2ggOiBcIj9cIiArIHNlYXJjaDtcblxuY29uc3Qgbm9ybWFsaXplSGFzaCA9IGhhc2ggPT4gIWhhc2ggfHwgaGFzaCA9PT0gXCIjXCIgPyBcIlwiIDogaGFzaC5zdGFydHNXaXRoKFwiI1wiKSA/IGhhc2ggOiBcIiNcIiArIGhhc2g7IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IHsgTWVtb3J5Um91dGVyLCBOYXZpZ2F0ZSwgT3V0bGV0LCBSb3V0ZSwgUm91dGVyLCBSb3V0ZXMsIExvY2F0aW9uQ29udGV4dCBhcyBVTlNBRkVfTG9jYXRpb25Db250ZXh0LCBOYXZpZ2F0aW9uQ29udGV4dCBhcyBVTlNBRkVfTmF2aWdhdGlvbkNvbnRleHQsIFJvdXRlQ29udGV4dCBhcyBVTlNBRkVfUm91dGVDb250ZXh0LCBjcmVhdGVSb3V0ZXNGcm9tQ2hpbGRyZW4sIGdlbmVyYXRlUGF0aCwgbWF0Y2hQYXRoLCBtYXRjaFJvdXRlcywgcmVuZGVyTWF0Y2hlcywgcmVzb2x2ZVBhdGgsIHVzZUhyZWYsIHVzZUluUm91dGVyQ29udGV4dCwgdXNlTG9jYXRpb24sIHVzZU1hdGNoLCB1c2VOYXZpZ2F0ZSwgdXNlTmF2aWdhdGlvblR5cGUsIHVzZU91dGxldCwgdXNlT3V0bGV0Q29udGV4dCwgdXNlUGFyYW1zLCB1c2VSZXNvbHZlZFBhdGgsIHVzZVJvdXRlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCJpbXBvcnQgJy4vQXBwLmNzcyc7XHJcbmltcG9ydCB7XHJcbiAgQnJvd3NlclJvdXRlciBhcyBSb3V0ZXIsXHJcbiAgUm91dGVzLFxyXG4gIFJvdXRlXHJcbn0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5mdW5jdGlvbiBBcHAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxSb3V0ZXI+XHJcbiAgICAgIDxSb3V0ZXMgPlxyXG4gICAgICAgICAgPFJvdXRlIHBhdGg9Jy9ob21lL2xvZ2luJyBlbGVtZW50PXs8PiBsb2dpbjwvPn0gLz5cclxuICAgICAgICAgIDxSb3V0ZSBwYXRoPScvaG9tZS9yZWdpc3RlcicgZWxlbWVudD17PD4gcmVnaXN0ZXIgPC8+fSAvPlxyXG4gICAgICA8L1JvdXRlcz5cclxuICAgIDwvUm91dGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5cclxuaW1wb3J0IEFwcCBmcm9tICcuL2NvbXBvbmVudHMvQXBwJztcclxuXHJcblxyXG5SZWFjdERPTS5yZW5kZXIoXHJcbiAgPFJlYWN0LlN0cmljdE1vZGU+XHJcbiAgICAgIDxBcHAgLz5cclxuICA8L1JlYWN0LlN0cmljdE1vZGU+LFxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKVxyXG4pO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufSIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImRlM2I0NTM3M2IzYzhmOTcwZTI0XCIpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9