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
// 截取第一个标签
export const firstParagraph = (content) => {
    // 使用正则表达式匹配第一个 HTML 标签的内容
    const match = content.match(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i);
    return match ? match[2].trim() : '';
}
// 去标签预览
export const truncateContent = (content) => {
    // 去除 HTML 标签
    const text = content.replace(/<[^>]+>/g, '');
    // 截取前7个字符
    return text.slice(0, 7);
}
export default { formattedTime ,firstParagraph ,truncateContent};
