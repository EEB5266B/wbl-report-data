const request = require('../../http');
const file = require('../../file')
const config = require('../../config.json')

// 获取当前日期时间
const now = new Date();
let year = now.getFullYear();
let month = ('0' + (now.getMonth() + 1)).slice(-2);
let day = ('0' + now.getDate()).slice(-2);
let hour = ('0' + now.getHours()).slice(-2);
let minute = ('0' + now.getMinutes()).slice(-2);
let second = ('0' + now.getSeconds()).slice(-2);

// 构造数据路径
const dataPath = `${year}/${month}/${day}`;
// 构造时间名称，用于文件名
const timeName = `${hour}.json`;
// 当前时间
const updateTime = `${year}-${month}-${day} ${hour}`;
// 创建时间
const createTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

/**
 * 获取商品列表
 * @param {string} keyword - 搜索关键词
 * @param {number} priceSort - 价格排序方式
 * @param {number} stateFilter - 商品状态过滤
 * @returns {Promise} - 返回商品列表数据的Promise对象
 */
const getList = (keyword, priceSort, stateFilter) => {
    // 构造请求参数
    const data = {
        keyword,
        'sort[price]': priceSort,
        'filter[state]': stateFilter,
        goods_type: 3,
        size: 1,
        page: 1
    }

    // 发起请求并处理响应
    return request.get('/buyer/goods/list', data).then(data => {
        // 检查响应数据的正确性
        if (data && data.code === 1 && data.msg === 'SUCCESS' && data.data) {
            return data.data
        } else {
            // 如果数据不正确，拒绝Promise并返回错误信息
            return Promise.reject(data.msg);
        }
    })
}

/**
 * 获取商品单价
 * @param {Object} goodsList - 商品列表数据
 * @returns {number} - 返回单价
 */
const getGoodsSingleUnitPrice = (goodsList) => {
    // 如果列表有数据，则返回第一条数据的单价，否则返回0
    if (goodsList.list.length > 0) {
        return goodsList.list[0].single_unit_price / 100
    }

    return 0
}

/**
 * 获取商品关注热度
 * @param {Object} goodsList - 商品列表数据
 * @returns {number} - 返回关注热度
 */
const getGoodsFollowHeat = (goodsList) => {
    // 如果列表有数据，则返回第一条数据的关注热度，否则返回0
    if (goodsList.list.length > 0) {
        return goodsList.list[0].follow_heat_30
    }

    return 0
}

/**
 * 获取商品销售热度
 * @param {Object} goodsList - 商品列表数据
 * @returns {number} - 返回销售数量
 */
const getGoodsSellCnt = (goodsList) => {
    // 如果列表有数据，则返回第一条数据的销售数量，否则返回0
    if (goodsList.list.length > 0) {
        return goodsList.list[0].sell_cnt_30
    }

    return 0
}

/**
 * 获取商品总数
 * @param {Object} goodsList - 商品列表数据
 * @returns {number} - 返回商品总数
 */
const getGoodsTotal = (goodsList) => {
    // 返回商品总数
    return goodsList.total_record
}

/**
 * 获取商品信息并写入文件
 * @param {string} keyword - 搜索关键词
 */
const getGoodsInfo = (keyword) => {
    // 同时发起多个请求获取不同条件下的商品列表
    Promise.all([getList(keyword, 0, 1), getList(keyword, 0, 2), getList(keyword, 1, 1), getList(keyword, 1, 2)]).then((goodsList) => {
        // 解构获取不同的商品列表
        const listedMax = goodsList[0];
        const saleMax = goodsList[1];
        const listedMin = goodsList[2];
        const saleMin = goodsList[3];

        // 构造商品信息数据对象
        const data = {
            listedMaxPrice: getGoodsSingleUnitPrice(listedMax),
            listedMinPrice: getGoodsSingleUnitPrice(listedMin),
            listedTotal: getGoodsTotal(listedMax),
            saleMaxPrice: getGoodsSingleUnitPrice(saleMax),
            saleMinPrice: getGoodsSingleUnitPrice(saleMin),
            saleTotal: getGoodsTotal(saleMin),
            followHeat: getGoodsFollowHeat(listedMax),
            sellCnt: getGoodsSellCnt(listedMax),
            updateTime,
            createTime
        }
        // 将商品信息写入文件
        file.write(JSON.stringify(data), `${timeName}`, `${config.outputPath}/${keyword}/${dataPath}`)
    }).catch(err => {
        // 如果请求失败，打印错误信息
        console.error('请求返回信息异常' + err)
    });
}

module.exports = {getGoodsInfo}
