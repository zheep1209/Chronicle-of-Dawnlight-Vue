/* ./src/utils/request.js */

// 1、引入axios
import axios from 'axios';

// 2、创建axios实例，在其中设置公共参数
const instance = axios.create({
    baseURL: 'http://localhost:8080', // 设置实际的API地址
    timeout: 50000, // 增加超时时间
    headers: {
        'Content-Type': 'application/json' // 默认设置为JSON
    }
});

// 3、设置请求拦截器；可在发送请求前对请求进行处理，如添加 token 等
instance.interceptors.request.use(config => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request:', config); // 添加日志信息
    return config;
}, error => {
    console.error('Request Error:', error); // 添加日志信息
    return Promise.reject(error);
});

// 4、设置响应拦截器；可对响应数据进行处理，如简化数据、处理错误码等
instance.interceptors.response.use(
    response => {
        console.log('Response:', response); // 添加日志信息
        return response.data; // 返回data
    },
    error => {
        console.error('Response Error:', error); // 添加日志信息
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 处理未授权的情况，例如跳转到登录页面
                    window.location.href = '/login';
                    break;
                case 403:
                    // 处理权限不足的情况
                    alert('您没有权限访问此资源');
                    break;
                case 404:
                    // 处理资源未找到的情况
                    alert('请求的资源不存在');
                    break;
                case 500:
                    // 处理服务器内部错误
                    alert('服务器内部错误，请稍后再试');
                    break;
                // 其他错误码处理
            }
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            alert('请求超时或网络错误');
        } else {
            // 发生在设置请求时的错误
            alert('请求设置错误');
        }
        return Promise.reject(error);
    }
);

// 5、封装其他请求方法
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data || {}); // 确保 data 是一个对象
export const put = (url, data) => instance.put(url, data || {}); // 确保 data 是一个对象
export const del = (url, data) => instance.delete(url, { data: data || {} }); // 确保 data 是一个对象

export default instance;