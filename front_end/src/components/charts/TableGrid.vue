<template>
  <div :class="{'grid-container': true, 'no-header': !showHeader}">
    <div class="row header">
      <div><chart-header class="chart-header" v-if="showHeader && title" :title="title" :description="description"></chart-header></div>      
      <el-button class="export" @click="exportToExcel">
        <div class="export-icon"></div>
        <div class="export-text">导出数据</div>
      </el-button>
    </div>    
    <el-table ref="grid" 
      class="grid" :data="tableData" @sort-change="onSortChange" :row-class-name="getRowHighlightClass" :empty-text="emptyText"
      stripe border style="width: 100%;">
      <el-table-column v-if="tableHeader && tableHeader.length > 0"
        type="index"
        :index="calcIndex"
        width="50"
        label="行号"
        fixed
        class-name="row-num-column">
      </el-table-column>
      <el-table-column
        v-for="(col, index) in tableHeader"
        :prop="col.key"
        :label="getColTitle(col)"
        :key="index"
        :render-header="renderHeader"
        show-overflow-tooltip
        :min-width="calMinWidth(col.title)"
        :fixed = "isColFixed(col.title)"
        :align="col.type === 'number' ? 'right': 'left'"
        :class-name="getColClassName(col)"
        sortable>
        <template slot-scope="scope">
          <span v-html="formatCell(scope.row, col)"></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="row pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      <div v-if="description" class="data-source">数据来源：{{description}}</div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import ChartHeader from '@/components/common/ChartHeader';
import DisplayOptionHelper from '@/helpers/displayOptionHelper';

const PAGE_SIZE = 50;

