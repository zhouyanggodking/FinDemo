<template>
  <div v-if="data.length">
    <div class="row header">
      <chart-header v-if="showHeader" :title="title" :description="description"></chart-header>
      <div></div>
    </div>
    <div class="chart">
      <div :id="chartId"></div>
      <div :id="sliderId"></div>
    </div>    
  </div>
</template>

<script>
// import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import Slider from '@antv/g2-plugin-slider';
import StringHelper from '@/helpers/stringHelper';
import ChartStyleHelper from '@/helpers/chartStyleHelper';
import ChartHeader from '@/components/common/ChartHeader';

const UP_COLOR = '#f04864';
const DOWN_COLOR = '#2fc25b';

export default {
  name: 'stockChart',
  props: {
    data: {
      type: Array,
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
      chartId: StringHelper.getUniqueId(),
      candleView: null,
      barView: null,
      slider: null,
      sliderId: StringHelper.getUniqueId('slider'),

      chartData: null,
      start: '',
      end: ''
    };
  },
  computed: {
    sourceData() {
      return this.data.map(item => {
        const result = Object.assign({}, item);
        result.trend = (item.start <= item.end) ? 'UP' : 'DOWN';
        result.range = [item.start, item.end, item.max, item.min];
        return result;
      });
    }
  },
  methods: {
    getChartData() {
      if (this.start && this.end) {
        return this.sourceData.filter(obj => obj.time <= this.end && obj.time >= this.start);
      } else if (this.start) {
        return this.sourceData.filter(obj.time >= this.start);
      } else if (this.end) {
        return this.sourceData.filter(obj => obj.time <= this.end);
      }
      return this.sourceData;   
    }
  },
  mounted() {
    if (this.data.length === 0) {
      return;
    }

    this.chartData = this.getChartData();
    this.chart = new G2.Chart({
      container: this.chartId,
      forceFit: true,
      animate: false,
      padding: [10, 40, 10, 40]
    });

    this.chart.source(this.chartData, {
      time: {
        type: 'timeCat',
        nice: false,
        range: [0, 1]
      },
      volumn: {
        alias: '成交量'
      },
      start: {
        alias: '开盘价'
      },
      end: {
        alias: '收盘价'
      },
      max: {
        alias: '最高价'
      },
      min: {
        alias: '最低价'
      },
      range: {
        alias: '股票价格'
      }
    });

    this.chart.legend(false);

    // TODO: tooltip
    const candleView = this.chart.view({
      end: {
        x: 1,
        y: 0.7
      }
    });

    candleView.source(this.chartData);
    candleView.schema()
      .position('time*range')
      .color('trend', val => {
        if (val === 'UP') {
          return UP_COLOR;
        }
        return DOWN_COLOR;
      })
      .shape('candle'); // TODO: tooltip

    const barView = this.chart.view({
      start: {
        x: 0,
        y: 0.8
      }
    });
    barView.source(this.chartData, {
      volumn: {
        tickCount: 2
      }
    });
    barView.axis('time', {
      tickLine: null,
      label: null
    });
    // barView.axis('volumn', {
    //   label: {
    //     formatter: val => {
    //       return parseInt(val / 1000, 10) + 'k';
    //     }
    //   }
    // });
    barView.interval()
      .position('time*volumn')
      .color('trend', val => {
        if (val === 'UP') {
          return UP_COLOR;
        }
        return DOWN_COLOR;
      }); // TODO: tooltip

    this.chart.render();

    this.candleView = candleView;
    this.barView = barView;

    // slider
    this.slider = new Slider(Object.assign({}, ChartStyleHelper.sliderStyles, {
      container: this.sliderId,
      data: this.sourceData,
      xAxis: 'time',
      yAxis: 'value',
      scales: {
        time: {
          type: 'timeCat',
          nice: false
        }
      },
      onChange: (opt) => {
        this.start = opt.startText;
        this.end = opt.endText;
        this.chartData = this.getChartData();
        // this.chart.changeData(this.chartData);
        this.candleView.changeData(this.chartData);
        this.barView.changeData(this.chartData);
      }
    }));
    this.slider.render();
  },
  components: {
    ChartHeader
  }
};
</script>
