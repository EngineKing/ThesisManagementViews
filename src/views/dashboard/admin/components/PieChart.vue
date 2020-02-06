<template>
  <div id="pie" :style="{height:height,width:width}" />
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
      this.chart = echarts.init(document.getElementById('pie'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        // title: {
        //   text: '答辩通过率',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: [
            '临床第一附属学院',
            '临床第二附属学院',
            '临床第三附属学院',
            '临床第四附属学院'
          ]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
            // dataView: { show: true, readOnly: false }
            // magicType: {
            //   show: true,
            //   type: ['pie', 'funnel']
            // },
            // restore: { show: true },
            // saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '通过率',
            type: 'pie',
            radius: [20, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { value: 15, name: '临床第一附属学院' },
              { value: 10, name: '临床第二附属学院' },
              { value: 15, name: '临床第三附属学院' },
              { value: 20, name: '临床第四附属学院' }
            ]
          }
        ]
      })
    }
  }
}
</script>