export default {
  name: 'tableGrid',
  data() {
    return {
      currentPage: 1,
      emptyText: '没有符合条件的数据',
      sortStatus: {},
      pageSize: PAGE_SIZE,
      pageSizes: [PAGE_SIZE, 2 * PAGE_SIZE, 3 * PAGE_SIZE, 4 * PAGE_SIZE],
      tableDataSet: [],
      tableData: []
    };
  },
  props: {
    data: {
      type: Object
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
  computed: {
    calcIndex() {
      return ((this.currentPage - 1) * this.pageSize) + 1;
    },
    tableHeader() {
      return this.data.header || [];
    },
    totalCount() {
      return this.tableDataSet.length;
    }
  },
  methods: {
    calMinWidth(title) {
      let pureTitle = '';
      let datePart = '';
      const dateMatch = title.match(/\(\d{4}\d{2}\d{2}\)/) || title.match(/\(\d{4}-\d{2}-\d{2}\)/);
      if (dateMatch) {
        pureTitle = title.slice(0, dateMatch.index);
        datePart = dateMatch[0];
      } else {
        pureTitle = title;
      }
      switch (pureTitle) {
        case '公司代码':
        case '公司名称':
          return 110;
        case '收盘价': // has date
        case '滚动市盈率':
          return 150;
        case '所属行业':
          return 250;
        case '上榜原因': 
          return '400';
        default:
          break;
      }
      const titleLength = Math.max((pureTitle.length * 16) + 36, 110);
      const dateLength = Math.max((datePart.length * 12) + 36, 110);
      return Math.max(titleLength, dateLength);
    },
    cloneTableBody() {
      if (this.data.body) {
        return JSON.parse(JSON.stringify(this.data.body));
      } 
      return [];
    },
    doPaging() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = this.currentPage * this.pageSize;
      this.tableData = this.tableDataSet.slice(startIndex, endIndex);
    },
    exportToExcel() {
      const header = this.tableHeader.map(col => col.key);
      const headerObj = {};
      const altHeader = {};
      this.tableHeader.forEach(col => {
        altHeader[col.key] = this.getColTitle(col);
        headerObj[col.key] = col;
      });     

      // handle body format
      const tableDataToExcel = this.tableDataSet.map(row => {
        const rowToExcel = {};
        Object.keys(row).forEach(colKey => {
          rowToExcel[colKey] = this.formatCell(row, headerObj[colKey]);
        });
        return rowToExcel;
      });
      // handle sort status // should do this before body format?
      if (this.sortStatus.order) {
        const key = this.sortStatus.prop;
        if (this.sortStatus.order === 'ascending') {
          tableDataToExcel.sort((row1, row2) => {
            if (row1[key] > row2[key]) {
              return 1;
            } else if (row1[key] < row2[key]) {
              return -1;
            }
            return 0;
          });
        } else { // descending
          tableDataToExcel.sort((row1, row2) => {
            if (row1[key] > row2[key]) {
              return -1;
            } else if (row1[key] < row2[key]) {
              return 1;
            }
            return 0;
          });
        }
      }

      // handle header format
      tableDataToExcel.unshift(altHeader);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(tableDataToExcel, 
        {
          header,
          skipHeader: true
        }
      );
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
      try {
        const fileName = this.title || 'download';
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } catch (e) {
        throw e;
      }
    },
    formatCell(row, col) {
      let cellValue = row[col.key];
      if (col.type === 'number') {
        const displayOptions = col.displayOptions;
        const scaledValue = DisplayOptionHelper.transform(row[col.key], displayOptions);
        if (scaledValue !== undefined && scaledValue !== '') {
          const unit = DisplayOptionHelper.getUnit(displayOptions);
          cellValue = `${scaledValue}${unit}`;
        } else {
          cellValue = undefined;
        }
      }
      return cellValue;
    },
    getColClassName(col) {
      let className = 'grid-column';
      if (col.highlight) {
        className += ' highlight-column';
      }
      return className;
    },
    getColTitle(col) {
      // let title = col.title;
      // const displayOptions = col.displayOptions;
      // if (col.type === 'number' && displayOptions && displayOptions.unit) {
      //   if (displayOptions && displayOptions.unit !== 'percent') {
      //     title = `${title} (${displayOptions.unit})`;
      //   }        
      // }
      return col.title;
    },
    getRowHighlightClass({ row }) {
      if (row['highlight-row']) {
        return 'highlight-row';
      }
      return '';
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.doPaging();
    },
    handleCurrentChange(currPage) {
      this.currentPage = currPage;
      this.doPaging();
    },
    isColFixed(title) {
      if (title === '股票代码' || title === '公司简称') {
        return true;
      }
      return false;
    },
    onSortChange(sortStatus) {
      this.sortStatus = sortStatus;
      this.tableDataSet = this.sortTableData();
      this.doPaging();
    },
    renderHeader(h, header) {
      const dateMatch = header.column.label.match(/\(.*\d{4}\d{2}\d{2}.*\)/) || header.column.label.match(/\(.*\d{4}-\d{2}-\d{2}.*\)/);
      if (dateMatch) {
        const title = header.column.label.slice(0, dateMatch.index);
        return h('div', {
          attrs: {
            class: 'has-date',
            title: header.column.label
          }
        }, [
          h('div', {}, title),
          h('div', {}, dateMatch[0])
        ]);
      }
      return h('div', {
        attrs: {
          title: header.column.label
        }
      }, header.column.label);
    },
    sortTableData() {
      if (this.sortStatus.order) {
        const key = this.sortStatus.prop;
        if (this.sortStatus.order === 'ascending') {
          this.tableDataSet.sort((row1, row2) => {
            if (row1[key] > row2[key]) {
              return 1;
            } else if (row1[key] < row2[key]) {
              return -1;
            }
            return 0;
          });
        } else { // descending
          this.tableDataSet.sort((row1, row2) => {
            if (row1[key] > row2[key]) {
              return -1;
            } else if (row1[key] < row2[key]) {
              return 1;
            }
            return 0;
          });
        }
        return this.tableDataSet;
      }
      // if no sort, just return deep copy of source data body
      return this.cloneTableBody();
    }
  },
  mounted() {
    // make deep clone here
    this.tableDataSet = this.cloneTableBody();
    this.doPaging();
  },
  components: {
    ChartHeader
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

.grid-container{ 
  &:hover{
    box-shadow: 0 0.625rem 1.875rem 0 rgba(6, 94, 114, 0.1);
  }
  & /deep/ {
    .header {
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      .el-button.export{
        flex-shrink: 0;
        padding: 0 1rem;
        height: 2rem;
        background-color: $primaryColor;
        border-radius: 0.5rem;  
        @include buttonEffect;
        span{
          display: flex;
          align-items: center;
          .export-icon{
            width: 1rem;
            height: 1rem;
            background-image: url('../../assets/icons/download-icon.png');
            background-size: 100% 100%;
          }
          .export-text{
            padding-left: 0.5rem;
            color: white;
          }
        }
                  
      }
    }  

    th.grid-column{
      padding: 0;
      color: $tableHeaderTextColor;
      
      &:nth-child(odd){
        background-color: $tableHeaderBackgroundColorOdd;
      }
      &:nth-child(even){
        background-color: $tableHeaderBackgroundColorEven;
      }

      & .cell{
        display: flex;
        align-items: center;
        height: 3rem;
        padding: 0 1.75rem 0 0;
        white-space: nowrap;
        & > div{
          flex-grow: 9999;
          padding: 0 0.25rem;
          text-align: center;
          font-size: 0.875rem;
        }
        & > div.has-date{
          display: block;
          & > div{
            display: block;
            height: 1.25rem;
            text-align: center;
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
        }
        & > .caret-wrapper{
          display: block;
          position: absolute;
          flex-shrink: 0;
          top:0;
          right:0.25rem;
          width: 1.4rem;
          height: 3rem;
          & > i.sort-caret{
            display: block;
            width: 1.5rem;
            height: 1.5rem;
            border: none;
            left: 0;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 0.625rem;
            &.ascending{
              top: 0;
              background-image: url('../../assets/icons/icon-arrow-up1.png');

            }
            &.descending{
              bottom: 0;
              background-image: url('../../assets/icons/icon-arrow-down1.png');
            }
          }
        }
      }

      &.ascending .cell .ascending{
        background-image: url('../../assets/icons/icon-arrow-up2.png') !important;
      }

      &.descending .cell .descending{
        background-image: url('../../assets/icons/icon-arrow-down2.png') !important;
      }
    }
    th.row-num-column{
      color: $tableHeaderTextColor;
      background-color: #b5c6ce;
      .cell{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    th.gutter{
      width: 0.625rem !important;
      background-color: $gutterBackgroundColor;
    }
    tr.el-table__row{
      background-color:$tableRowDefaultBackgroundColor;
    }
    tr.el-table__row.highlight-row{
      background-color: $tableColHighlightColor;
    }
    tr.el-table__row.el-table__row--striped td{
      background-color: $tableCellStripedBackgroundColor;
      &.highlight-column{
        background-color: $tableColStrippedHighlightColor;
      }
    } 
    tr.el-table__row.el-table__row--striped.highlight-row td{
      background-color:$tableColStrippedHighlightColor;
    } 
    tr.el-table__row.hover-row td{
      background-color:$tableRowHoverBackgroundColor !important;
    }
    td.grid-column{
      height: 2.5rem;
      font-size: 0.875rem;
      color: $primaryTextColor;
      border-bottom: none;

      &.highlight-column{
        background-color: $tableColHighlightColor;
      }
    }
    .el-table--border {
      th {
        border-right: 0.125rem solid $tableHeaderBackgroundColorEven;
        border-bottom: none;
      }
      td {
        border-right: 0.125rem solid $tableCellStripedBackgroundColor;
      }
    }
    .el-table td{
      padding: 0.375rem 0 !important;
    }
    
    .el-table__empty-block{
      min-height: 10rem;
      font-weight: bold !important;
      font-size: 2rem;
      .el-table__empty-text {
        display: block;
        color: $primaryTextColor
      }
    }
  }

  .grid{
    margin-top: -0.0625rem;
    border: solid 0.0625rem white; 
    border-radius: 0 0.5rem 0 0;    
  }

  &.no-header .grid{
    border-radius: 0.5rem 0.5rem 0 0;  
  }

  .pager{
    justify-content: space-between;
    margin-top: -0.0625rem;
    padding: 0.25rem;
    background-color: $secondaryBackgroundColor;
    border-radius: 0 0 0.5rem 0.5rem;
    border: solid 0.0625rem white; 
    & /deep/ {
      .el-pagination{
        .el-pagination__total, .el-select input, .el-pagination__jump, .el-pagination__jump input{
          font-weight: bold;
          color: $primaryTextColor;
        }
        .el-select{
          margin-top: -0.0625rem;
        }
        .el-pager li{
          margin: 0 0.125rem;
          border: solid 0.0625rem #ffffff;
          border-radius: 0.25rem;
          background-color: $secondaryBackgroundColor;
          &.active{
            background-color: #ffffff;
          }
        }
        .el-input__inner{
          border: 0.0625rem solid white;
          &:focus{
            border: 0.0625rem solid $primaryColor;
          }
        }
        .btn-prev, .btn-next {
          border: solid 0.0625rem #ffffff;
          background-color: $secondaryBackgroundColor;
        }
      }
    }

    .data-source {
      padding: 0 1rem;
      line-height: 2rem;
    }
  }
}
</style>
