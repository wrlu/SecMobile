$(function(){
	var args = getArgs();
	var mainPage = "/SecMobile/?page=main";
	if (typeof(args.page) == "undefined" || args.page == null) {
		window.location.href = mainPage;
	} else if (args.page === "403") {
		$(document).attr("title", "拒绝访问 - SecMobile");
		var errorMsg = '<br/><div class="alert alert-danger" role="alert">温馨提示：很抱歉，您没有访问此页面的权限，请联系系统管理员或<a href="'+mainPage+'">返回首页</a></div>'
		$("#main").html(errorMsg);
	} else {
		$("#main").load("/SecMobile/pages/"+args.page+".html", function(response, status, xhr) {
			if (status === "success") {
				$(document).attr("title",$("#main_title").html() + " - SecMobile");
				$("#"+args.page+"_nav").addClass("active");
			} else {
				$(document).attr("title", "未找到 - SecMobile");
				var errorMsg = '<br/><div class="alert alert-danger" role="alert">温馨提示：很抱歉，您请求的页面未找到，请尝试刷新或<a href="'+mainPage+'">返回首页</a></div>'
				$("#main").html(errorMsg);
			}
		});
		if (args.page === "android-dym") {
			onRefreshDeviceList();
		} else if (args.page === "history") {
			onRefreshHistoryList();
		}
	}
});

function getArgs(){
    var args = {};
    var match = null;
    var search = decodeURIComponent(location.search.substring(1));
    var reg = /(?:([^&]+)=([^&]+))/g;
    while((match = reg.exec(search))!==null){
        args[match[1]] = match[2];
    }
    return args;
}

function onApkAnalysis() {
	var formData = new FormData(document.getElementById("uploadForm"));
	$.ajax({
	      type:"POST",
	      url:"/SecMobile/android/analysis",
	      data:formData,
	      mimeType:"multipart/form-data",
	      contentType: false,
	      cache: false,
	      processData: false,
	      success: function (result) {
	    	 $("#loadingModel").modal("hide");
	    	 var result=JSON.parse(result);
	     	 if(result.status === 0) {
	     		showApkAnalysis(result);
	     		$("#resultModalBody").html("针对 "+result.apk_info.apk_name+" 的分析完成", function() {});
	     		$("#resultModal").modal("show");
	     	 } else {
	     		$("#resultModalBody").html(result.reason);
	     		$("#resultModal").modal("show");
	     	 }
	      }
	});
	$("#loadingModel").modal("show");
}

function showApkAnalysis(result) {
//	 填充APK基本信息
 	apk_basic_info = '<strong class="d-block text-gray-dark">APK基本信息</strong>';
 	apk_basic_info += '文件名：'+result.apk_info.apk_name+'<br/>';
 	apk_basic_info += '文件大小：'+result.apk_info.apk_size+'字节<br/>';
 	apk_basic_info += 'NDK支持的架构：'+result.apk_info.apk_ndk_lib_support_abis;
 	$("#apk_basic_info").html(apk_basic_info);
// 	填充权限信息
 	apk_permission = '<strong class="d-block text-gray-dark">APK所需权限</strong>';
 	for (var i = 0, len = result.apk_permission.length; i < len; ++i) {
 		apk_permission += result.apk_permission[i]+'<br/>';
 	}
 	$("#apk_permission").html(apk_permission);
//	显示平台风险
 	var apk_platform_risk = '<h6 class="border-bottom border-gray pb-2 mb-0">平台风险</h6>';
 	for (var i = 0, len = result.apk_platform_risk.length; i < len; ++i) {
 		var apk_per_platform_risk = '<div class="media text-muted pt-3"><p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">';
 		apk_per_platform_risk += '<strong class="d-block text-gray-dark">'+result.apk_platform_risk[i].risk_name+'</strong>';
 		apk_per_platform_risk += '风险是否存在：'+result.apk_platform_risk[i].risk_exists + '<br/>';
 		apk_per_platform_risk += '风险描述：'+result.apk_platform_risk[i].risk_description + '<br/>';
 		apk_per_platform_risk += '风险等级：'+result.apk_platform_risk[i].risk_level + '<br/>';
 		apk_per_platform_risk += '风险适用平台：'+result.apk_platform_risk[i].risk_platform + '<br/>';
 		apk_per_platform_risk += '风险技术细节（供专业人员参考）<br/>';
 		for (var detail_name in result.apk_platform_risk[i].risk_details){
 			apk_per_platform_risk += detail_name + '：<br/>';
 			var risk_detail = result.apk_platform_risk[i].risk_details[detail_name];
 			for (var j = 0, lenr = risk_detail.length; j < lenr; ++j) {
 				apk_per_platform_risk += result.apk_platform_risk[i].risk_details[detail_name][j] + '<br/>';
 			}
 		}
 		apk_per_platform_risk += '</p></div>';
 		apk_platform_risk += apk_per_platform_risk;
 	}
 	$("#apk_platform_risk").html(apk_platform_risk);
}

