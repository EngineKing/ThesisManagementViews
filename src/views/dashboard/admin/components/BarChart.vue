<template>
  <div id="bar" :style="{height:height,width:width}" />
</template>
<script>
var echarts = require('echarts')
const animationDuration = 6000
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
      this.chart = echarts.init(document.getElementById('bar'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['一附属学院', '二附属学院', '三附属学院', '四附属学院'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '通过',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [140, 146, 138, 137],
          animationDuration
        }, {
          name: '不通过',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [24, 27, 25, 19],
          animationDuration
        }]
      })
    }
  }
}
</script>
