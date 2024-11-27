export function throttle(func, wait) {
    let timeout = null;
    return function (...args) {
        if (!timeout) {
            func(...args);
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
        }
    };
}
