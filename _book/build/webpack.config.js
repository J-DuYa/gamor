/**
 * @description 需要封装一个webpack打包机制，打包packages下面的一些包文件 
*/
const path = require('path')

const env = 'development'

module.exports = {
	mode: env,
	devtool: 'inline-source-map',
	entry: {
		app: './index.js'
	},
	devServer: {
		hot: true,
		port: 2000,
		inline: true,
		progress: true
	}
}