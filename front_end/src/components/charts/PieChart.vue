<template>
  <div class="pie-chart-container">
    <div class="row header">
      <div><chart-header v-if="showHeader && title" :title="title" :description="description"></chart-header></div>
      <div class="data-source" v-if="description">数据来源：{{description}}</div>
    </div>
    <div :id="chartId" class="chart"></div>
  </div>
</template>

<script>
import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import StringHelper from '@/helpers/stringHelper';
import ChartHeader from '@/components/common/ChartHeader';
import ChartStyleHelper from '@/helpers/chartStyleHelper';

export default {
  name: 'pieChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    description: {
      type: String
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      chart: null,
      chartId: StringHelper.getUniqueId()
    };
  },
  computed: {
    chartData() {
      if (this.data && this.data.series) {
        const dv = new DataSet.View().source(this.data.series);
        dv.transform({
          type: 'fold',
          fields: this.data.fields,
          key: 'key',
          value: 'value'
        }).transform({
          type: 'percent',
          field: 'value',
          dimension: 'key',
          as: 'percent'
        });
        const data = dv.rows;
        return data;
      }
      return [];
    }
  },
  methods: {
    toPercent(number, percision = 2) {
      return `${(number * 100).toFixed(percision)}%`;
    },
    generateChart() {
      this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        height: 400,
        padding: [20, 20, 120, 20]
      });

      this.chart.source(this.chartData);
      this.chart.coord('theta', {
        radius: 1
      });

      this.chart.tooltip({
        showTitle: false,
        itemTpl: '<li style="color: {color}; font-size:1.5rem;font-weight:bold;">{name}: {value}</li>'
      });

      this.chart.scale({
        key: {
          type: 'cat'
        }
      });

      this.chart.legend({
        useHtml: true,
        position: 'bottom',
        containerTpl: '<div class="g2-legend"><table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></table></div>',
        itemTpl: (value, color, checked, index) => {
          const percent = this.toPercent(this.chartData[index].percent);
          checked = checked ? 'checked' : 'unChecked';
          return `<tr class="g2-legend-list-item item-${index} ${checked}" data-value="${value}" data-color=${color} style="cursor: pointer;font-size: 0.875rem;">'
            <td style="border: none;padding:0;" ><i class="g2-legend-marker" style="background-color:${color};"></i><span class="g2-legend-text" style="font-size: 1rem; font-weight: bold;">${value} : ${percent}</span></td>`;
        },
        'g2-legend': {
          display: 'flex',
          'justify-content': 'center',
          overflow: 'auto',
          maxHeight: '5rem',
          padding: '0 0 0 3rem',
          fontFamily: "'Tahoma', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'"
        },
        'g2-legend-marker': {
          display: 'inline-block',
          marginRight: '0.625rem',
          marginBottom: '0.20rem',
          width: '1rem',
          height: '1rem',
          borderRadius: '0.5rem'
        },
        'g2-legend-list': {
          marginLeft: '1rem',
          marginRight: '1rem'
        }
      });

      this.chart.intervalStack()
        .position('percent')
        .color('key', ChartStyleHelper.catColors)
        .label('percent', {
          formatter: (val) => this.toPercent(val),
          offset: -20,
          textStyle: {
            fill: '#f9f9f9',
            fontSize: 16,
            fontWeight: 'bold'
          }
        })
        .tooltip('key*percent', (key, val) => {
          return {
            name: key,
            value: this.toPercent(val)
          };
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        });

      this.chart.render();
    }
  },
  mounted() {
    this.generateChart();
  },
  components: {
    ChartHeader
  }
};
</script>
