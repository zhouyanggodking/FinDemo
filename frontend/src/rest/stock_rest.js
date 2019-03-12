import axiso from 'axios';

export default class StockRest {
  static async getStockListBySector(sector) {
    try {
      const res = await axiso.get('/api/stock_list', {
        params: {
          sector
        }
      });
      return res.data;
    } catch {
      return [];
    }   
  }

  static async getAllStockList() {
    try {
      const res = await axiso.get('/api/stock_list');
      return res.data;
    } catch {
      return [];
    }  
  }
}
