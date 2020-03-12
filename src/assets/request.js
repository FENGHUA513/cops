import axios from 'axios'
import {
    Message,
    MessageBox
} from 'element-ui'
import store from '../store/index'
import {getToken}  from './auth'

// create an axios instance
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    headers: {'content-type': 'application/json;charset=UTF-8'},//在这里需要单独设置一下header
    // headers: {'content-type': 'application/x-www-form-urlencoded'},//在这里需要单独设置一下header
    // headers: { 'content-type': 'application/json, text/plain, */*'},
    timeout: 20000
})

// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent
    // console.log(111,config);
    // console.log(222,store);
    // console.log(333,store.getters);
    // console.log(444, config.headers['Authorization']);
    // console.log(555, config.headers['token']);
    // console.log(666, getToken());
    // JSON.parse(store.getters.token).token
    if (store.getters.token) {
        config.headers['Authorization'] = JSON.parse(getToken()).token // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['token'] = JSON.parse(getToken()).token
        // config.headers['Authorization'] = 'rules eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODA1MTcyNDIsImpvYk51bWJlciI6InJvb3QifQ.2uGRpoLxqw4AmsCuaavcTcbif36OYZqvx2wKyLieDKY55o8ULqOvt4iGbJ621xs2EGGg8lljTO2dTb9ldt7XoA' // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        // config.headers['token'] = 'rules eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODA1MTcyNDIsImpvYk51bWJlciI6InJvb3QifQ.2uGRpoLxqw4AmsCuaavcTcbif36OYZqvx2wKyLieDKY55o8ULqOvt4iGbJ621xs2EGGg8lljTO2dTb9ldt7XoA'


    }
    // console.log(969693,this.$cookies.get('token'));
    return config
}, error => {
    // Do something with request error
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        // console.log(11111,response);
        if (response.data.code === 401 || response.data.status === 403) {
            MessageBox.confirm('你已被登出或者没权限,请刷新页面后重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            })
        }
        return response
    },
    // {
    // /**
    // * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
    // * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
    // */
    //   const res = response.data
    //   console.log(res)
    //   if (res.code !== 200) {
    //     Message({
    //       message: res.message,
    //       type: 'error',
    //       duration: 2 * 1000
    //     })
    //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //   confirmButtonText: '重新登录',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   store.dispatch('FedLogOut').then(() => {
    //     location.reload()// 为了重新实例化vue-router对象 避免bug
    //   })
    // })
    //     }
    //     return Promise.reject('error')
    //   } else {
    //     return response.data
    //   }
    // },
    error => {
        // console.log('err' + error)// for debug
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        // return Promise.reject(error)
        // console.log(error.response)
        console.log(119,error);
        console.log(229,error.response);
        console.log(339,response);
        if (error.response.data.status === 401 || error.response.data.status === 403) {
            MessageBox.confirm('你已被登出或者没权限,请刷新页面后重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            })
        }
        if (error.response.data.code === '500001' || error.response.data.code === '500004' || error.response.data.code === '400001') {
            Message({
                message: error.response.data.msg,
                type: 'error',
                duration: 3 * 1000
            })
        }
        if (error.response && error.response.data && error.response.data.location) {
            window.location = error.response.data.location
        } else {
            console.log(error)
            return Promise.reject(error)
        }
    })

export default service