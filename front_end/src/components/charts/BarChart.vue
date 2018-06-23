<template>
  <div class="bar-chart-container">
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
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartHeader from '@/components/common/ChartHeader';

export default {
  name: 'barChart',
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
        });
        const data = dv.rows;
        return data;
      }
      return [];
    }
  },
  methods: {
    generateChart() {
      this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        padding: [30, 60, 120, 90],
        height: 400
      });

      this.chart.source(this.chartData);
      const displayOptions = this.data.displayOptions;
      this.chart.axis('key', ChartStyleHelper.xAxisStyleConfig);
      this.chart.axis('value', ChartStyleHelper.yAxisStyleConfig);

      this.chart.tooltip(ChartStyleHelper.tooltipConfig);
      this.chart.legend({
        useHtml: true,
        containerTpl: '<div class="g2-legend"><table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></table></div>',
        itemTpl: (value, color, checked, index) => {
          color = color.indexOf('l(270)') > -1 ? color.substr(19) : color;
          checked = checked ? 'checked' : 'unChecked';
          return `<tr class="g2-legend-list-item item-${index} ${checked}" data-value="${value}" data-color=${color} style="cursor: pointer;font-size: 0.875rem;">
            <td style="border: none;padding:0;"><i class="g2-legend-marker" style="background-color:${color};"></i><span class="g2-legend-text" style="font-size: 0.875rem; font-weight: bold">${value}</span></td></tr>`;
        },
        'g2-legend': {
          display: 'flex',
          'justify-content': 'center',
          overflow: 'auto',
          maxHeight: '5rem',
          marginTop: '-1rem',
          padding: '0 0 0 2rem',
          fontFamily: "'Tahoma', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'"
        },
        'g2-legend-marker': {
          display: 'inline-block',
          marginRight: '0.625rem',
          width: '1.5rem',
          height: '0.25rem',
          borderRadius: '0.125rem'
        },
        'g2-legend-list': {
          padding: [0, '1rem']
        }
      });

      this.chart.scale({
        key: {
          type: 'cat'
        },
        value: {
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, displayOptions);
          }
        }
      });

      this.chart.interval()
        .position('key*value')
        .color('name', [
          'l(270) 0:#ffd2b2 1:#eea18f',
          'l(270) 0:#99eef5 1:#65c8e4',
          'l(270) 0:#ffeba4 1:#f5c076',
          'l(270) 0:#9ddfff 1:#7db4ff',
          'l(270) 0:#f7d0e4 1:#e197f9',
          'l(270) 0:#b6d9fb 1:#a497f9'
        ])
        .adjust([{
          type: 'dodge'
        }]);
      this.chart.render();
      this.chart.on('tooltip:change', (ev) => {
        const items = ev.items; // tooltip items
        items.forEach((item) => {
          if (item.color.length > 7) { // for linear gradient
            item.color = item.color.substr(19);
          }
        });
      });
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

<style lang="scss" scoped>

</style>