function onIpaAnalysis() {
	var formData = new FormData(document.getElementById("uploadForm"));
	$.ajax({
	      type:"POST",
	      url:"/SecMobile/appleios/analysis",
	      data:formData,
	      mimeType:"multipart/form-data",
	      contentType: false,
	      cache: false,
	      processData: false,
	      success: function (result) {
	    	 $("#loadingModel").modal("hide");
	    	 var result=JSON.parse(result);
	     	 if(result.status == 0) {
	     		showIpaAnalysis(result);
	     		$("#resultModalBody").html("针对 "+result.ipa_info.ipa_name+" 的分析完成", function() {});
	     		$("#resultModal").modal("show");
	     	 } else {
	     		$("#resultModalBody").html(result.reason);
	     		$("#resultModal").modal("show");
	     	 }
	      }
	});
	$("#loadingModel").modal("show");
}

function showIpaAnalysis(result) {
//	 填充IPA基本信息
 	ipa_basic_info = '<strong class="d-block text-gray-dark">IPA基本信息</strong>';
 	ipa_basic_info += '文件名：'+result.ipa_info.ipa_name+'<br/>';
 	ipa_basic_info += '文件大小：'+result.ipa_info.ipa_size+'字节';
 	$("#ipa_basic_info").html(ipa_basic_info);
// 	填充权限信息
 	ipa_permission = '<strong class="d-block text-gray-dark">IPA所需权限</strong>';
 	for (var i = 0, len = result.ipa_permission.length; i < len; ++i) {
 		ipa_permission += result.ipa_permission[i]+'<br/>';
 	}
 	$("#ipa_permission").html(ipa_permission);
//	显示平台风险
 	var ipa_platform_risk = '<h6 class="border-bottom border-gray pb-2 mb-0">平台风险</h6>';
 	for (var i = 0, len = result.ipa_platform_risk.length; i < len; ++i) {
 		var ipa_per_platform_risk = '<div class="media text-muted pt-3"><p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">';
 		ipa_per_platform_risk += '<strong class="d-block text-gray-dark">'+result.ipa_platform_risk[i].risk_name+'</strong>';
 		ipa_per_platform_risk += '风险是否存在：'+result.ipa_platform_risk[i].risk_exists + '<br/>';
 		ipa_per_platform_risk += '风险描述：'+result.ipa_platform_risk[i].risk_description + '<br/>';
 		ipa_per_platform_risk += '风险等级：'+result.ipa_platform_risk[i].risk_level + '<br/>';
 		ipa_per_platform_risk += '风险适用平台：'+result.ipa_platform_risk[i].risk_platform + '<br/>';
 		ipa_per_platform_risk += '风险技术细节（供专业人员参考）<br/>';
 		for (var detail_name in result.ipa_platform_risk[i].risk_details){
 			ipa_per_platform_risk += detail_name + '：<br/>';
 			var risk_detail = result.ipa_platform_risk[i].risk_details[detail_name];
 			for (var j = 0, lenr = risk_detail.length; j < lenr; ++j) {
 				ipa_per_platform_risk += result.ipa_platform_risk[i].risk_details[detail_name][j] + '<br/>';
 			}
 		}
 		ipa_per_platform_risk += '</p></div>';
 		ipa_platform_risk += ipa_per_platform_risk;
 	}
 	$("#ipa_platform_risk").html(ipa_platform_risk);
}

