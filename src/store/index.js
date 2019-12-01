/**
 * 2. 新建store 文件 创建单一数据源
 */

//支持异步请求
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';//引入包
// import { createLogger } from 'redux-logger'
import reducers from './reducers';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require(`redux-logger`);
    const logger = createLogger({
        // ...options
    });

    middlewares.push(logger);
}


const composeEnhancers =
    typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
);

//绑定
export default createStore(reducers, enhancer);