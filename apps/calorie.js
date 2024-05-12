import { App } from '#Karin'
import Cfg from '../lib/config.js'
import axios from 'axios'
import request from 'request'
import baidu_ack from "../models/baidu_ack.js";

const app = App.init({
  /** 必选 插件名称 */
  name: 'calorie',
  /** 插件描述 */
  dsc: '基于百度云的热量炸弹当量计算器 暂时只支持部分图片格式',
  /** 监听事件 默认message */
  event: 'message',
  /** 插件优先级 */
  priority: 5000
})

app.reg({
  /** 命令匹配正则 */
  reg: '.*#?热量炸弹.*',
  /** 命令执行方法名称 */
  fnc: 'calorie',
  /** 是否显示操作日志 true=是 false=否 */
  log: true,
  /** 权限 master,owner,admin,all */
  permission: 'all',
  /** 调用 this.reply 方法回复 hello 关于参数2，请看下文 */
  async calorie () {
      const Cl_msg = e.msg
      const PicUrl = Cl_msg.match(/https[^,]+/);
      logger.mark(`提取到图片链接：${PicUrl}`)


      logger.mark(`获取到AK和SK，开始获取ack`)
      let ack = await baidu_ack.getAccessToken(ak, sk)

      /*拼接url
      @baseurl https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=【调用鉴权接口获取的token】
       */
      let baidu_url = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${ack}`
      //发起请求
      let options = {
          'method': 'POST',
          'headers': {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: {
              'url': PicUrl
          }
      };

      request(options, function (error, response) {
          if (error) throw new Error(error)
          logger.mark(response.body);
          let res = JSON.parse(response.body)
          //获取菜名字和卡路里字段
          let name = res.result[0].name
          let caluli = res.result[0]?.calorie
          e.reply([`菜名：${name} 热量：${caluli}k卡`])


      })
  }
export const calorie = app.plugin(app)
