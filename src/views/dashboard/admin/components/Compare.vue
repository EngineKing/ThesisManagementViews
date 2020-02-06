<template>
  <div id="lineToCompare" :style="{height:height,width:width}" />
</template>
<script>
var echarts = require('echarts')
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(document.getElementById('lineToCompare'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: ['开题答辩', '论文预答辩', '盲评', '查重', '答辩'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        // legend: {
        //   data: ['一附属学院', '二附属学院', '三附属学院']
        // },
        series: [
          {
            name: '一附属学院',
            itemStyle: {
              normal: {
                color: '#3398DB',
                lineStyle: {
                  color: '#3398DB',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: [100, 120, 161, 134, 105],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }, {
            name: '二附属学院',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#e98f6f',
                lineStyle: {
                  color: '#e98f6f',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: [120, 82, 91, 154, 162],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }, {
            name: '三附属学院',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#6ab0b8',
                lineStyle: {
                  color: '#6ab0b8',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: [160, 160, 151, 106, 145],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }, {
            name: '四附属学院',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#6ab0b8',
                lineStyle: {
                  color: '#2f4554',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: [144, 154, 118, 142, 120],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    }
  }
}
</script>
