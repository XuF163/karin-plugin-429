import { plugin } from '#Karin'
import { promises as fs } from 'fs';


const jsonFilePath = '../data/last_sign_in_time.json';
export class example extends plugin {
  constructor () {
    super({
      name: '被动骗赞',
      dsc: '我也要骗赞',
      event: 'message',
      priority: -999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999,
      rule: [
        {
          reg: '#赞我',
          fnc: 'thumbme'
        }
      ]
    })
  }

  async thumbe() {
    try {
      // 获取当前时间
      let currentTime = new Date();
      currentTime.setHours(0, 0, 0, 0); // 设置为当天的凌晨时间

      // 读取 JSON 文件中的上次执行时间
      let lastExecutionTime = null;
      try {
        const content = await fs.readFile(jsonFilePath, 'utf-8');
        lastExecutionTime = JSON.parse(content);
      } catch (error) {
        // 如果文件不存在或无法解析为 JSON，则设置上次执行时间为 null
        lastExecutionTime = null;
      }

      // 如果上次执行时间不是今天，则执行签到操作
      if (!lastExecutionTime || new Date(lastExecutionTime).getTime() !== currentTime.getTime()) {
        // 更新上次执行时间为当前时间
        await fs.writeFile(jsonFilePath, JSON.stringify(currentTime), 'utf-8');

        // 执行签到操作
        await this.reply("赞我");
      } else {
        // 如果上次执行时间是今天，则不返回任何内容
        return;
      }
    } catch (error) {
      console.error("发生错误：", error);
    }
  }
}
