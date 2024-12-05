import {ElMessage} from "element-plus";
// 保留时分
export function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function keepOnlyTime(isoDateTimeString) {
    // 解析 ISO 格式的日期时间字符串
    const date = new Date(isoDateTimeString);

    // 获取小时和分钟
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 返回格式化的时分字符串
    return `${hours}:${minutes}`;
}
// 格式化日期
export function convertDate(dateString) {
    // 创建 Date 对象
    const date = new Date(dateString);

    // 获取年份
    const year = date.getFullYear();

    // 获取月份（注意月份是从0开始的，所以需要加1）
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // 获取日期
    const day = String(date.getDate()).padStart(2, '0');

    // 获取小时
    const hours = String(date.getHours()).padStart(2, '0');

    // 获取分钟
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 获取秒
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接成目标格式
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
// 还原格式化
// 解析格式化后的日期字符串，返回原始的 Date 对象
export function parseFormattedDate(formattedDateString) {
    const [datePart, timePart] = formattedDateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
}


// 获取当前日期
export const formattedDateDay = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 获取当前详细时间
export const formattedTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
// 消息展示
export const showMessage = (message, type) => {
    ElMessage({
        type: type || 'success',  // Default to 'success' if no type is provided
        message: message
    });
};

// 截取第一个标签
const TITLE = 30;
const TEXTNUMS = 10;
export const firstParagraph = (content) => {
    // 使用正则表达式匹配第一个 HTML 标签的内容
    const match = content.match(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i);
    if (match) {
        // 去除标签内的样式
        const innerContent = match[2].replace(/<[^>]+>/g, '').trim();
        // 截取前 5 个字符，如果超过 5 个字符则加上 ...
        return innerContent.length > TITLE ? innerContent.slice(0, TITLE) + '...' : innerContent;
    }
}


// 去标签预览
export const truncateContent = (content) => {
    // 使用正则表达式匹配并去除第一个 HTML 标签及其内容
    const contentWithoutFirstTag = content.replace(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i, '');

    // 去除剩余内容中的 HTML 标签
    const text = contentWithoutFirstTag.replace(/<[^>]+>/g, '');

    // 截取前 10 个字符
    return text.length > TEXTNUMS ? text.slice(0, TEXTNUMS) + '...' : text;
}

export default {formattedTime, firstParagraph, truncateContent};
