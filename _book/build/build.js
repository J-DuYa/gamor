/* 第一步执行gitbook */
const { execSync, exec } = require('child_process')
const chalk = require('chalk')
const log = require('npmlog')

console.log(chalk.greenBright('开始执行脚本\n'))

start()

async function start () {
	try {
		log.info('启动 gitbook')
		await getExecSync('gitbook serve')
		log.info('gitbook 已经启动成功')
	} catch (err) {
		console.error('发生错误', err)
	}
}

async function getExecSync (cmd) {
	const output = await exec(cmd, 
		(error, stdout, stderr) => {
			log.info('执行有结果了')
			if (error) {
				log.error('gitbook 在运行过程中发生错误，程序终止')
				return
			}

			log.info(chalk.greenBright(stdout))
		}
	)
	return output;
}