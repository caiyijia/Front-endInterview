let index = 0;
class LFUCache {
    // key -> [value, count]
    private valueCountMap = new Map<number, [number, number]>();

    leastCountKeySet = new Set<number>();

    leastCount: number = Infinity;

    candidateCount: number = Infinity;

    candidateCountCountKeySet = new Set<number>();

    constructor(readonly capacity: number) {
        console.log('====== cap', capacity);
    }

    _unshiftLeastCountKey() {
        // 获取头部的值
        const first = this.leastCountKeySet.values().next().value;
        this.leastCountKeySet.delete(first);
        return first;
    }

    get(key: number): number {
        const valueCount = this.valueCountMap.get(key);
        if (valueCount) {
            const [preValue, preCount] = valueCount;
            const newCount = preCount + 1;
            this.valueCountMap.set(key, [preValue, newCount]);
            this._updateLeastIfNess(key, newCount);
            return preValue;
        } else {
            return -1;
        }
    }

    put(key: number, value: number | null): void {
        if (!this.capacity) {
            return;
        }
        const valueCount = this.valueCountMap.get(key);
        if (valueCount) {
            const [_, preCount] = valueCount;
            const newCount = preCount + 1;
            this.valueCountMap.set(key, [value, newCount]);
            this._updateLeastIfNess(key, newCount);
        } else {
            if (this.valueCountMap.size < this.capacity) {
                this.valueCountMap.set(key, [value, 1]);
                this._updateLeastIfNess(key, 1);
            } else {
                this.valueCountMap.delete(this._unshiftLeastCountKey());
                this.valueCountMap.set(key, [value, 1]);

                // 还可能有 1 的存在
                this._updateLeastIfNess(key, 1);
            }
        }
    }

    // 在原值变大后，需要考虑次小值的流转
    _updateLeastIfNess(key: number, newCount: number) {
        if (newCount < this.leastCount) {
            // 如果出现更小的值, 就需要把现在的值传给候选
            this.candidateCountCountKeySet = this.leastCountKeySet;
            this.candidateCount = this.leastCount;
            this.leastCountKeySet = new Set([key]),
                this.leastCount = newCount;
        } else if (newCount === this.leastCount) {
            // 重置顺序
            this.leastCountKeySet.delete(key);
            this.leastCountKeySet.add(key);
        } else {
            if (this.leastCountKeySet.has(key)) {
                this.leastCountKeySet.delete(key);
                if (newCount < this.candidateCount) {
                    this.candidateCountCountKeySet = new Set([key]);
                    this.candidateCount = newCount;
                } else if (newCount === this.candidateCount) {
                    this.candidateCountCountKeySet.delete(key);
                    this.candidateCountCountKeySet.add(key);
                }

                if (!this.leastCountKeySet.size) {
                    this.leastCountKeySet = this.candidateCountCountKeySet;
                    this.candidateCountCountKeySet = new Set();
                    this.leastCount = newCount;

                }
                return;
            }

            if (this.candidateCountCountKeySet.has(key)) {
                if (newCount > this.candidateCount) {
                    this.candidateCountCountKeySet.delete(key);
                }
            } else {
                if (newCount < this.candidateCount) {
                    this.candidateCountCountKeySet = new Set([key]);
                    this.candidateCount = newCount;
                }
            }
        }
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

    if (res != expect) {
        console.error('error case: ' + i + ` ${method} ${val} ` + 'expect result is ' + expect + ' but is ' + res);
    }
}

console.log('test end')
