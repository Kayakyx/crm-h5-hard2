/**axios封装升级后的http.js*/

/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
//引入路由用来跳转
import router from '../router';
import store from '../store'; //引入Vuex用来获取状态
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import { Toast } from 'vant';

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
    Toast({
        message: msg,
        duration: 1000,
        forbidClick: true
    });
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    /*
        router.replace跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录
        这里是进行登录进行登录拦截后，用户登陆成功了，要再跳回用户想看的页面。所以在转到 '/login' 时，要通过路由传参，把用户想访问的路由，通过，
        query传过去，这样的就可以在登录成果后，通过相关代码再调回用户原来想访问的界面。
    */
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        //这里根据你们项目中的具体返回的  状态码  进行编写。
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            tip('登录过期，请重新登录'); //调用提示函数
            //清楚token
            localStorage.removeItem('token');
            store.commit('loginSuccess', null); //将Vuex中的token赋值为null
            //1s后跳转登录页
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        // 404请求不存在
        case 404:
            tip('请求的资源不存在');
            break;
        default:
            console.log(other);
    }
};

// 创建axios实例(可以使用自定义配置新建一个 axios 实例, 详见官方文档)，
//  create({option}) option为对新建的axios实例的配置。;
var instance = axios.create({timeout: 1000 * 12}); //如果请求话费了超过 `timeout` 的时间，请求将被中断
// 设置post请求头 (序列化时<FormData>必须的请求头)
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    //采用的箭头函数写法
    //config 为axios实例后的的请求配置信息。
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        /*
        这里说一下token，一般是在登录完成之后，将用户的token通过localStorage或者cookie存在本地，
        然后用户每次在进入页面的时候（即在main.js中），会首先从本地存储中读取token，如果token存在说明用户已经登陆过，
        则更新vuex中的token状态。然后，在每次请求接口的时候，都会在请求的header中携带token，后台人员就可以根据你携带
        的token来判断你的登录是否过期，如果没有携带，则说明没有登录过。这时候或许有些小伙伴会有疑问了，就是每个请求都
        携带token，那么要是一个页面不需要用户登录就可以访问的怎么办呢？其实，你前端的请求可以携带token，但是后台可以
        选择不接收啊！
        */
        const token = store.state.token; ////获取vuex 中的token （要提前在vuex的store定义token）
        token && (config.headers.Authorization = token); ////token 存在的情况下， config.headers.Authorization = token
        return config;
    },
    //error 为错误信息
    error => Promise.error(error));

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功 (又分为是否正常返回数据)
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
        const { response } = error;
        // console.log('error',response);
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message); //调用错误处理函数。
            return Promise.reject(response); //依然返回错误的信息
            //如果出错了，不用返回后端传来的信息
            // return Promise.reject("错误了");
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);//false表示没网了

            //关于断网的另一种解决没网的思路
            //如果不想用 vuex ，可以是新建一个notnetwork 的.vue 文件;在这个页面一般会有点击刷新，要在返回到用户原来停留的页面。
            router.replace({
                path: '/notnetwork',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
        }
    });

//暴露出封装的axios实例
export default instance;







































