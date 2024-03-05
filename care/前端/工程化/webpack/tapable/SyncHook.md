# SyncHook

```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  // 设置 编译过程中的 钩子处理事件
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onDone,
      rethrowIfPossible,
    });
  }
}

const factory = new SyncHookCodeFactory();

// 同步钩子 不支持非同步的订阅
const TAP_ASYNC = () => {
  throw new Error("tapAsync is not supported on a SyncHook");
};
const TAP_PROMISE = () => {
  throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE = function (options) {
  // 设置 _x
  factory.setup(this, options);
  return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  hook.compile = COMPILE;
  return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;
```
