# 算法

## 二分查找
```ts
// queue 有序数组
function dichotomy(key: number, queue: number[]) {
    let start = 0;
    let end = queue.length - 1;
    let index = -1

    while(start <= end) {
        const mid = start + Math.floor((end - start) / 2)
        if (key < queue[mid]) {
            end = mid - 1;
            continue
        }
        if (key > queue[mid]) {
            start = mid + 1
            continue
        }
        if (key === queue[mid]) {
            index = mid
            break
        }
    }
    return index
}
// test
dichotomy(10, [6,7,8,9,10])
```