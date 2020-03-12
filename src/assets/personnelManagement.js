import request  from './request'
export function listInfo(query){
    return request({
        // api/userinfo/userInfoAll?pageNo=1&pageSize=10
        url:'api/userinfo/userInfoAll',
        method: 'get',
        params:query,
        //     {
        //     }
    })
}