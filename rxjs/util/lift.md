# lift

```ts
/**
 * Used to determine if an object is an Observable with a lift function.
 * 判断对象上是否有 lift 属性，来判断是否是可执行的
 */
export function hasLift(source: any): source is { lift: InstanceType<typeof Observable>['lift'] } {
  return isFunction(source?.lift);
}

/**
 * Creates an `OperatorFunction`. Used to define operators throughout the library in a concise way.
 * @param init The logic to connect the liftedSource to the subscriber at the moment of subscription.
 */
export function operate<T, R>(init: (liftedSource: Observable<T>, subscriber: Subscriber<R>) => (() => void) | void): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    if (!hasLift(source)) throw new TypeError('Unable to lift unknown Observable type');

    return source.lift(function (this: Subscriber<R>, liftedSource: Observable<T>) {
      try {
        return init(liftedSource, this);
      } catch (err) {
        this.error(err);
      }
    });
  };
}
```
