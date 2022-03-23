import { getHost, getHeader } from './helpers';

function request({ path, method = 'GET', data = {} }) {
  const url = /http/.test(path) ? path : getHost() + path;

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: getHeader(),
      success: resolve,
      fail: reject,
    });
  });
}

function post(path, data = {}) {
  return request({ path, data, method: 'POST' });
}

function put(path, data = {}) {
  return request({ path, data, method: 'PUT' });
}

function del(path, data = {}) {
  return request({ path, data, method: 'DELETE' });
}

function setGetParams(data) {
  const params = [];
  let path = '';
  Object.keys(data).forEach((k) => params.push(`${k}=${data[k]}`));
  if (params.length) path += '?';
  path += params.join('&');
  return path;
}

function get(path, data = {}) {
  let url = path;
  if (Object.keys(data).length) url += setGetParams(data);
  return request({ path: url });
}

module.exports = {
  request, post, del, get, put,
};
