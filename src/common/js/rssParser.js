import { xml2js } from 'xml-js';

function parseRSS(rssText) {
    // 解析 XML
    const result = xml2js(rssText, {
        compact: true,
        ignoreComment: true,
        alwaysChildren: true,
        ignoreDeclaration: true,
        ignoreInstruction: true
    });

    // 验证是否为 RSS 格式
    if (!result.rss || !result.rss.channel) {
        throw new Error('Invalid RSS format');
    }

    const channel = result.rss.channel;

    // 解析频道信息
    const channelData = {
        title: getTextValue(channel.title),
        link: getTextValue(channel.link),
        description: channel.description,
        lastBuildDate: getTextValue(channel.lastBuildDate),
        items: []
    };

    // 处理项目数据
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    items.forEach(item => {
        if (!item) return;
        channelData.items.push({
            title: stripHtmlTags(getTextValue(item.title)),
            link: getTextValue(item.link),
            description: stripHtmlTags(getTextValue(item.description)),
            pubDate: getTextValue(item.pubDate),
            author: getTextValue(item.author),
            category: getTextValue(item.category)
        });
    });

    return channelData;
}

// 辅助函数：安全获取文本值
function getTextValue(element) {
    if (!element || (!element._text && !element._cdata)) return '';
    if (!element._text) return element._cdata.trim();
    return element._text.trim();
}

// 去除 HTML 标签（正则实现）
function stripHtmlTags(html) {
    if (!html) return '';
    html = html.replace(/<\/p>|<br>|<br\s+\/>/g, "\n");
    return decodeHTMLEntities(html.replace(/<\/?[^>]+(>|$)/g, ""));
}

// 解码HTML实体
function decodeHTMLEntities(text) {
    // 常见 HTML 实体映射表
    const entities = {
        nbsp: ' ',
        amp: '&',
        apos: "'",
        quot: '"',
        lt: '<',
        gt: '>',
        // 可根据需要扩展其他实体
    };

    return text.replace(/&([a-z]+);/ig, (match, entity) => {
        // 处理命名实体（如 &nbsp;）
        const normalized = entity.toLowerCase();
        return entities[normalized] || match; // 未知实体保持原样
    }).replace(/&#(\d+);/g, (match, dec) => {
        // 处理十进制数字实体（如 &#160;）
        return String.fromCharCode(dec);
    }).replace(/&#x([\da-f]+);/ig, (match, hex) => {
        // 处理十六进制数字实体（如 &#xA0;）
        return String.fromCharCode(parseInt(hex, 16));
    });
}

export default parseRSS;