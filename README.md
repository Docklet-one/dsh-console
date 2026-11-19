# DSH 控制台（V3）

手机上的 DSH 控制台模块：收发消息、处理审批与提问。这是一个 Docklet 模块，
以 `.pkg` 形式发布，通过壳的在线目录或本地导入安装。

## 目录

```text
app/            模块本体（module.json、index.html、style.css、v3.js、avatars）
app/src/v3/     拆分源码（01-core … 07-composer），拼接后生成 app/v3.js
plugin/         Cordis 插件（client / events / index）
```

## 构建

```powershell
node tools/build-v3.mjs      # 把 app/src/v3/*.js 拼成 app/v3.js
```

打包成 `.pkg` 后放入发布仓库，并更新 catalog.json 的 version / sha256 / size。

## 返回约定

页面通过 `docklet.onBack(handler)` 注册同步处理器，返回 `'handled'` 表示这次返回被
页面消费，返回 `'exit'` 表示让壳关闭模块。详见壳仓库的 `module-platform.md`。
