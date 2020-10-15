# jupyter lab 多用户管理方案

基于nodejs的jupyter多用户管理方案

## get start

```sh
    npm i
    npm start
```

## API

|用途| URL | 方式 | 参数 | 返回值|
|:--|:--|:--|:--|:--|
| 启动 |`/j-lab/start` | `POST` | `uuid` |共用|
| 停止 |`/j-lab/stop` | `POST` | `uuid` |同上|
| 重启 |`/j-lab/restart` | `POST` | `uuid` |同上|
| 状态 |`/j-lab/status` | `POST` | `uuid` |同上|

返回值说明:

```js
    {
        uuid,
        prefix,
        port: 3000,
        retry: 50,
        config: '...',
        baseDir: '...',
        logFile: '...',
        fileDir: '...',
        pidFile: '...',
    }
```
