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

    _unshiftLeastCount() {
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
                this.valueCountMap.delete(this._unshiftLeastCount());
                this.valueCountMap.set(key, [value, 1]);

                // 还可能有 1 的存在
                this._updateLeastIfNess(key, 1);
            }
        }
    }

    // 在原值变大后，需要考虑次小值的流转
    _updateLeastIfNess(key: number, newCount: number) {
        if (newCount < this.leastCount) {
            this.leastCountKeySet = new Set([key]),
                this.leastCount = newCount;
        } else if (newCount === this.leastCount) {
            this.leastCountKeySet.add(key);
        } else {
            if (this.leastCountKeySet.has(key)) {
                this.leastCountKeySet.delete(key);
                this.candidateCountCountKeySet.add(key);
                if (!this.leastCountKeySet.size) {
                    this.leastCountKeySet = this.candidateCountCountKeySet;
                    this.candidateCountCountKeySet = new Set();
                    this.leastCount++;
                }
                return;
            }

            if (this.candidateCountCountKeySet.has(key)) {
                this.candidateCountCountKeySet.delete(key);
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

new LFUCache(0);

import { output } from './460-test-output';
import { input1, input2 } from './460-test-input';

console.log(input1);
console.log(input2);
console.log(output);