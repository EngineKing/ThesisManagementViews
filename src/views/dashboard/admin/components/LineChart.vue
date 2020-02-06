<template>
  <div id="line" :style="{height:height,width:width}" />
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
      this.chart = echarts.init(document.getElementById('line'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        legend: {
          data: ['网站访问量']
        },
        series: [
          {
            name: '网站访问量',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#3398DB',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: [100, 120, 161, 134, 105, 160, 166],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
