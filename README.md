# local-tools

#### 介绍
使用pywebview写的一个简单pc端小工具<br>
主要的UI都是用H5写的，使用了layui框架<br>
至于为什么要这么做，只是用因为H5比较简单美观

#### 软件架构
pywebview + flask + H5


#### 安装教程

将项目clone或者下载到本地
配置python运行环境

打包exe可执行文件：pyinstaller --add-data "template;template" --add-data "static;static" --add-data "storage;storage" main.py

#### 使用说明

python main.py

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


