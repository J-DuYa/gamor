/* ui打包 */
const { join } = require('path')
const { utils } = require('umi')
const chalk = require('chalk')
const log = require('npmlog')
const { fork } = require('child_process')
const UMI_BIN = require.resolve('umi/bin/umi')
const getPackages = require('./getPackage')
const { existsSync } = require('fs')

/* 监控服务是不是实时监听 */
const watch = process.argv.includes('-w') || process.argv.includes('--watch')

const { signale } = utils

log.info('正在构建 UI 界面')

const uiApp = () => {
	return new Promise((resolve, reject) => {
		try {
			const child = fork(UMI_BIN, [ watch ? 'dev' : 'build', ...(watch ? ['--watch'] : [])], {
				env: {
          APP_ROOT: './packages/ui/web',
          UMI_UI: 'none',
          FRIENDLY_ERROR: 'none',
          UMI_UI_SERVER: 'none',
          PORT: 6000,
          BROWSER: 'none',
          NODE_ENV: watch ? 'production' : 'development',
          BABEL_POLYFILL: 'none'
        }
			})

			child.on('exit', code => {
				log.info('UI 构建退出', code)
				if (code === 1) {
					signale.fatal('UI App build error')
					process.exit()
				}

				signale.complete('UI App done')
        resolve(child)
			})
		} catch (error) {
			log.error('UI 构建失败')
			reject(error)
		}
	})
} 

const buildPlugin = cwd => {
	return new Promise((resovle, reject) => {
		try {
			const pluginProcess = fork(UI_BUILD_BIN, watch ? ['--watch'] : [], {
				cwd,
				env: {
          NODE_ENV: watch ? 'production' : 'development'
        }
			})

			pluginProcess.on('exit', code => {
        if (code === 1) {
          process.exit(1);
        }
        resolve(pluginProcess)
      })
		} catch (error) {
			log.error(error)
		}
	})
}

(async () => {
	// exit by Ctrl/Cmd + C
  process.on('SIGINT', () => {
    signale.info('exit build by user')
    process.exit(0)
  })
	const packages = getPackages()
	console.log(chalk.blue(JSON.stringify(packages)))
	const uiPlugins = packages
    .filter(
      ({ pkgPath }) => existsSync(join(pkgPath, 'ui')) || existsSync(join(pkgPath, 'ui.config.js')),
    )
    .map(({ pkgPath }) => pkgPath)

  const buildQueue = [...uiPlugins.map(buildPlugin), uiApp()]
  try {
    await Promise.all(buildQueue)
  } catch (e) {
    console.error('ee', e)
  }
})()