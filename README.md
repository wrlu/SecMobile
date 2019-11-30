# SecMobile
- 移动安全漏洞检测平台-服务器平台

## 主要功能
### 二、Android应用安全
#### 1、Android应用静态分析
- 分析Android应用所需的权限
- 分析Android应用常见平台风险，目前支持的功能：
    - Android组件暴露分析
    - Android SSL弱校验分析

#### 2、Android应用动态分析（需要FridaHooker支持）
- 分析Android应用运行时调用的敏感API
- 分析Android应用运行时连接的IP地址
- 分析Android应用运行时进行的不安全的数据传输
- 分析Android应用运行时进行的文件写入
- 分析Android应用运行时进行的数据库写入

### 三、iOS应用安全
#### 2、iOS应用静态分析
- 分析iOS应用所需的权限
- 分析iOS应用常见平台风险，目前支持的功能：
    - iOS后台运行情况分析
    - iOS应用安全传输政策分析

## 环境配置
### 一、基本环境
- 系统要求：Linux、Microsoft Windows 10.0.14393或更高版本
- Web运行环境：JDK 8或更高版本、Tomcat 9.0或更高版本、Gradle（自动配置SSM）
- Python运行环境：Python 3.6或更高版本（不支持Python 2.x）
- 数据库运行环境：MySQL或MariaDB

### 二、依赖环境
- jadx：用于Android应用静态分析模块，https://github.com/skylot/jadx
- Frida：用于Android应用动态分析模块，https://github.com/frida/frida
- FridaHooker：对于Android应用动态分析，需要在目标Android手机上安装Agent应用程序，并授予该应用root权限，https://github.com/seciot/FridaHooker

### 三、部署方式
- 按照Java Web项目部署war包即可

## 计划中的功能
- Android应用静态分析：支持列出所有进行IPC的目标、隐私数据污点分析。
- Android应用动态分析：支持将自定义的JavaScript脚本注入到设备上。
- iOS应用动态分析
- 基于Docker的快捷部署
