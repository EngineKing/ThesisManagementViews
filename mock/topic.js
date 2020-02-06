import Mock from 'mockjs'

export default [
  {
    url: '/topic/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 10,
          'items|10': [{
            description: '@title(5, 10)',
            title: '@title(5, 10)',
            tutor: '@name()',
            timestamp: +Mock.Random.date('T'),
            create_time: '@datetime',
            optional: '@integer(2, 3)',
            selected: '@integer(1, 2)',
            'status|1': ['yes', 'no']
          }]
        }
      }
    }
  }
]
