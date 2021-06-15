const {modules} = require('./index');
const Mock = require('mockjs');
const chokidar = require('chokidar');

const path = require('path');

const modulesPath = path.join(__dirname, './modules');

// 是否全局开启 mock
const START_MOCK = true;

const BASE_URL = '/api';

// 根据路由注册的 Map
const mockApiMap = new Map();

const setApiMap = (m) => {
    mockApiMap.set(`${BASE_URL}${m.url}`, {...m});
}

const registerModule = (m, path) => {
    // 兼容返回为数组和对象的情况
    if (Array.isArray(m)) {
        return m.map(api => {
            setApiMap({...api, path})
        });
    }

    setApiMap({...m, path})
};

// 注册 mock api
Object.entries(modules).forEach(([modulePath, module]) => registerModule(module, modulePath));

console.log('[MOCK_API_MAP]: ', mockApiMap);

// watch files, hot reload mock server
chokidar
    .watch(modulesPath, {
        ignored: /mock-server/,
        ignoreInitial: true
    })
    .setMaxListeners(50)
    .on('all', (event, path) => {
        if (event === 'change') {
            delete require.cache[path];
            console.log(`Mock File has changed ${path}`);

            const module = require(path);

            const moduleByPath = Array.isArray(module) ? module.map(m => ({...m, path: path})) : {...module, path};

            registerModule(moduleByPath);
        }
    });

module.exports = app => {
    console.log('\n [MOCK SERVER REGISTER]. \n')
    app.use(async (req, res, next) => {
        const matchMockApi = mockApiMap.has(req.url) && START_MOCK;

        // 为 /api 请求 && 开启了全局 mock && 该 api 已成功注册 mock
        if (req.url.match(/^\/api/) && matchMockApi) {
            const api = mockApiMap.get(req.url);

            // api 是否开启 mock
            if (api._proxy) {
                try {
                    const resp =
                        typeof api.response === 'function' ? await Mock.mock(api.response(req, res)) : api.response;

                    console.log(`[MOCK_API_INVOKE]: ${api.url}`);

                    if (api._timeout) {
                        setTimeout(() => {
                            res.json({from: '_mock', ...resp});
                        }, api._timeout);
                    } else {
                        res.json({from: '_mock', ...resp});
                    }
                } catch (error) {
                    console.error('[Mock invoke error]', error)
                }
            } else {
                next();
            }
        } else {
            next();
        }
    });
};
