const messages = {
    1: '操作成功',
    1001: '缺少参数 uuid, 例如：/1/2148',
    1002: 'jupyter lab 启动失败',
    1003: 'jupyter lab 停止失败',
    1004: 'jupyter lab 重启失败',
    1005: 'jupyter lab 查看状态时产生错误',
}

const getMessage = (code) => {
    return messages[code] || '缺少参数'
}

/**
 * @param {Express.Response} res
 * @param {number} code 
 * @param {any} data 
 */
const replyClient = (res, code, data) => {
    res.status(200)
    res.json({
        code: code,
        message: getMessage(code),
        data
    })
}

module.exports = {
    reply: replyClient,
}