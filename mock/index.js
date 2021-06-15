const path = require('path');
const fs = require('fs')

const modulesPath = path.join(__dirname, './modules')

const getModules = () => {
    const currentMap = fs.readdirSync(modulesPath)
    const modules = {}

    const run = (basePath, routes = []) => {
        return routes.map(moduleName => {
            const curPath = path.join(basePath, moduleName)
            try {
                const next = fs.readdirSync(curPath)
                
                if (Array.isArray(next)) {
                    run(curPath, next)
                }
            } catch (error) {
                const api = require(curPath)
                modules[curPath] = api
            }
        })
    }

    run(modulesPath, currentMap)
    console.log('modules',modules)
    return modules
}

const modules = getModules()

module.exports = {
    modules,
}