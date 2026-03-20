function extractPrimaryDomain(url) {
    try {
        // 处理输入并获取主机名
        const hostname = new URL(url).hostname;
        const parts = hostname.split('.').reverse();

        // 公共后缀列表（实际应用中可扩展）
        const publicSuffixes = new Set([
            'uk', 'jp', 'au', 'nz', 'za', 'il', 'cn', 'hk', 'tw',
            'co.uk', 'com.au', 'org.uk', 'gov.uk', 'co.jp', 'ac.jp',
            'co.nz', 'ac.nz', 'co.za', 'ac.za', 'co.il', 'ac.il',
            'com.cn', 'org.cn', 'gov.cn', 'com.hk', 'org.hk',
            'com.tw', 'org.tw', 'gov.tw'
        ]);

        // 查找有效的公共后缀组合
        let publicSuffix = parts[0];
        let validParts = [publicSuffix];

        for (let i = 1; i < parts.length; i++) {
            const testSuffix = parts[i] + '.' + validParts.join('.');
            if (publicSuffixes.has(testSuffix)) {
                validParts.unshift(parts[i]);
                publicSuffix = testSuffix;
            } else {
                break;
            }
        }

        // 提取一级域名：公共后缀 + 上一级标签
        const domainLabels = hostname.split('.');
        if (domainLabels.length > validParts.length) {
            return domainLabels
                .slice(-validParts.length - 1, -validParts.length)
                .concat(publicSuffix.split('.'))
                .join('.');
        }
        return publicSuffix; // 处理边界情况
    } catch (e) {
        // 针对无效URL/域名的处理
        const match = String(url).match(/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        return match ? match[0] : '';
    }
}

export default extractPrimaryDomain;