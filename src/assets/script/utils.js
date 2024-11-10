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
