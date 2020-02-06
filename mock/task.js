import Mock from 'mockjs'

export default [
  {
    url: '/task/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 8,
          'items|8': [{
            description: '@title(5, 10)',
            title: '@title(5, 10)',
            timestamp: +Mock.Random.date('T'),
            begin_time: '@datetime',
            end_time: '@datetime',
            result_end_time: '@datetime',
            'is_pass|1': ['是', '进行中', '否'],
            'type|1': ['毕业设计任务', '开题报告任务', '论文预答辩任务', '论文答辩任务']
          }]
        }
      }
    }
  }
]
