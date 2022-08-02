# notion-assistant

## 摘要

这是一个基于 notion api 的实现的一个 chrome 插件，用于做一些辅助性操作。

### 已完成功能：

[x] 在豆瓣读书-书籍页面点击按钮，将保存书籍信息到预先设置好点 Notion 数据库中。
[x] 在arxiv-论文摘要页面点击按钮，将保存书籍信息到预先设置好点 Notion 数据库中。
[X] 在nips-论文摘要页面点击按钮，将保存书籍信息到预先设置好点 Notion 数据库中。
[x] 保存状态提醒
[x] 将内部 token 转为读取公共 token  

## 安装

### 源码安装

chrome -> 更多工具 -> 扩展程序 -> 开发者模式 -> 加载已解压的扩展程序 -> 选中代码库的“src”文件夹

### 配置 notion_token 与 notion_database_id

如果您是第一次接触 notion api 应用，请转至 https://developers.notion.com/docs/getting-started 获取您的“Internal Integration Token”与“Database ID”。

请将您的“Internal Integration Token”与“Database ID”分别作为“notion_token”，“notion_database_id”配置到 src/config/config.json 中，如：

```
# src/config/config.json

{
  "notion_token": "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "notion_database_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

```

## 开发计划

[ ] 将豆瓣读书的收藏变为豆瓣读书页面中的一个按钮并添加 tag 功能  
[ ] 添加选择数据库的选项  
[ ] 添加选择属性项的 tab  

如有开发建议请发邮致 islwx@stu.xhsysu.edu.cn
