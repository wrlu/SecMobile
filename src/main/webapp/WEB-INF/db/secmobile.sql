-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： [::1]
-- 生成日期： 2019-06-04 07:54:51
-- 服务器版本： 10.3.15-MariaDB
-- PHP 版本： 7.2.5

-- --------------------------------------------------------

--
-- 表的结构 `authorities`
--

CREATE TABLE `authorities` (
  `username` varchar(50) NOT NULL,
  `authority` varchar(50) NOT NULL
);

--
-- 转存表中的数据 `authorities`
--

INSERT INTO `authorities` (`username`, `authority`) VALUES
('admin', 'admin');

-- --------------------------------------------------------

--
-- 表的结构 `device`
--

CREATE TABLE `device` (
  `clientid` varchar(36) NOT NULL,
  `devicename` varchar(36) NOT NULL,
  `version` varchar(16) NOT NULL,
  `apilevel` int(3) NOT NULL,
  `agentver` varchar(16) NOT NULL,
  `port` int(5) NOT NULL,
  `online` int(1) NOT NULL,
  `busy` int(1) NOT NULL DEFAULT 0
);

-- --------------------------------------------------------

--
-- 表的结构 `history`
--

CREATE TABLE `history` (
  `id` varchar(36) NOT NULL,
  `name` varchar(160) NOT NULL,
  `type` varchar(160) NOT NULL,
  `target` varchar(160) NOT NULL,
  `user` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `detailid` varchar(36) NOT NULL
);

-- --------------------------------------------------------

--
-- 表的结构 `history_android_static`
--

CREATE TABLE `history_android_static` (
  `id` varchar(36) NOT NULL,
  `apkinfo` varchar(500) NOT NULL,
  `apkpermission` varchar(5000) NOT NULL,
  `apkplatformrisk` varchar(5000) NOT NULL
);

-- --------------------------------------------------------


--
-- 表的结构 `history_ios_static`
--

CREATE TABLE `history_ios_static` (
  `id` varchar(36) NOT NULL,
  `ipainfo` varchar(500) NOT NULL,
  `ipapermission` varchar(5000) NOT NULL,
  `ipaplatformrisk` varchar(5000) NOT NULL
);

--
-- 表的结构 `platform_risk`
--

CREATE TABLE `platform_risk` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `payload` varchar(50) DEFAULT NULL
);

--
-- 转存表中的数据 `platform_risk`
--

INSERT INTO `platform_risk` (`id`, `name`, `description`, `level`, `platform`, `payload`) VALUES
('0c89a975-60dd-11e9-95d2-eb78988f066e', 'Android SSL弱校验风险', 'App在进行SSL通信时，未对服务器证书进行校验，可导致中间人攻击并泄漏传输的敏感数据。', 'High', 'Android', 'AndroidService.ssl_pinning'),
('3d64a102-7fb1-11e9-90ff-dd3c92270fd6', 'iOS后台使用', 'iOS允许应用程序在后台使用GPS定位，持续跟踪位置并使应用即使在锁屏后依旧可以在后台运行。', 'Low', 'iOS', 'AppleiOSService.background'),
('48c0099d-60dd-11e9-95d2-eb78988f066e', 'Linux用户帐户风险', '固件中存在可登录的Linux用户，可能导致攻击者从本地接口或远程方式取得系统权限。', 'Low', 'Linux', 'FwService.linux_shadow'),
('818ea14d-6abe-11e9-94a1-e86957795647', 'Dropbear开启风险', 'Dropbear是一款实现SSH远程登录的实用工具，开启Dropbear将允许攻击者有机会从远程登录设备。', 'High', 'Linux', 'FwService.dropbear_enable'),
('a4d03d9c-6abe-11e9-94a1-e86957795647', 'Dropbear配置公钥风险', 'Dropbear是一款实现SSH远程登录的实用工具，配置了公钥表明设备生产商可能通过他们自己的私钥远程接入设备。', 'Medium', 'Linux', 'FwService.dropbear_auth_keys'),
('f647b3ba-60dc-11e9-95d2-eb78988f066e', 'Android组件暴露风险', 'App在AndroidManifest.xml中没有正确设置四大组件的权限，暴露不必要的组件可能导致隐私信息泄漏给第三方App。', 'Medium', 'Android', 'AndroidService.exported'),
('fef2a768-7fb0-11e9-90ff-dd3c92270fd6', 'iOS应用传输安全风险', 'iOS App Transport Security要求iOS应用必须使用安全的HTTPS协议，如果配置禁用则允许明文传输，可能导致信息泄露。', 'Medium', 'iOS', 'AppleiOSService.ats_policy');

-- --------------------------------------------------------

--
-- 表的结构 `platform_risk_category`
--

CREATE TABLE `platform_risk_category` (
  `id` varchar(36) NOT NULL,
  `category` varchar(50) DEFAULT NULL
);

--
-- 转存表中的数据 `platform_risk_category`
--

INSERT INTO `platform_risk_category` (`id`, `category`) VALUES
('0c89a975-60dd-11e9-95d2-eb78988f066e', 'Android'),
('3d64a102-7fb1-11e9-90ff-dd3c92270fd6', 'iOS'),
('48c0099d-60dd-11e9-95d2-eb78988f066e', 'Firmware'),
('818ea14d-6abe-11e9-94a1-e86957795647', 'Firmware'),
('a4d03d9c-6abe-11e9-94a1-e86957795647', 'Firmware'),
('f647b3ba-60dc-11e9-95d2-eb78988f066e', 'Android'),
('fef2a768-7fb0-11e9-90ff-dd3c92270fd6', 'iOS');

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `enabled` tinyint(1) NOT NULL
);

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`username`, `password`, `enabled`) VALUES
('admin', '$2a$10$ay6W.bucdA3NcaTQ3DfW3.1jYdfxORNjiu2NHRaq3Fw3xPdV4l/ZW', 1);
