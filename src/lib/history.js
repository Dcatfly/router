let getLocation = source => {
  return {
    ...source.location,
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || "initial"
  };
};

let createHistory = (source, options) => {
  let listeners = [];
  let location = getLocation(source);
  let transitioning = false;
  let resolveTransition = () => {};

  return {
    get location() {
      return location;
    },

    get transitioning() {
      return transitioning;
    },

    // 用来resolve navigate方法返回的Promise
    _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },

    listen(listener) {
      listeners.push(listener);

      let popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };

      source.addEventListener("popstate", popstateListener);

      return () => {
        source.removeEventListener("popstate", popstateListener);
        listeners = listeners.filter(fn => fn !== listener);
      };
    },

    navigate(to, { state, replace = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (transitioning || replace) {
          source.history.replaceState(state, null, to);
        } else {
          source.history.pushState(state, null, to);
        }
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }

      location = getLocation(source);
      transitioning = true;
      // navigate返回了个Promise
      // 在Location的componentDidUpdate中调用了resolveTransition，令这个promise进入下一步
      // 这样可以在执行navigate跳转到新的路由并渲染完之后执行一些操作。比如控制动画的开关之类的。
      let transition = new Promise(res => (resolveTransition = res));
      listeners.forEach(listener => listener({ location, action: "PUSH" }));
      return transition;
    }
  };
};

////////////////////////////////////////////////////////////////////////////////
// Stores history entries in memory for testing or other platforms like Native
let createMemorySource = (initialPathname = "/") => {
  let index = 0;
  let stack = [{ pathname: initialPathname, search: "" }];
  let states = [];

  return {
    get location() {
      return stack[index];
    },
    // 这也太假了
    addEventListener(name, fn) {},
    removeEventListener(name, fn) {},
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        let [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        let [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
};

////////////////////////////////////////////////////////////////////////////////
// global history - uses window.history as the source if available, otherwise a
// memory history
let canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);
let getSource = () => {
  return canUseDOM ? window : createMemorySource();
};

let globalHistory = createHistory(getSource());
let { navigate } = globalHistory;

////////////////////////////////////////////////////////////////////////////////
// 整个history文件中只做了一件事，创建globalHistory。
// 如果有DOM window则使用window.history做封装，如果没有就虚拟一个包含四个方法的window
export { globalHistory, navigate, createHistory, createMemorySource };
