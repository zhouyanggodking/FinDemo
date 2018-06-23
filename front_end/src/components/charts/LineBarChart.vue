<template>
  <div class="line-bar-chart-container">
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
import G2 from '@antv/g2';
import StringHelper from '@/helpers/stringHelper';
import Slider from '@antv/g2-plugin-slider';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartHeader from '@/components/common/ChartHeader';

const MAX_DATA_LENGTH_TO_SHOW_POINT = 100;

export default {
  name: 'lineBarChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    description: {
      type: String
    },
    height: {
      type: Number,
      default: 400
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
      chartData: null, // should maintain it manually
      chartId: StringHelper.getUniqueId(),
      sliderId: StringHelper.getUniqueId('slider'),
      silder: null
    };
  },
  computed: {
    sourceData() {
      return this.data.fields.map(item => {
        return {
          time: item,
          bar: this.data.series.bar[item],
          line: this.data.series.line[item]
        };
      });
    }
  },
  methods: {
    generateChart() {
      if (this.start || this.end) {
        this.chartData = this.getChartData();
      } else {
        this.chartData = this.sourceData;
      }
      this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        animate: false,
        padding: [30, 80, 50, 90],
        height: this.height
      });

      this.chart.source(this.chartData);

      const barDisplayOptions = this.data.series.bar.displayOptions;
      const lineDisplayOptions = this.data.series.line.displayOptions;

      const BAR_PRIMARY_COLOR = '#65c8e4';
      const LINE_PRIMARY_COLOR = '#ecb4a3';
      const GRID_LINE_OPACITY = 0.4;

      const barChartAxisStyle = {
        line: {
          stroke: BAR_PRIMARY_COLOR
        },
        grid: {
          lineStyle: {
            stroke: BAR_PRIMARY_COLOR,
            opacity: GRID_LINE_OPACITY
          }
        },
        title: {
          offset: 70,
          textStyle: {
            textAlign: 'center',
            fill: BAR_PRIMARY_COLOR,
            fontSize: '14'
          }
        }
      };

      const lineChartAxisStyle = {
        line: {
          stroke: LINE_PRIMARY_COLOR
        },
        grid: {
          lineStyle: {
            stroke: LINE_PRIMARY_COLOR,
            opacity: GRID_LINE_OPACITY
          }
        },
        title: {
          offset: 60,
          textStyle: {
            fill: LINE_PRIMARY_COLOR,
            fontSize: '14'
          }
        }
      };

      this.chart.axis('time', ChartStyleHelper.xAxisStyleConfig);
      this.chart.axis('bar', Object.assign({}, ChartStyleHelper.yAxisStyleConfig, barChartAxisStyle));
      this.chart.axis('line', Object.assign({}, ChartStyleHelper.yAxisStyleConfig, lineChartAxisStyle));// TODO: show title

      this.chart.tooltip(Object.assign({}, ChartStyleHelper.tooltipConfig, {
        crosshairs: {
          type: 'line',
          style: {
            stroke: '#45a8cc'
          }
        }
      }));

      this.chart.scale({
        time: {
          nice: false,
          type: 'cat',
          tickCount: 5
        },
        bar: {
          nice: true,
          alias: this.data.series.bar.name,
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, barDisplayOptions);
          }
        },
        line: {
          nice: true,
          alias: this.data.series.line.name,
          formatter: val => {
            return ChartStyleHelper.processDisplayOptions(val, lineDisplayOptions);
          }
        }
      });

      this.chart.interval()
        .position('time*bar')
        .color([
          'l(270) 0:#99eef5 1:#65c8e4'
        ]);

      this.chart.line()
        .position('time*line')
        .color(LINE_PRIMARY_COLOR)
        .size(4);

      this.chartPoints = this.chart.point()
        .position('time*line')
        .color(LINE_PRIMARY_COLOR)
        .size(10)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 2
        });
      this.hideShowPoints();
      this.chart.render();

      this.chart.on('tooltip:change', (ev) => {
        const items = ev.items; // tooltip items
        items.forEach((item) => {
          if (item.color.length > 7) { // for linear gradient
            item.color = item.color.substr(19);
          }
        });
      });
    },
    generateSlider() {
      if (this.showSlider) {
        // generate slider
        this.slider = new Slider(Object.assign({}, ChartStyleHelper.sliderStyles, {
          container: this.sliderId,
          data: this.sourceData,
          padding: 80,
          xAxis: 'time',
          yAxis: 'line',
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
      if (this.sourceData && this.sourceData.length) {
        return this.sourceData.filter(obj => obj.time <= this.end && obj.time >= this.start);
      }
      return [];
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
    if (!this.data || !this.data.series || !this.data.series.bar || !this.data.series.line) {
      return;
    }
    this.generateChart();
    if (this.showSlider) {
      this.generateSlider();
    }
  },
  components: {
    ChartHeader
  }
};
</script>

<style lang="scss" scoped>
.slider-area {
  padding: 1.5rem;
}
</style>

