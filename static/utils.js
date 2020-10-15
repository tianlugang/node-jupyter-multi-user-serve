var util = {
    postJSON: function (url, body){
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body || ''),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
    },

    renderEjs: function (tplElId, data, targetElId) {
        var template = document.getElementById(tplElId).innerHTML.toString()
        var rendered = ejs.render(template, data, {
            delimiter: '?',
            debug: false,
        })

        document.getElementById(targetElId).innerHTML = rendered
    }
}