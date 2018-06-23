import axios from 'axios';

export default class QuestionQuery {
  static getRecommendationList() {
    return axios.get('/static/mock/recommendation.json');
  }

  static getMoreQuestionList() {
    return axios.get('/static/mock/other-rec.json');
  }

  static getSearchResult(query, pageSize = 10, pageNum = 1) {
    const queryBody = {
      question: query,
      'page-size': pageSize,
      'page-number': pageNum
    };
    return axios.post('/api', queryBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static getSuggestQuestions(query, maxCount = 5) {
    const question = {
      'max-count': maxCount,
      question: query
    };
    
    return axios.post('/api/suggestion', question, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static getRecommendationQuestions(query, maxCount = 20) {
    const question = {
      'max-count': maxCount,
      question: query
    };
    
    return axios.post('/api/recommendation', question, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
