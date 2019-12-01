//引入axios模块
import axios from 'axios';
import { Toast } from 'antd-mobile';
export const BASE_URL = process.env.REACT_APP_BASE_URL;


//统一封装请求
export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 配置拦截器

// 添加请求拦截器
API.interceptors.request.use(function (config) {
  // 开启loading
  Toast.loading('加载中...', 5, () => {
    console.log('Load complete !!!');
  });
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
API.interceptors.response.use(function (response) {

  // 全局关闭 loading效果
  Toast.hide();
  // 对响应数据做点什么
  return response.data.body;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});