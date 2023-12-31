
function hasChanged(newVal, oldVal) {
    return newVal !== oldVal && (newVal === newVal || oldVal === oldVal);
}
let runningReaction = null;
export function reactive(obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
        let value = val;
        const deps = new Set();
        Object.defineProperty(acc, key, {
            get() {
                if (runningReaction && !deps.has(runningReaction)) {
                    deps.add(runningReaction);
                }
                return value;
            },
            set(newValue) {
                if (hasChanged(value, newValue)) {
                    value = newValue;
                    deps.forEach(f => f());
                }
            },
            enumerable: true,
        });
        return acc;
    }, {});
}
export function autoRun(fn) {
    runningReaction = fn;
    fn();
    runningReaction = null;
}
