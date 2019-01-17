/**
 * 登录模块的接口
 * */
import base from './base';  //接口域名列表
import axios from '@/utils/http'; //导入创建的axios实例
import qs from 'qs'; //序列化post请求的

let www = base.proxy;  //通过一个变量转一下，这样在改要使用的接口域名是更方便,只改这个位置就好了。

//开始定义接口
const login = {
    loginApi1(params){
        /*
        return axios.get(`${base.proxy}/ajax/detailmovie`,{
            params: params
        })
        */
        return axios.get(`${www}/ajax/detailmovie`,{
            params: params
        })
    },
    loginApi2(params){
        return axios.post(`${www}/ajax/movie`,qs.stringify(params))
    }

    // 登录模块的其他接口
    // ... ...
};

export default login;
