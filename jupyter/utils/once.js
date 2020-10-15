const once = (callback) => {
    let called = false
    return (...args) => {
        if (called === false) {
            called = true
            callback(...args)
        }
    }
}

module.exports.once = once