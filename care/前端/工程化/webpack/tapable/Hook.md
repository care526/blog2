# Hook

```js
const util = require("util");

// done
const deprecateContext = util.deprecate(() => {},
"Hook.context is deprecated and will be removed");

// 构造同步方法
const CALL_DELEGATE = function (...args) {
  // 计算新的执行函数，赋值给 call
  // 如果没有新的订阅了，这个函数就不会再执行了
  this.call = this._createCall("sync");
  return this.call(...args);
};
// 构造异步方法
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

class Hook {
  constructor(args = [], name = undefined) {
    // 形参，在执行的时候传递给钩子函数
    this._args = args;

    // 钩子的 名字
    this.name = name;

    // 钩子订阅的数组
    this.taps = [];

    // 钩子订阅的拦截器数组
    this.interceptors = [];

    // 执行同步订阅的私有方法
    this._call = CALL_DELEGATE;
    // 执行同步订阅的方法
    this.call = CALL_DELEGATE;

    // 执行异步订阅的私有方法(通过 调用callback 执行钩子是否完成的通知)
    this._callAsync = CALL_ASYNC_DELEGATE;
    // 执行异步订阅的方法
    this.callAsync = CALL_ASYNC_DELEGATE;

    // 执行异步订阅的私有方法(通过 返回的Promise的状态 判断钩子是否完成的通知)
    this._promise = PROMISE_DELEGATE;
    // 执行异步订阅的方法
    this.promise = PROMISE_DELEGATE;

    // 钩子函数数组 由工厂函数的 setup 生成赋值
    this._x = undefined;

    this.compile = this.compile;

    // 四个方法挂载
    this.tap = this.tap;
    this.tapAsync = this.tapAsync;
    this.tapPromise = this.tapPromise;
  }

  // 编译器 创建具体的执行函数 抽象方法需要继承后具体实现
  compile(options) {
    throw new Error("Abstract: should be overridden");
  }

  // 执行构造执行函数的私有方法
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      interceptors: this.interceptors,
      args: this._args,
      type: type,
    });
  }

  _tap(type, options, fn) {
    // options 只支持 string object
    if (typeof options === "string") {
      // 传入字符串作为 订阅的name
      options = {
        name: options.trim(),
      };
    } else if (typeof options !== "object" || options === null) {
      throw new Error("Invalid tap options");
    }

    // 到这里 options 已经是配置对象了
    if (typeof options.name !== "string" || options.name === "") {
      throw new Error("Missing name for tap");
    }
    if (typeof options.context !== "undefined") {
      // 该版本 逐渐不支持该参数，兼容之前的老代码，提示以下报错
      // (node:23652) DeprecationWarning: Hook.context is deprecated and will be removed
      // (Use `node --trace-deprecation ...` to show where the warning was created)
      deprecateContext();
    }
    // 合并所有参数属性
    options = Object.assign({ type, fn }, options);
    // 注册 函数执行前的拦截器
    options = this._runRegisterInterceptors(options);

    // 新的订阅插入到现有的订阅数组中
    this._insert(options);
  }

  // tap('test', () => {})
  // tap({
  //  name: 'test',
  //  before: '',
  //  stage: ''
  // }, () => {})
  tap(options, fn) {
    this._tap("sync", options, fn);
  }
  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }
  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }

  // done
  _runRegisterInterceptors(options) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        const newOptions = interceptor.register(options);
        if (newOptions !== undefined) {
          options = newOptions;
        }
      }
    }
    return options;
  }

  // TODO
  isUsed() {
    return this.taps.length > 0 || this.interceptors.length > 0;
  }
  // TODO
  withOptions(options) {
    const mergeOptions = (opt) =>
      Object.assign({}, options, typeof opt === "string" ? { name: opt } : opt);

    return {
      name: this.name,
      tap: (opt, fn) => this.tap(mergeOptions(opt), fn),
      tapAsync: (opt, fn) => this.tapAsync(mergeOptions(opt), fn),
      tapPromise: (opt, fn) => this.tapPromise(mergeOptions(opt), fn),
      intercept: (interceptor) => this.intercept(interceptor),
      isUsed: () => this.isUsed(),
      withOptions: (opt) => this.withOptions(mergeOptions(opt)),
    };
  }

  // 注册 拦截器
  intercept(interceptor) {
    this._resetCompilation();
    this.interceptors.push(Object.assign({}, interceptor));
    if (interceptor.register) {
      for (let i = 0; i < this.taps.length; i++) {
        this.taps[i] = interceptor.register(this.taps[i]);
      }
    }
  }

  // done
  _resetCompilation() {
    // 在每次有新的订阅的时候 还原 call 为 _call 当下次 call 执行的时候 先去计算一下新的执行函数 赋值给call
    this.call = this._call;
    this.callAsync = this._callAsync;
    this.promise = this._promise;
  }

  // 向订阅数组中插入新的订阅
  _insert(item) {
    this._resetCompilation();
    let before;
    if (typeof item.before === "string") {
      before = new Set([item.before]);
    } else if (Array.isArray(item.before)) {
      before = new Set(item.before);
    }

    // 默认的执行顺序是 0
    let stage = 0;
    if (typeof item.stage === "number") {
      stage = item.stage;
    }

    // 对新订阅的函数进行排序
    // 从后向前 一个个比较
    let i = this.taps.length;
    while (i > 0) {
      i--;
      const x = this.taps[i];
      this.taps[i + 1] = x;
      const xStage = x.stage || 0;

      // 这里没有先后，是要同时满足
      if (before) {
        // 新的订阅 要比 当前的订阅 排的前
        if (before.has(x.name)) {
          // 删掉继续向前找
          before.delete(x.name);
          continue;
        }

        // before 数组还有就要继续循环
        if (before.size > 0) {
          continue;
        }
      }

      // 新的订阅 要比 当前的订阅 执行stage数值要小(小的排前面)
      if (xStage > stage) {
        continue;
      }

      // 满足条件 不巡循环了
      i++;
      break;
    }
    // 将新的订阅 放入指定的数组位置中
    this.taps[i] = item;
  }
}

Object.setPrototypeOf(Hook.prototype, null);

module.exports = Hook;
```
