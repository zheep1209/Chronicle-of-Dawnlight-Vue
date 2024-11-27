// 节流函数
function throttle(func, wait) {
    let timeout; // 定义一个计时器变量，用于限制函数调用频率
    let lastArgs; // 保存最后一次调用的参数
    let lastThis; // 保存最后一次调用的上下文对象
    let result; // 保存函数的返回值

    const later = () => {
        timeout = null;
        if (lastArgs) {
            func.apply(lastThis, lastArgs);
            lastArgs = lastThis = null;
        }
    };

    return function (...args) { // 返回一个包装后的函数
        const context = this; // 保存函数执行上下文对象
        if (!timeout) { // 如果计时器不存在
            result = func.apply(context, args); // 执行函数
            timeout = setTimeout(later, wait); // 创建计时器，在指定时间后重置计时器变量
        } else {
            lastArgs = args;
            lastThis = context;
        }
        return result; // 返回函数的返回值
    };
}

export {
    throttle,
};
