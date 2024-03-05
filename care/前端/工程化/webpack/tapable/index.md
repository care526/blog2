# index.js

```js
// 同步/异步分类
// - 同步
// - 异步
//  - 异步串行
//  - 异步并行

// 执行机制分类
// - Basic Hook : 基本类型的钩子
// 它仅仅执行钩子注册的事件，并不关心每个被调用的事件函数返回值如何。
// - Waterfall : 瀑布类型的钩子
// 瀑布类型的钩子和基本类型的钩子基本类似，唯一不同的是瀑布类型的钩子会在注册的事件执行时将事件函数执行非 undefined 的返回值传递给接下来的事件函数作为参数。
// - Bail : 保险类型钩子
// 保险类型钩子在基础类型钩子上增加了一种保险机制，如果任意一个注册函数执行返回非 undefined 的值，那么整个钩子执行过程会立即中断，之后注册事件函数就不会被调用了。
// - Loop : 循环类型钩子
// 循环类型钩子通过 call 调用时，如果任意一个注册的事件函数返回值非 undefeind ,那么会立即重头开始重新执行所有的注册事件函数，直到所有被注册的事件函数都返回 undefined。

exports.__esModule = true;

// 同步钩子
exports.SyncHook = require("./SyncHook");

// 同步保险钩子
exports.SyncBailHook = require("./SyncBailHook");

// 同步瀑布钩子
exports.SyncWaterfallHook = require("./SyncWaterfallHook");

// 同步循环钩子
exports.SyncLoopHook = require("./SyncLoopHook");


// 异步并行钩子
exports.AsyncParallelHook = require("./AsyncParallelHook");

// 异步并行保险钩子
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");


// 异步串行钩子
exports.AsyncSeriesHook = require("./AsyncSeriesHook");

// 异步串行保险钩子
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");

// 异步串行瀑布钩子
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");

// 异步串行循环钩子
exports.AsyncSeriesLoopHook = require("./AsyncSeriesLoopHook");

//
exports.HookMap = require("./HookMap");

//
exports.MultiHook = require("./MultiHook");
```
