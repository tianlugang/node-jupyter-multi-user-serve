var J_setup = document.getElementById('J_setup')
var J_uuid = document.getElementById('J_uuid')
var D_record_array = []

function JServe_restart (uuid) {
    util.postJSON('/j-lab/restart', {
        uuid: uuid
    }).then(() => {
        alert('重启成功！')
    })
}

function JServe_stop (uuid) {
    util.postJSON('/j-lab/stop', {
        uuid: uuid
    }).then(() => {
        D_record_array = D_record_array.filter(record => record.uuid !== uuid)
        util.renderEjs('J_record_tpl', { record: D_record_array }, 'J_record')
    })
}

function JServe_start (uuid) {
    util.postJSON('/j-lab/start', {
        uuid: uuid
    }).then(res => {
        D_record_array.push(res.data)
        util.renderEjs('J_record_tpl', { record: D_record_array }, 'J_record')
    })
}

J_setup.onclick = function () {
    var uuid = (J_uuid.value || '')
    if (uuid.trim().length === 0){
        return alert('请输入标识服务的uuid，例如：/1/2148')
    }

    JServe_start(uuid)
}