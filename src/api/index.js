import request from '../assets/request'
// 登录接口
export function LoginByUsername(data) {
    return request({
        url:'login/login',
        method: 'post',
        data:data,
    })
}
// 人员页面的接口总结
// 用户操作接口/ 【/api/userinfo/userInfoAll 分页查询用户信息】<刚刚进入人员页面走的接口，为了获取数据>
export function getPersonalDataInn(data) {
    return request({
        url:'api/userinfo/userInfoAll',
        method: 'get',
        params:data
    })
}
// 用户操作接口 /【/api/userinfo/userInfo 保存用户信息】<添加人员按钮>
export function addPersonalDataInn(data) {
    return request({
        url:'api/userinfo/userInfo',
        method: 'post',
        data:data
    })
}

// 用户操作接口 /【/api/userinfo/userInfo 查询用户详情信息】<点击用户名，出现个人详细信息>
export function detailPersonalDataInn(data) {
    return request({
        url:'api/userinfo/userInfo',
        method: 'get',
        params:data
    })
}
// 用户操作接口 /【/api/userinfo/userInfo 修改用户信息】<点击修改按钮，先走个人详情接口，点击浮层的保存再走这个接口>
export function modifyPersonalDataInn(data) {
    return request({
        url:'api/userinfo/userInfo',
        method: 'put',
        data:data
    })
}
// 用户操作接口 /【/api/userinfo/resetPwd 重置密码】<点击重置密码>
export function resetPwdDataInn(data) {
    return request({
        url:'api/userinfo/resetPwd',
        method: 'put',
        params:data
    })
}
// 用户操作接口 /【/api/userinfo/userInfoLock 用户锁定】<点击锁定按钮>
export function lockPwdDataInn(data) {
    return request({
        url:'api/userinfo/userInfoLock',
        method: 'put',
        params:data
    })
}
// 用户操作接口 /【/api/userinfo/userInfoUnLock 用户解锁】<点击解锁按钮>
export function unlockPwdDataInn(data) {
    return request({
        url:'api/userinfo/userInfoUnLock',
        method: 'put',
        params:data
    })
}

// 人员页面的配置接口，这个会比较麻烦，先走
// 1、get方式   角色操作接口 /【/api/roleInfo/roleInfoAll 分页查询角色信息】
//2、GET   角色操作接口/【/api/userinfo/userInfo 查询用户详情信息】 记录下哪些打勾，哪些不打勾
//3、PUT   角色操作接口/【/api/userinfo/setUserRole 设置人员角色及批量设置人员角色】
export function disposeRoleDataInn1(data) {
    return request({
        url:'api/roleInfo/roleInfoAll',
        method: 'get',
        params:data
    })
}
export function disposeRoleDataInn2(data) {
    return request({
        url:'api/userinfo/userInfo',
        method: 'get',
        params:data
    })
}
//还可以这么干？？直接把data写在后面就是真正的串的形式
export function disposeRoleDataInn3(data) {
    return request({
        url:'api/userinfo/setUserRole?'+data,
        method: 'put'
    })
}
// 人员页面的接口总结


// 权限页面接口总结

//权限操作接口/  GET  【/api/authorityInfo/authorityInfoAll  分页查询权限信息】<点击权限页面的配置按钮，第一步接口>
export function getPowerDataInn1(data) {
    return request({
        url:'api/authorityInfo/authorityInfoAll',
        method: 'get',
        params:data
    })
}

//角色操作接口  POST  【/api/roleInfo/roleInfo   保存角色信息】<权限页面，左上角添加角色按钮的确定按钮>
export function addRoleInn(data) {
    return request({
        url:'/api/roleInfo/roleInfo',
        method: 'post',
        params:data
    })
}
// 角色操作接口  GET【/api/roleInfo/roleInfo  查询角色详情信息】<点击用户名，出现个人详细信息>
export function detailRoleDataInn(data) {
    return request({
        url:'api/roleInfo/roleInfo',
        method: 'get',
        params:data
    })
}
// 角色操作接口  PUT【/api/roleInfo/roleInfo  修改角色信息】<点击修改按钮，先走个人详情接口，点击浮层的确定按钮再走这个接口>
export function modifyRoleDataInn(data) {
    return request({
        url:'api/roleInfo/roleInfo',
        method: 'put',
        data:data
    })
}
// 角色操作接口  DELETE【/api/roleInfo/roleInfo  删除角色信息】<点击权限页面的删除按钮走的接口>
export function deleteRoleDataInn(data) {
    return request({
        url:'api/roleInfo/roleInfo',
        method: 'delete',
        params:data
    })
}
// 配置权限  特殊些
// 角色操作接口  PUT【/api/roleInfo/roleInfoAuthority  配置权限】<暂时不知道哪里用>
export function getPowerDataInn3(data1,data2) {
    return request({
        url:'api/roleInfo/roleInfoAuthority?'+data2,
        method: 'put',
        data:data1
    })
}
// 权限页面接口总结完毕


// 日志页面接口总结
//日志操作接口/  get  【/api/syslog/sysLogInfoAll  分页查询软件系统日志】<刚刚进入页面日志部分走的接口，为了获取数据>
export function getJournalDataInn(data) {
    return request({
        url:'api/syslog/sysLogInfoAll',
        method: 'get',
        params:data
    })
}
// 这个接口不知道干啥用的,先写上
//日志操作接口/  POST  【/api/syslog/syslog  保存软件系统日志】<这个接口不知道干啥用的,先写上>
export function conserveJournalDataInn(data) {
    return request({
        url:'api/syslog/syslog',
        method: 'post',
        params:data
    })
}
// 日志页面接口总结完毕

// 退出登录
export function Logout(data1) {
    return request({
        url:'loginOut/loginOut',
        method: 'post',
        data:data1,
    })
}
