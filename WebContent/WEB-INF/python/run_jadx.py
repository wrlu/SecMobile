import platform
import subprocess
import os


def get_apk_info(file_name, path):
    result = jadx(path, '')
    if result == '':
        raise OSError('jadx runs failed.')
    if platform.system() == 'Windows':
        path_fix = '\\'
    else:
        path_fix = '/'
    apk_out_directory = path + '.jadx.out'
    apk_source_directory = apk_out_directory + path_fix + 'sources'
    apk_resource_directory = apk_out_directory + path_fix + 'resources'
    apk_manifest_file = apk_resource_directory + path_fix + 'AndroidManifest.xml'
    apk_lib_directory = apk_resource_directory + path_fix + 'lib'
    apk_lib_support_abis = os.listdir(apk_lib_directory)
    apk_info = {
        'apk_name': file_name,
        'apk_path': path,
        'apk_sources_directory': apk_source_directory,
        'apk_resources_directory': apk_resource_directory,
        'apk_manifest_file': apk_manifest_file,
        'apk_lib_directory': apk_lib_directory,
        'apk_lib_support_abis': apk_lib_support_abis
    }
    return apk_info


def jadx(path, params):
    cmd = 'jadx ' + params + ' -d ' + path + '.jadx.out ' + path
    print(cmd)
    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    result = ''
    for line in process.stdout.readlines():
        result += line.decode('utf8')
        print(line.decode('utf8').replace('\n', ''))
    return result


if __name__ == '__main__':
    path = 'D:\\Analysis\\com.huawei.ipc.apk'
    file_name = 'com.huawei.ipc.apk'
    apk_info = get_apk_info(file_name, path)
    print(apk_info)
