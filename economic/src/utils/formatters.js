/**
 * 数値を3桁区切りでフォーマットする
 * @param {number} number フォーマットする数値
 * @param {number} decimals 小数点以下の桁数（デフォルト: 1）
 * @returns {string} フォーマットされた文字列
 */
export function formatNumber(number, decimals = 1) {
    return new Intl.NumberFormat('ja-JP', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

/**
 * パーセント値をフォーマットする
 * @param {number} value パーセント値
 * @param {number} decimals 小数点以下の桁数（デフォルト: 1）
 * @returns {string} フォーマットされた文字列
 */
export function formatPercent(value, decimals = 1) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

/**
 * 通貨値をフォーマットする
 * @param {number} value 通貨値
 * @param {string} currency 通貨コード（デフォルト: 'USD'）
 * @returns {string} フォーマットされた文字列
 */
export function formatCurrency(value, currency = 'USD') {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: currency
    }).format(value);
}

/**
 * 時間値をフォーマットする
 * @param {number} timestamp タイムスタンプ
 * @returns {string} フォーマットされた文字列
 */
export function formatTime(timestamp) {
    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(timestamp));
}

/**
 * 数値の変化を矢印付きでフォーマットする
 * @param {number} value 数値
 * @param {number} previousValue 前回の数値
 * @param {number} decimals 小数点以下の桁数（デフォルト: 1）
 * @returns {string} フォーマットされた文字列
 */
export function formatChange(value, previousValue, decimals = 1) {
    const change = value - previousValue;
    const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
    const formattedChange = formatNumber(Math.abs(change), decimals);
    return `${arrow} ${formattedChange}`;
}

/**
 * 大きな数値を省略形でフォーマットする
 * @param {number} value 数値
 * @returns {string} フォーマットされた文字列
 */
export function formatCompact(value) {
    const units = ['', 'K', 'M', 'B', 'T'];
    let unitIndex = 0;
    let scaledValue = value;

    while (scaledValue >= 1000 && unitIndex < units.length - 1) {
        unitIndex += 1;
        scaledValue /= 1000;
    }

    return `${formatNumber(scaledValue, 1)}${units[unitIndex]}`;
}

/**
 * 範囲内の値を表示する
 * @param {number} value 現在値
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @returns {string} フォーマットされた文字列
 */
export function formatRange(value, min, max) {
    const percentage = ((value - min) / (max - min)) * 100;
    return `${formatNumber(value)} (${formatNumber(percentage)}%)`;
} 