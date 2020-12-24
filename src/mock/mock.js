import Mock from 'mockjs'
import userInfo from '../../public/userInfo'
import bxdList from '../../public/bxdList.json'
import bxdDetail from '../../public/bxdDetail.json'

const Random = Mock.Random
const users = userInfo.users;
const expList = bxdList.expsense;
const expDetail = bxdDetail.detail;


function isInArray(key, value, array) {

    if (!key || array.length === 0) {
        alert('id或value或array不能为空');
        return
    }

    let isExistedIndex;

    array.forEach((item, index) => {
        if (item[key] == value) {
            isExistedIndex = index;
        }
    })

    return isExistedIndex
}

// mock需要给三个参数,url(与axios请求是传的url一致,我这个是本地启动的项目就直接用本地域名了)
// 请求类型: get post...其他看文档
// 数据处理函数,函数需要return数据

Mock.mock('http://localhost:8080/login/login', 'get', (res) => {
    const body = JSON.parse(res['body']);
    let status;
    let msg;
    let userName;
    users.forEach(item => {
        if (item['code'] === body['userName'] && item['pwd'] === body['pwd']) {
            status = true;
            userName = item['code'];
        }
    })
    if (status) {
        msg = {
            statusCode: 200,
            msg: 'success',
            sessionId: Random.uuid(),
            userName: userName

        }
    } else {
        msg = {
            statusCode: 200,
            msg: 'fail',
            sessionId: '',
            userName: ''
        }
    }
    return msg;
})


Mock.mock('http://localhost:8080/fybxd/save', 'get', (res) => {

    let filters;
    let msg;
    let isExisted;
    let isSubExited;

    if (res && res['body']) {
        filters = res['body'];
    }

    if (!!filters) {
        const objectFilter = JSON.parse(filters);

        expList.forEach((item, index) => {
            if (item['id'] === objectFilter['id']) {
                expList[index] = objectFilter;
                isExisted = true;
            }
        })

        if (!isExisted) {
            expList.push(objectFilter);
        }

        objectFilter.bxdDetail.forEach(item => {
            let index = isInArray('id', item['id'], expDetail);
            if (index !== undefined) {
                expDetail[index] = item;
            } else {
                expDetail.unshift(item);
            }
        })


        // expList = expList.slice(0);
        msg = {
            statusCode: 200,
            msg: 'success',
            content: 'success',
            id: objectFilter['id']
        }

    } else {
        msg = {
            statusCode: 200,
            msg: 'success',
            content: 'no changed data'
        }
    }

    return msg;

})

Mock.mock('http://localhost:8080/fybxd/add', 'get', (res) => {
    const id = Random.uuid();
    const date = new Date();
    let randValue = '';
    let i;
    const charactors = "1234567890"
    for (let j = 1; j <= 4; j++) {
        i = parseInt(10 * Math.random());
        randValue = randValue + charactors.charAt(i);
    }
    const code = "FYBXD" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + randValue;

    let msg;

    msg = {
        statusCode: 200,
        msg: 'success',
        content: {
            id: id,
            billCode: code
        },
        id: id
    }

    return msg;
})

Mock.mock('http://localhost:8080/fybxd/delete', 'get', (res) => {
    let filters;
    if (res && res['body']) {
        filters = res['body'];
    }

    let msg;
    let isExisted;

    if (!!filters) {
        const objectFilter = JSON.parse(filters);
        expList.forEach((item, index) => {
            if (item.id === objectFilter.id) {
                expList.splice(index, 1);
                isExisted = true
            }
        })
        msg = {
            statusCode: 200,
            msg: isExisted === true ? 'success' : 'fail',
            content: expList,
        }
    } else {
        msg = {
            statusCode: 200,
            msg: 'fail',
            content: expList,
        }
    }
    return msg;
})

Mock.mock('http://localhost:8080/fybxd/list', 'get', (res) => {
    let filters;
    if (res && res['body']) {
        filters = res['body'];
    }

    let msg;

    if (!!filters) {
        const objectFilter = JSON.parse(filters);
        const newExpList = expList.filter(item => {
            return JSON.stringify(Object.assign({}, item, objectFilter)) === JSON.stringify(item)
        })
        msg = {
            statusCode: 200,
            msg: 'success',
            content: newExpList,
        }

    } else {
        msg = {
            statusCode: 200,
            msg: 'success',
            content: expList,
        }
    }

    return msg;
})

Mock.mock('http://localhost:8080/fybxd/detail', 'get', (res) => {
    let filters;
    let msg;
    let main;
    if (res && res['body']) {
        filters = JSON.parse(res['body']);
    } else {
        return {
            statusCode: 200,
            msg: 'fail',
            content: null,
        }
    }

    expList.forEach(item => {
        if (item['id'] === filters['id']) {
            main = item;
        }
    })

    main.bxdDetail = [];

    expDetail.forEach(item => {
        if (item['pid'] === filters['id']) {
            main.bxdDetail.push(item);
        }

    })

    return {
        statusCode: 200,
        msg: 'success',
        content: main,
    };
})


Mock.mock('http://localhost:8080/test/city', 'get', () => {
    let citys = []
    for (let i = 0; i < 10; i++) {
        let obj = {
            id: i + 1,
            city: Random.city(),
            color: Random.color()
        }
        citys.push(obj)
    }
    return { cityList: citys }
})
// post请求,带参数,参数会在data中返回,会返回url,type,body三个参数,可以把data打印出来看看
Mock.mock('http://localhost:8080/test/cityInfo', 'post', (data) => {
    // 请求传过来的参数在body中,传回的是json字符串,需要转义一下
    const info = JSON.parse(data.body)
    return {
        img: Random.image('200x100', '#4A7BF7', info.name)
    }
})