var isMonitoring = false;

function onRefreshDeviceList() {
	$.post("/SecMobile/device/getOnlineDevice", {}, function(result) {
		if(result.status == 0) {
			var devices = "";
			for (var i = 0, len = result.devices.length; i < len; ++i) {
				devices += "<tr>";
				devices += "<td>"+(i+1)+"</td>";
				devices += "<td>"+result.devices[i].devicename+"</td>";
				devices += "<td>Android "+result.devices[i].version+" ( API "+result.devices[i].apilevel+" )</td>";
				devices += "<td>"+result.devices[i].agentver+"</td>";
				devices += "<td>"+result.devices[i].port+"</td>";
				devices += '<td id="'+result.devices[i].port+'control">';
				if (result.devices[i].busy == 0) {
					devices += '<button class="btn btn-sm btn-info" onclick="onShowDevices(\''+result.devices[i].clientid+'\')" title="查看远程设备的基本信息">查看</button>';
					devices += '<button class="btn btn-sm btn-success" onclick="getProcessList(\''+result.devices[i].clientid+'\', '+result.devices[i].port+')" title="检测远程设备上的特定应用的安全风险">检测</button>';
//					devices += '<button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#customInjectionWarning" title="向远程设备上的特定应用注入代码(高级功能)">注入</button>';
				} else if (result.devices[i].busy == 1) {
					devices += '<button class="btn btn-sm btn-info" onclick="onShowDevices(\''+result.devices[i].clientid+'\')" title="查看远程设备的基本信息">查看</button>';
					devices += '<button class="btn btn-sm btn-danger" onclick="stopMonitoring(\''+result.devices[i].clientid+'\', '+result.devices[i].port+')" title="停止远程设备上的检测任务">中止</button>';
				}
				devices += "</td>";
				devices += "</tr>";
			}
			$("#deviceBody").html(devices);
			if (result.devices.length == 0) {
				$("#resultModalBody").html("未发现在线的测试设备，请您检查测试设备状态。<br/><br/>" +
						"1. 是否已在测试设备上安装SecIoT Agent应用？<br/>" +
						"2. SecIoT Agent模块是否已经安装（需要取得测试设备的root权限）？<br/>" +
						"3. SecIoT Agent模块是否已经开启？（需要取得测试设备的root权限）<br/>" +
						"4. 检查测试设备的网络连接是否正常？<br/>" +
						"5. 检查frps控制台是否存在测试设备连接？");
	     		$("#resultModal").modal("show");
			}
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onShowDevices(client_id) {
	$("#deviceModelBody").html("客户端ID："+client_id);
	$("#deviceModel").modal("show");
}

function getProcessList(client_id, port) {
	$.get("/SecMobile/android/getProcessList", {
		port: port
	}, function(result) {
		if(result.status == 0) {
			var processes = '';
			for (var i = 0, len = result.processes.length; i < len; ++i) {
				processes += '<option value="'+result.processes[i]+'">';
				processes += result.processes[i];
				processes += '</option>';
			}
			$("#deviceClientId").val(client_id);
			$("#devicePort").val(port);
			$("#processSelect").html(processes);
			$("#configureDetection").modal("show");
		} else {
			$("#resultModalBody").html(result.reason + "<br/><br/>" +
					"1. 检查测试设备的网络连接是否正常？<br/>" +
					"2. 检查frps控制台是否存在测试设备连接？<br/>" +
					"3. 请尝试重新启动SecIoT Agent模块再试<br/>" +
					"4. 请尝试重新启动设备再试");
     		$("#resultModal").modal("show");
		}
	});
}

function monitoringDevice() {
	if (isMonitoring == true) {
		$("#resultModalBody").html("已经启动了一项检测，请先中止现有的检测再开始新的检测");
 		$("#resultModal").modal("show");
 		return;
	}
	var client_id = $("#deviceClientId").val();
	var port = $("#devicePort").val();
	var process = $("#processSelect").val();
	var apiDetection = $("#apiDetection").prop("checked");
	var networkDetection = $("#networkDetection").prop("checked");
	var trafficDetection = $("#trafficDetection").prop("checked");
	var fileOptionDetection = $("#fileOptionDetection").prop("checked");
	var dbOptionDetection = $("#dbOptionDetection").prop("checked");
	if (apiDetection == false 
			&& networkDetection == false 
			&& trafficDetection == false 
			&& fileOptionDetection  == false 
			&& dbOptionDetection == false) {
		$("#resultModalBody").html("请至少选择一个动态检测项目");
 		$("#resultModal").modal("show");
 		return;
	}
	$("#attachingModel").modal("show");
	$.post("/SecMobile/android/monitoring", {
		clientId: client_id,
		port: port,
		process: process,
		monitoringApi: apiDetection,
		monitoringIp: networkDetection,
		monitoringTraffic: trafficDetection,
		monitoringFileIO: fileOptionDetection,
		monitoringDatabaseIO: dbOptionDetection
	}, function(result) {
		$("#attachingModel").modal("hide");
		if(result.status == 0) {
			isMonitoring = true;
			$("#resultModalBody").html(result.monitoring_result);
			$("#resultModal").modal("show");
			onRefreshDeviceList();
			refreshFridaLog(port);
		} else {
			$("#resultModalBody").html(result.reason + "<br/><br/>" +
					"1. 检查测试设备的网络连接是否正常？<br/>" +
					"2. 检查frps控制台是否存在测试设备连接？<br/>" +
					"3. 请尝试重新启动SecIoT Agent模块再试<br/>" +
					"4. 请尝试重新启动设备再试<br/>" +
					"5. 如果在启动检测的过程中，被检测应用始终提示“已停止运行”，那么可能是Frida对您设备的Android版本未兼容，请尝试更换设备再试。");
			$("#resultModal").modal("show");
		}
	});
}

function refreshFridaLog(port) {
	$.get("/SecMobile/android/refresh-frida-log", {
		port: port
	}, function(result) {
		if(result.status == 0) {
			$("#fridaLogArea").html(result.log);
		}
		if (isMonitoring == true) {
			refreshFridaLog(port);
		}
	});
}

function stopMonitoring(client_id, port) {
	$("#attachingModel").modal("show");
	$.get("/SecMobile/android/stop-monitoring", {
		clientId: client_id,
		port: port
	}, function(result) {
		$("#attachingModel").modal("hide");
		if(result.status == 0) {
			isMonitoring = false;
			$("#resultModalBody").html(result.monitoring_result);
			$("#resultModal").modal("show");
			onRefreshDeviceList();
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onRefreshHistoryList() {
	$.get("/SecMobile/history/getHistoryAll", {}, function(result) {
		if(result.status == 0) {
			var historyBody = "";
			for (var i = 0, len = result.history_list.length; i < len; ++i) {
				historyBody += '<tr>';
				historyBody += '<td>'+(i+1)+'</td>';
				historyBody += '<td>'+result.history_list[i].name+'</td>';
				historyBody += '<td>'+result.history_list[i].date+'</td>';
				historyBody += '<td>'+result.history_list[i].type+'</td>';
				historyBody += '<td>'+result.history_list[i].target+'</td>';
				historyBody += '<td>';
				var type = result.history_list[i].type;
				if (type == "firmware-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#firmwareStaticResultModal" onclick="onShowFwStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				} else if (type == "android-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#androidStaticResultModal" onclick="onShowAndroidStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				} else if (type == "ios-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#iosStaticResultModal" onclick="onShowiOSStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				}
				historyBody += '<button class="btn btn-sm btn-info" data-toggle="modal" data-target="#editHistoryName" onclick="onEditHistoryName(\''+result.history_list[i].id+'\', \''+result.history_list[i].name+'\')">编辑</button>';
				historyBody += '<button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteHistory" onclick="onDeleteHistory(\''+result.history_list[i].id+'\')">删除</button>';
				historyBody += '</td>';
				historyBody += '</tr>';
			}
			$("#historyBody").html(historyBody);
			if (result.history_list.length == 0) {
				$("#resultModalBody").html("暂时没有检测记录");
	     		$("#resultModal").modal("show");
	     		return;
			}
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onRefreshHistoryListByType(type) {
	if (typeof(type) == "undefined" || type == null || type == "all") {
		onRefreshHistoryList();
		return;
	}
	$.get("/SecMobile/history/getHistoryByType", {
		type: type
	}, function(result) {
		if(result.status == 0) {
			var historyBody = "";
			for (var i = 0, len = result.history_list.length; i < len; ++i) {
				historyBody += '<tr>';
				historyBody += '<td>'+(i+1)+'</td>';
				historyBody += '<td>'+result.history_list[i].name+'</td>';
				historyBody += '<td>'+result.history_list[i].date+'</td>';
				historyBody += '<td>'+result.history_list[i].type+'</td>';
				historyBody += '<td>'+result.history_list[i].target+'</td>';
				historyBody += '<td>';
				var type = result.history_list[i].type;
				if (type == "firmware-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#firmwareStaticResultModal" onclick="onShowFwStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				} else if (type == "android-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#androidStaticResultModal" onclick="onShowAndroidStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				} else if (type == "ios-static") {
					historyBody += '<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#iosStaticResultModal" onclick="onShowiOSStaticHistory(\''+result.history_list[i].detailid+'\')">查看报告</button>';
				}
				historyBody += '<button class="btn btn-sm btn-info" data-toggle="modal" data-target="#editHistoryName" onclick="onEditHistoryName(\''+result.history_list[i].id+'\', \''+result.history_list[i].name+'\')">编辑</button>';
				historyBody += '<button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteHistory" onclick="onDeleteHistory(\''+result.history_list[i].id+'\')">删除</button>';
				historyBody += '</td>';
				historyBody += '</tr>';
			}
			$("#historyBody").html(historyBody);
			if (result.history_list.length == 0) {
				$("#resultModalBody").html("暂时没有检测记录");
	     		$("#resultModal").modal("show");
	     		return;
			}
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onShowFwStaticHistory(id) {
	$.get("/SecMobile/history/getFwHistoryById", {
		id: id
	}, function(result) {
		if(result.status == 0) {
			showFwAnalysis(result);
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onShowAndroidStaticHistory(id) {
	$.get("/SecMobile/history/getAndroidHistoryById", {
		id: id
	}, function(result) {
		if(result.status == 0) {
			showApkAnalysis(result);
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onShowiOSStaticHistory(id) {
	$.get("/SecMobile/history/getAppleiOSHistoryById", {
		id: id
	}, function(result) {
		if(result.status == 0) {
			showIpaAnalysis(result);
		} else {
			$("#resultModalBody").html(result.reason);
     		$("#resultModal").modal("show");
		}
	});
}

function onEditHistoryName(id, name) {
	$("#editHistoryId").val(id);
	$("#historyNewName").val(name);
}

function editHistoryName() {
	var id = $("#editHistoryId").val();
	var name = $("#historyNewName").val();
	$.post("/SecMobile/history/edit", {
		id: id,
		name: name
	}, function(result) {
		onRefreshHistoryList();
		$("#resultModalBody").html(result.reason);
 		$("#resultModal").modal("show");
	});
}

function onDeleteHistory(id) {
	$("#deleteHistoryId").val(id);
}

function deleteHistory() {
	var id = $("#deleteHistoryId").val();
	$.post("/SecMobile/history/delete", {
		id: id
	}, function(result) {
		$("#resultModalBody").html(result.reason);
 		$("#resultModal").modal("show");
	});
}

