// used to access common chart styles like axis, legend
import DisplayOptionHelper from '@/helpers/displayOptionHelper';

export default class ChartStyleHelper {
  static axisStyle = {
    stroke: 'rgba(63, 70, 71, 0.2)',
    lineWidth: 2
  }

  static axisLabelStyle = {
    textStyle: {
      fill: '#3f4647',
      fontSize: 16,
      fontWeight: 'bold'
    }
  }

  static axisGridStyle = {
    lineStyle: {
      stroke: '#e2e2e2',
      lineWidth: 2
    }
  }

  static xAxisStyleConfig = {
    label: ChartStyleHelper.axisLabelStyle,
    line: ChartStyleHelper.axisStyle,
    tickLine: {
      length: 0
    }
  }

  static yAxisStyleConfig = {
    label: ChartStyleHelper.axisLabelStyle,
    line: ChartStyleHelper.axisStyle,
    grid: ChartStyleHelper.axisGridStyle,
    tickLine: {
      lineWidth: 1,
      stroke: 'rgba(63, 70, 71, 0.2)',
      length: 6
    },
    title: {
      offset: 100
    }
  }

  static tooltipConfig = {
    showTitle: true,
    itemTpl: '<li style="color:{color}"></span>{name}: {value}</li>',
    'g2-tooltip': {
      backgroundColor: 'rgba(0, 8, 9, 0.8)'
    },
    'g2-tooltip-title': {
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#ffffff'
    },
    'g2-tooltip-list': {
      marginTop: '16px',
      fontSize: '16px'
    }
  }

  static catColors = [
    '#eea78f',
    '#81b4f8',
    '#8fddee',
    '#c1e787',
    '#eed88f',
    '#ee8f8f',
    '#e196f9',
    '#a497f9',
    '#b4c2d3',
    '#5463e4',
    '#be4c4c',
    '#62aec1'
  ]

  static legendConfig = {
    useHtml: true,
    itemTpl: (value, color, checked, index) => {
      color = color.indexOf('l(270)') > -1 ? color.substr(19) : color;
      checked = checked ? 'checked' : 'unChecked';
      return `<tr class="g2-legend-list-item item-${index} ${checked}" data-value="${value}" data-color=${color} style="cursor: pointer;font-size: 14px;">
        <td style="border: none;padding:0;"><i class="g2-legend-marker" style="background-color:${color};"></i><span class="g2-legend-text" style="font-size: 16px; font-weight: bold">${value}</span></td></tr>`;
    },
    'g2-legend-marker': {
      display: 'inline-block',
      marginRight: '10px',
      width: '24px',
      height: '14px',
      borderRadius: '7px'
    }
  }

  static sliderStyles = {
    width: 'auto',
    height: 30,
    padding: [20, 100, 20, 100],
    backgroundStyle: {
      fill: '#e4e9ec'
    },
    fillerStyle: {
      fill: '#72b2c3'
    },
    handleStyle: {
      img: '/static/handle.png',
      width: 10
    },
    textStyle: {
      fill: '#3f4647',
      fontSize: 12,
      fontWeight: 'bold'
    }
  }

  static processDisplayOptions(val, displayOptions) {
    const result = DisplayOptionHelper.transform(val, displayOptions);
    const unit = DisplayOptionHelper.getUnit(displayOptions);
    return `${result}${unit}`;
  }

  static processYAxisLabel(text, displayOptions) {
    // remove digits after decimal points
    const val = text.split('.')[0];
    return val === '0' ? val : val + DisplayOptionHelper.getUnit(displayOptions);
  }
}
