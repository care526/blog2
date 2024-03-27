# retryWhen

## 示例

## 源码分析

```ts
export function retryWhen<T>(notifier: (errors: Observable<any>) => Observable<any>): MonoTypeOperatorFunction<T> {
  return operate((source, subscriber) => {
    let innerSub: Subscription | null;
    let syncResub = false;
    let errors$: Subject<any>;

    const subscribeForRetryWhen = () => {
      innerSub = source.subscribe(
        new OperatorSubscriber(subscriber, undefined, undefined, err => {
          if (!errors$) {
            errors$ = new Subject();

            notifier(errors$).subscribe(
              new OperatorSubscriber(subscriber, () =>
                // If we have an innerSub, this was an asynchronous call, kick off the retry.
                // Otherwise, if we don't have an innerSub yet, that's because the inner subscription
                // call hasn't even returned yet. We've arrived here synchronously.
                // So we flag that we want to resub, such that we can ensure teardown
                // happens before we resubscribe.
                innerSub ? subscribeForRetryWhen() : (syncResub = true),
              ),
            );
          }

          if (errors$) {
            // We have set up the notifier without error.
            errors$.next(err);
          }
        }),
      );

      if (syncResub) {
        // Ensure that the inner subscription is torn down before
        // moving on to the next subscription in the synchronous case.
        // If we don't do this here, all inner subscriptions will not be
        // torn down until the entire observable is done.
        innerSub.unsubscribe();
        innerSub = null;
        // We may need to do this multiple times, so reset the flag.
        syncResub = false;
        // Resubscribe
        subscribeForRetryWhen();
      }
    };

    // Start the subscription
    subscribeForRetryWhen();
  });
}
```
