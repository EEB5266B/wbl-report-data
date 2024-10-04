const {getGoodsInfo} = require('./api/buyer/goods.js')

const args = process.argv.slice(2);

args.forEach(arg => getGoodsInfo(arg))
