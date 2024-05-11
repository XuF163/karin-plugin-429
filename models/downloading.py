from qbittorrent import Client
import json
import os
import time
import yaml
# 创建 Client 对象，连接到 qBittorrent 的 Web API
qb = Client("http://192.168.1.75:8080/")
#读取账号密码配置
with open('../config/config.yaml', 'r') as f:
    config = yaml.safe_load(f)
# 登录 qBittorrent
qb.login(config['username'], config['passwd'])



def download_torrent_from_json(json_file_path, download_path, downloaded_files):
    # 从 JSON 文件中加载数据
    with open(json_file_path, 'r', encoding='utf-8') as input_file:
        data = json.load(input_file)

    # 提取磁力链接
    magnet_link = data.get('magnet_link')

    if magnet_link:
        # 检查文件是否已经下载过，如果是，则跳过
        movie_name = data.get('movie_name', '')
        if movie_name in downloaded_files:
            print(f"文件 {movie_name} 已经下载过，跳过并删除对应的 JSON 文件。")
            os.remove(json_file_path)  # 删除对应的 JSON 文件
            return

        # 从磁力链接下载一个种子，指定保存路径
        qb.download_from_link(magnet_link, savepath=download_path)
        downloaded_files.append((movie_name, json_file_path))  # 将下载过的文件添加到列表
        print(f"成功下载种子：{movie_name}")

        # 删除 JSON 文件
        os.remove(json_file_path)
        print(f"JSON 文件 {json_file_path} 已删除。")
    else:
        print(f"未找到有效的磁力链接：{json_file_path}")

def cancel_if_remaining_time_exceeds(task, max_remaining_time_hours=3):
    remaining_time = task.get('eta', 0)  # eta is the estimated time of arrival
    if remaining_time > max_remaining_time_hours * 3600:  # Convert hours to seconds
        hash_value = task.get('hash')
        if hash_value:
            qb.pause(hash_value)
            qb.delete(hash_value)
            print(f"任务 {task['name']} 被取消，因为剩余下载时间超过三小时。")

# 指定存储 JSON 文件的目录
json_directory = 'To_Be_downloaded'

# 获取目录中所有的 JSON 文件
json_files = [f for f in os.listdir(json_directory) if f.endswith('.json')]

# 跟踪已下载的文件列表
downloaded_files = []

# 遍历每个 JSON 文件并下载种子
for json_file in json_files:
    json_file_path = os.path.join(json_directory, json_file)
    download_torrent_from_json(json_file_path, json_directory, downloaded_files)

# 等待一分钟，确保所有下载任务都开始了
time.sleep(60)

# 获取所有种子的信息
torrents = qb.torrents()

# 遍历每个种子并取消超过三小时的任务
for torrent in torrents:
    cancel_if_remaining_time_exceeds(torrent)
