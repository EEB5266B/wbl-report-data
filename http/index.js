const axios = require('axios');

/**
 * 创建一个HTTP请求类，用于封装对API的请求
 */
class http {

    /**
     * 构造函数，初始化axios实例
     */
    constructor() {
        // 创建axios实例
        this.axiosInstance = axios.create({
            baseURL: 'https://trade-api.seasunwbl.com/m_api',
            timeout: 5000,
            headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0'} // 默认请求头
        });

        // 添加请求拦截器，用于在发送请求前对请求配置进行处理
        this.axiosInstance.interceptors.request.use(config => {
                return config;
            }, error => {
                console.error('请求错误:', JSON.stringify(error));
                return Promise.reject(error);
            }
        );

        // 添加响应拦截器，用于对服务器返回的响应数据进行处理
        this.axiosInstance.interceptors.response.use(response => {
                return response;
            }, error => {
                console.error('响应错误:', JSON.stringify(error));
                return Promise.reject(error);
            }
        );
    }

    /**
     * GET请求方法，用于向指定URL发送GET请求
     * @param url 请求的URL
     * @param params 请求参数
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    get(url, params) {
        // 发送GET请求，并返回响应数据
        return this.axiosInstance.get(url, {params}).then(response => response.data)
    }
}

module.exports = new http();
