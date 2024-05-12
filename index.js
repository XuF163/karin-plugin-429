import path from 'path'
import { logger, common } from '#Karin'

/** 当前文件的绝对路径 */
const filePath = common.absPath(import.meta.url.replace(/^file:(\/\/\/|\/\/)/, ''))
/** 插件包的目录路径 */
const dirname = path.dirname(filePath)
/** 插件包的名称 */
const basename = path.basename(dirname)
/** 插件包相对路径 */
const dirPath = './plugins/' + basename
//配置文件
//检查config目录下是否为空
const configPath = path.join(dirname, 'config', 'config.yaml')
const defConfigPath = path.join(dirname, 'config', 'defSet', 'config.yaml')
const configFileExists = common.fileExists(configPath)
// 如果config目录下的config.yaml文件不存在，则从defSet目录下的config.yaml复制到config目录下
if (!configFileExists) {
  common.copyFile(defConfigPath, configPath)
}
export { dirPath }

logger.info(basename + ' 插件 0.0.1 初始化~')
