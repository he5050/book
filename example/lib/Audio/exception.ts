/**
 * 异常处理
 * @static
 * @param {string} message   错误消息
 */
export function throwError(message: string): never {
	throw new Error(message);
}