<template>
  <div class="line-chart-container">
    <div class="row header">
      <div><chart-header v-if="showHeader && title" :title="title" :description="description"></chart-header></div>
      <div class="data-source" v-if="description">数据来源：{{description}}</div>
    </div>
    <div class="chart">
      <div :id="chartId"></div>
      <div class="slider-area" v-if="showSlider">
        <div :id="sliderId"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import StringHelper from '@/helpers/stringHelper';
import Slider from '@antv/g2-plugin-slider';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartHeader from '@/components/common/ChartHeader';

const MAX_DATA_LENGTH_TO_SHOW_POINT = 100;

export default {
  name: 'lineChart',
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
    showSlider: {
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
      chartId: StringHelper.getUniqueId(),
      chartData: null, // should maintain it manually
      chartPoints: null, // use to access points in the chart, we need to control it according to total chart points
      sliderId: StringHelper.getUniqueId('slider'),
      slider: null
    };
  },
  computed: {
    sourceData() {
      if (this.data && this.data.series) {
        const dv = new DataSet.View().source(this.data.series);
        dv.transform({
          type: 'fold',
          fields: this.data.fields,
          key: 'time',
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
      this.chartData = this.getChartData();
      let padding = [];
      if (this.data && this.data.series) {
        if (this.data.series.length <= 4) {
          padding = [20, 50, 90, 90];
        } else if (this.data.series.length <= 8) {
          padding = [20, 50, 105, 90];
        } else {
          padding = [20, 50, 120, 90];
        }
      }

      this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        animate: false,
        padding,
        height: 400
      });

      this.chart.source(this.chartData);
      const displayOptions = this.data.displayOptions;

      this.chart.axis('time', ChartStyleHelper.xAxisStyleConfig);
      this.chart.axis('value', ChartStyleHelper.yAxisStyleConfig);

      this.chart.tooltip(Object.assign({}, ChartStyleHelper.tooltipConfig, {
        crosshairs: {
          type: 'line',
          style: {
            stroke: '#45a8cc'
          }
        },
        title: 'time'
      }));
      this.chart.legend({
        useHtml: true,
        // position: 'top',
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
          padding: '0.25rem 0 0 3rem',
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
        time: {
          nice: false,
          range: [0, 1],
          type: 'cat',
          tickCount: 5
        },
        value: {
          nice: true,
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, displayOptions);
          }
        }
      });

      this.chart.line()
        .position('time*value')
        .color('name', ChartStyleHelper.catColors);
      this.chartPoints = this.chart.point()
        .position('time*value')
        .color('name', ChartStyleHelper.catColors)
        .size(4)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 2
        });
      this.hideShowPoints();

      this.chart.render();
    },
    generateSlider() {
      if (this.showSlider) {
        this.slider = new Slider(Object.assign({}, ChartStyleHelper.sliderStyles, {
          container: this.sliderId,
          data: this.sourceData,
          xAxis: 'time',
          yAxis: 'value',
          scales: {
            time: {
              type: 'cat',
              nice: false
            }
          },
          onChange: (opt) => {
            this.start = opt.startText;
            this.end = opt.endText;
            this.chartData = this.getChartData();
            this.hideShowPoints();
            this.chart.changeData(this.chartData);
          }
        }));
        this.slider.render();
      }      
    },
    getChartData() {
      if (this.start && this.end) {
        return this.sourceData.filter(obj => obj.time <= this.end && obj.time >= this.start);
      } else if (this.start) {
        return this.sourceData.filter(obj.time >= this.start);
      } else if (this.end) {
        return this.sourceData.filter(obj => obj.time <= this.end);
      }
      return this.sourceData;
    },
    hideShowPoints() { // there is bug to directly call geom.hide/show, so use change size to 0 to mimic hiding effect
      if (this.chartData) {
        if (this.chartData.length <= MAX_DATA_LENGTH_TO_SHOW_POINT) {
          this.chartPoints.size(4);
        } else {
          this.chartPoints.size(0); // mimic hiding
        }
      }
    }
  },
  mounted() {
    if (this.sourceData.length === 0) {
      return;
    }

    this.generateChart();

    // generate slider
    this.generateSlider();
  },
  components: {
    ChartHeader
  }
};
</script>

<style lang="scss" scoped>
.slider-area {
  padding: 1.25rem 2rem 1.5rem 1rem;
}
</style>

