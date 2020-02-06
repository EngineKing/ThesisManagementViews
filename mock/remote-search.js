import Mock from 'mockjs'

export default [
  // transaction list
  {
    url: '/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            task_name: '@guid()',
            timestamp: +Mock.Random.date('T'),
            username: '@name()',
            end_time: '@datetime',
            'status|1': ['yes', 'no']
          }]
        }
      }
    }
  }
]
