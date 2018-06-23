import axios from 'axios';

export default class FinDataQuery {
  static getTopLatestList() {
    return axios.get('/api/top-list');
  }
}
