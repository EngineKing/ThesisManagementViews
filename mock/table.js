import Mock from 'mockjs'

const userData = Mock.mock({
  'items|10': [{
    id: '@id',
    account: '@natural',
    'gender|1': ['男', '女'],
    email: '@string' + '@gmail.com',
    phone: '15828700651',
    'department|1': ['一附属学院', '二附属学院', '三附属学院'],
    create_time: '@datetime',
    login_times: '@integer(1,30)',
    'role|1': ['学生', '导师', '学科秘书', '学院管理员'],
    pageviews: '@integer(300, 5000)'
  }]
})

const departmentData = Mock.mock({
  'items|10': [{
    id: '@id',
    departmentName: '@name()',
    description: 'This is the first clinically affiliated hospital,Major disciplines include clinical medicine, anesthesia medicine, etc.',
    'pDepartment|1': ['First_Clinical', 'Second_Clinical', 'Third_Clinical']
  }]
})

export default [
  {
    url: '/table/userList',
    type: 'get',
    response: config => {
      const items = userData.items
      return {
        code: 20000,
        userData: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/departmentList',
    type: 'get',
    response: config => {
      const items = departmentData.items
      return {
        code: 20000,
        departmentData: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
