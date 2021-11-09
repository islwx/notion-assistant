# notion-assistant

## about

这是一个基于 notion api 的实现的一个 chrome 插件。  
用于做一些辅助性操作

## 安装

### 源码安装

chrome -> 更多工具 -> 扩展程序 -> 开发者模式 -> 加载已解压的扩展程序 -> 选中代码库的“src”文件夹

### 配置 config.json

```
|- src
|-|- config
|-|-|- config.json

{
  "notion_token": "secret_xxxx",
  "notion_database_id": "xxxx"
}
```

# Done

初步完成 Notion API 的集成: src/background.js
初步完成 Notion Obj 的模板模块：src/notion_obj.js
初步完成豆瓣读书的收藏

# Todo

1. 将豆瓣读书的收藏变为豆瓣读书页面中的一个按钮并添加 tag 功能
2. 将内部 token 转为读取公共 token
3. 添加选择数据库的选项
4. 添加选择属性项的 tab
