import socketserver
import json
import platform
from run_tools import run_jadx
from run_tools import run_frida
from run_tools import run_unzip_ipa
from android_platform import android_permission
from android_platform import android_ssl_pinning
from android_platform import android_exported
from ios_platform import ios_ats_policy
from ios_platform import ios_background_usage
from ios_platform import ios_permission

class AndroidService:
    @staticmethod
    def get_apk_info(file_name, file_path):
        return run_jadx.get_apk_info(file_name, file_path)

    @staticmethod
    def ssl_pinning(sources_dir):
        return android_ssl_pinning.do(sources_dir)

    @staticmethod
    def permission(manifest_file):
        return android_permission.do(manifest_file)

    @staticmethod
    def exported(manifest_file):
        return android_exported.do(manifest_file)


class FridaService:
    @staticmethod
    def get_frida_version():
        return run_frida.get_frida_version()

    @staticmethod
    def get_process_list(port):
        return run_frida.get_process_list('127.0.0.1:' + str(port))

    @staticmethod
    def monitoring_device(port, process, m_api, m_ip, m_traffic, m_fileio, m_dbio, python_base_dir):
        if platform.system() == 'Windows':
            path_fix = '\\'
        else:
            path_fix = '/'
        js_files = []
        if m_api is True:
            js_files.append(python_base_dir + 'android_injection'+path_fix+'monitoring_api.js')
        if m_ip is True:
            js_files.append(python_base_dir + 'android_injection'+path_fix+'monitoring_ip.js')
        if m_traffic is True:
            js_files.append(python_base_dir + 'android_injection'+path_fix+'monitoring_traffic.js')
        if m_fileio is True:
            js_files.append(python_base_dir + 'android_injection'+path_fix+'monitoring_fileio.js')
        if m_dbio is True:
            js_files.append(python_base_dir + 'android_injection'+path_fix+'monitoring_dbio.js')
        return run_frida.hook('127.0.0.1:' + str(port), process, js_files, python_base_dir)

    @staticmethod
    def stop_monitoring(port):
        return run_frida.stop_hook('127.0.0.1:' + str(port))


class AppleiOSService:
    @staticmethod
    def get_ipa_info(file_name, file_path):
        return run_unzip_ipa.get_ipa_info(file_name, file_path)

    @staticmethod
    def ats_policy(info_plist_file):
        return ios_ats_policy.do(info_plist_file)

    @staticmethod
    def background(info_plist_file):
        return ios_background_usage.do(info_plist_file)

    @staticmethod
    def permission(info_plist_file):
        return ios_permission.do(info_plist_file)


class PySocketServerHandler(socketserver.BaseRequestHandler):
    def handle(self):
        r_data = self.request.recv(2048)
        data = json.loads(r_data.decode('utf8'))
        print("Receive data: "+str(data))
        classname, method, params = self.resolve_data(data)
        ret = self.do_action(classname, method, params)
        print("Send data: "+str(ret))
        self.request.sendall(json.dumps(ret).encode('utf8'))

    @staticmethod
    def resolve_data(data):
        cmd = data['cmd']
        params = data['params']
        classname = cmd.split('.')[0]
        method = cmd.split('.')[1]
        print('classname: '+classname)
        print('method: '+method)
        print('params: '+str(params))
        return classname, method, params

    @staticmethod
    def do_action(classname, method, params):
        result = {}
        try：
            if classname == 'AndroidService':
                if method == 'get_apk_info':
                    result = AndroidService.get_apk_info(params['file_name'], params['file_path'])
                elif method == 'permission':
                    result = AndroidService.permission(params['apk_info']['apk_manifest_file'])
                elif method == 'exported':
                    result = AndroidService.exported(params['apk_info']['apk_manifest_file'])
                elif method == 'ssl_pinning':
                    result = AndroidService.ssl_pinning(params['apk_info']['apk_sources_path'])

            elif classname == 'FridaService':
                if method == 'get_frida_version':
                    result = FridaService.get_frida_version()
                elif method == 'get_process_list':
                    result = FridaService.get_process_list(params['port'])
                elif method == 'monitoring_device':
                    result = FridaService.monitoring_device(
                        params['port'],
                        params['process'],
                        params['monitoring_api'],
                        params['monitoring_ip'],
                        params['monitoring_traffic'],
                        params['monitoring_fileio'],
                        params['monitoring_dbio'],
                        params['python_base_dir']
                    )
                elif method == 'stop_monitoring':
                    result = FridaService.stop_monitoring(params['port'])

            elif classname == 'AppleiOSService':
                if method == 'get_ipa_info':
                    result = AppleiOSService.get_ipa_info(params['file_name'], params['file_path'])
                elif method == 'permission':
                    result = AppleiOSService.permission(params['ipa_info']['ipa_info_plist_file'])
                elif method == 'background':
                    result = AppleiOSService.background(params['ipa_info']['ipa_info_plist_file'])
                elif method == 'ats_policy':
                    result = AppleiOSService.ats_policy(params['ipa_info']['ipa_info_plist_file'])

            if len(result) != 0:
                ret = {
                    'status': 0,
                    'reason': 'OK',
                    'data': result
                }
            else:
                ret = {
                    'status': -1,
                    'reason': 'No such python method or python error'
                }
        except Exception as e:
            print(e)
            ret = {
                'status': -1,
                'reason': 'Python error'
            }
        return ret


if __name__ == '__main__':
    server = socketserver.ThreadingTCPServer(('localhost', 8081), PySocketServerHandler)
    server.serve_forever()
