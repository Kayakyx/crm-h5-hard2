/**
 * 接口域名的管理
 */
/*
通过base.js来管理我们的接口域名，不管有多少个都可以通过这里进行接口的定义。即使修改起来，也是很方便的。
*/
const base = {
    sq: 'http://xxxxx11111.com',
    bd: 'http://xxxxx22222.com/api',
    my: 'http://m.maoyan.com',
    //想上线的时候直接在直接在每个模块的接口模块改一下就好了。
    //如果本地开发时需要反向代理。这里可以写你在 vue-cli3.x 中的 vue.config.js 配置的代理暗号。我这里配置的时 /api,所以我要写为：
    proxy: '/api'
};

export default base;