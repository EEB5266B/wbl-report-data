const fs = require('fs');

/**
 * 异步创建目录函数
 * 如果目录不存在，则递归创建目录
 * @param {string} filePath 目录路径
 */
const mkdir = async (filePath) => {
    try {
        // 尝试访问目录，检查目录是否存在
        await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (err) {
        // 如果访问失败是由于目录不存在引起的，则创建目录
        if (err.code === 'ENOENT') {
            await fs.promises.mkdir(filePath, {recursive: true});
        } else {
            // 其他错误，打印错误信息并抛出
            console.error(`Failed to access directory: ${filePath}`);
            throw err;
        }
    }
}

/**
 * 异步写入文件函数
 * 包括创建必要的目录和写入文件
 * @param {string} data 要写入的数据
 * @param {string} fileName 文件名
 * @param {string} filePath 文件路径
 */
const write = async (data, fileName, filePath) => {
    // 确保目录存在
    await mkdir(filePath)
    // 写入文件
    await fs.writeFile(`${filePath}/${fileName}`, data, 'utf8', (err) => {
        if (err) {
            console.error(err);
            throw err;
        }
    });
}

module.exports = {write}
