let index = 0;
let lock = false;

class LFUCache {
    public max: number;
    public min: number;
    public val_times: Map<number, [number, number]>;
    public times_set: Map<number, Set<number>>;
    constructor(capacity: number) {
        console.log(`capacity ${capacity}`);
        this.max = capacity
        this.min = 0
        this.val_times = new Map()
        this.times_set = new Map()
    }

    get(key: number): number {
        if (this.val_times.has(key)) {
            this.update(key)
            let [val] = this.val_times.get(key) || [-1]
            return val
        }
        return -1
    }

    put(key: number, value: number): void {
        if (this.max === 0) return
        if (this.val_times.has(key)) {
            let [val, times] = this.val_times.get(key) || [-1, -1]
            this.val_times.set(key, [value, times])
            this.update(key)
        } else {
            if (this.max === this.val_times.size) {
                // 要避免 0 || -1 的 case
                let minSet = this.times_set.get(this.min) || new Set()
                let minKey = minSet.keys().next().value ?? -1
                this.val_times.delete(minKey)
                minSet.delete(minKey)
            }
            this.val_times.set(key, [value, 1])
            let useSet = this.times_set.get(1)
            if (!useSet) {
                useSet = new Set()
                this.times_set.set(1, useSet)
            }
            useSet.add(key)
            this.min = 1
        }
    }

    private update(key: number): void {
        let [val, times] = this.val_times.get(key) || [-1, -1]
        // 旧 times 对应的 set
        let useSet = this.times_set.get(times) || new Set()
        // 旧 times 已经是最小值, 且 set 中只有一个 key, 需要升 min
        if (this.min === times && useSet.size === 1) this.min++
        // 旧 times 对应的 set 中删除 key
        useSet.delete(key)
        // 新 times 对应的 set
        useSet = this.times_set.get(times + 1) || new Set()
        if (!useSet.size) {
            this.times_set.set(times + 1, useSet)
        }
        // 新 times 对应的 set 添加 key
        useSet.add(key)
        // 更新 val_times 中的 times
        this.val_times.set(key, [val, times + 1])
    }
}


/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

// const input1: ("LFUCache" | "put" | "get")[] = ["LFUCache","put","put","get","put","get","get","put","get","get","get"]
// const input2 = [[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]
// const output = [null,null,null,1,null,-1,3,null,-1,3,4];

import { output } from './460-test-output';
import { input1, input2 } from './460-test-input';

console.log(input1.length);
console.log(input2.length);
console.log(output.length);

let lfu = null;

for (let i = 0; i < output.length; i++) {
    index = i;
    const method = input1[i];
    const val = input2[i];
    const expect = output[i];
    let res = null;
    if (method === 'LFUCache') {
        lfu = new LFUCache(val[0]);
    } else {
        if (!lfu) {
            throw new Error('lfu instance does not exist');
        }
        res = lfu[method].apply(lfu, val);
    }

    if (res != expect && !lock) {
        lock = true;
        console.error('error case: ' + i + ` ${method} ${val} ` + 'expect result is ' + expect + ' but is ' + res);
    }
}

console.log('test end')
