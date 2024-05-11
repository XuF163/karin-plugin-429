import { App } from '#Karin'
const fs = require('fs');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const app = App.init({
  /** 必选 插件名称 */
  name: 'QbitLogin',
  /** 插件描述 */
  dsc: '#磁力登录:admin:123456',
  /** 监听事件 默认message */
  event: 'message',
  /** 插件优先级 */
  priority: 5000
})

app.reg({
  /** 命令匹配正则 */
  reg: '/#磁力登录/g',
  /** 命令执行方法名称 */
  fnc: 'QbitLogin',
  /** 是否显示操作日志 true=是 false=否 */
  log: true,
  /** 权限 master,owner,admin,all */
  permission: 'master',
  /** 调用 this.reply 方法回复 hello 关于参数2，请看下文 */
 async QbitLogin() {
    let msg = e.msg;
    // 匹配 #磁力登录 后面的用户名和密码部分
    let match = msg.match(/#磁力登录(.*)/);
    if (match) {
        // 获取匹配到的内容（即用户名和密码部分）
        let credentials = match[1].trim().split(':');
        if (credentials.length === 2) {
            let username = credentials[0].trim();
            let password = credentials[1].trim();
            console.log("用户名:", username);
            console.log("密码:", password);

            // 读取配置文件
            let configPath = '../config/config.yaml';
            let config = {};
            try {
                config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')) || {};
            } catch (e) {
                console.log("读取配置文件出错:", e);
            }

            // 更新配置文件中的用户名和密码
            config.username = username;
            config.password = password;

            // 写入配置文件
            try {
                fs.writeFileSync(configPath, yaml.safeDump(config));
                await e.reply("用户名和密码已写入配置文件");
                exec('python ../models/downloading.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`执行错误: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

            } catch (e) {
                await e.reply("写入配置文件出错:", e);
            }
        } else {
            await e.reply("用户名和密码格式不正确");
        }
    } else {
        await e.reply("未找到 #磁力登录 字段");
    }
}
})

export const QbitLogin = app.plugin(app)