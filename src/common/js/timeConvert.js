function convertGMTToBeijingTime(gmtString) {
    // 解析 GMT 字符串为 Date 对象（自动视为 UTC 时间）
    if (!gmtString) return ""
    const date = new Date(gmtString)

    // 转换为北京时间（UTC+8）
    date.setHours(date.getHours() + 8)

    // 格式化日期和时间组件
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")
    const seconds = String(date.getUTCSeconds()).padStart(2, "0")

    // 组合为 yyyy-MM-dd HH:mm:ss 格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default convertGMTToBeijingTime;