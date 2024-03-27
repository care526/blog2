# retry

## 示例

## 源码分析

```ts
export interface RetryConfig {
  /**
   * The maximum number of times to retry.
   * 最大重试次数(默认值：Infinity)，无限重试
   */
  count?: number;
  /**
   * The number of milliseconds to delay before retrying, OR a function to
   * return a notifier for delaying. If a function is given, that function should
   * return a notifier that, when it emits will retry the source. If the notifier
   * completes _without_ emitting, the resulting observable will complete without error,
   * if the notifier errors, the error will be pushed to the result.
   * 每次重试延时的时间
   * 每次重试延时的触发器函数
   */
  delay?: number | ((error: any, retryCount: number) => ObservableInput<any>);
  /**
   * Whether or not to reset the retry counter when the retried subscription
   * emits its first value.
   * 重试成功后是否重置 重试次数(默认值：false)
   */
  resetOnSuccess?: boolean;
}

export function retry<T>(count?: number): MonoTypeOperatorFunction<T>;
export function retry<T>(config: RetryConfig): MonoTypeOperatorFunction<T>;
export function retry<T>(configOrCount: number | RetryConfig = Infinity): MonoTypeOperatorFunction<T> {
  // 处理不同的入参为配置对象
  let config: RetryConfig;
  if (configOrCount && typeof configOrCount === 'object') {
    config = configOrCount;
  } else {
    config = {
      count: configOrCount,
    };
  }
  const { count = Infinity, delay, resetOnSuccess: resetOnSuccess = false } = config;

  // 不重试，直接返回原source
  return count <= 0
    ? identity
    : operate((source, subscriber) => {
        let soFar = 0; // 当前重试次数
        let innerSub: Subscription | null;

        const subscribeForRetry = () => {
          let syncUnsub = false; // 是否是同步订阅

          innerSub = source.subscribe(
            new OperatorSubscriber(
              subscriber,
              value => {
                // If we're resetting on success
                if (resetOnSuccess) {
                  soFar = 0;
                }
                subscriber.next(value);
              },
              // Completions are passed through to consumer.
              undefined,
              err => {
                if (soFar++ < count) {
                  // We are still under our retry count
                  const resub = () => {
                    if (innerSub) {
                      // 异步订阅重试触发
                      innerSub.unsubscribe();
                      innerSub = null;
                      subscribeForRetry();
                    } else {
                      syncUnsub = true;
                    }
                  };

                  if (delay != null) {
                    // The user specified a retry delay.
                    // They gave us a number, use a timer, otherwise, it's a function,
                    // and we're going to call it to get a notifier.
                    // innerFrom 转化为 Observable
                    const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(err, soFar));
                    const notifierSubscriber = new OperatorSubscriber(
                      subscriber,
                      () => {
                        // After we get the first notification, we
                        // unsubscribe from the notifer, because we don't want anymore
                        // and we resubscribe to the source.
                        // notifier 通知器成功执行后，触发重试(通知器next一次后，立马结束)
                        notifierSubscriber.unsubscribe();
                        resub();
                      },
                      () => {
                        // The notifier completed without emitting.
                        // The author is telling us they want to complete.
                        // 通知器完结后，原订阅也完结
                        subscriber.complete();
                      },
                    );

                    // 通过通知器 触发重试
                    notifier.subscribe(notifierSubscriber);
                  } else {
                    // There was no notifier given. Just resub immediately.
                    resub();
                  }
                } else {
                  // We're past our maximum number of retries.
                  // Just send along the error.
                  // 不再重试后，直接原样报错
                  subscriber.error(err);
                }
              },
            ),
          );

          // 同步订阅重试触发
          if (syncUnsub) {
            innerSub.unsubscribe();
            innerSub = null;
            subscribeForRetry();
          }
        };

        subscribeForRetry();
      });
}
```
