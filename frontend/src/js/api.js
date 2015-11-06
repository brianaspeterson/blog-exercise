/**
 * This is an API client.
 */

var _ = require('lodash'),
    POST_KEY_PREFIX = 'chairnerd.post',
    MAX_POST_KEY = 'chairnerd.maxPostId';

if (!window.localStorage) {
  throw new Error('You must use a browser that supports local storage.');
}

var API = {
  get: function(id) {
    var result = {
      status: 200
    };
    if (id) {
      var post = localStorage.getItem('chairnerd.post' + id);
      if (post === undefined) {
        result.status = 404;
      }
      result.body = post;
    } else {
      var postKeys = Object.keys(localStorage).filter(function(key) {
        return key.match(POST_KEY_PREFIX);
      });

      result.body = postKeys.map(function(v) {
        return localStorage.getItem(v);
      });
    }

    return result;
  },
  post: function(data) {
    var result = {
      status: 200
    };
    if (!data.title || !data.body || !_.isPlainObject(data)) {
      result.status = 400;
    } else {
      var maxId = localStorage.getItem(MAX_POST_KEY);
      var lastPostId = !maxId ? 1 : parseInt(maxId, 10) + 1;
      data.id = lastPostId;

      var stringData = JSON.stringify(data);
      localStorage.setItem(POST_KEY_PREFIX + data.id, stringData);
      localStorage.setItem(MAX_POST_KEY, lastPostId.toString());

      result.body = stringData;
    }
    return result;
  }
}


module.exports = API;
