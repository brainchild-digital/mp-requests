import { getHost, getHeader } from './helpers';

function getUrl(path) {
  return /http/.test(path) ? path : getHost() + path;
}

function request({ path, method = 'GET', data = {}, header = getHeader() }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(path),
      method,
      data,
      header,
      success: resolve,
      fail: reject,
    });
  });
}

function post(path, data = {}, header) {
  const options = { path, data, method: 'POST' };
  if (header) options.header = header;
  return request(options);
}

function put(path, data = {}, header) {
  const options = { path, data, method: 'PUT' };
  if (header) options.header = header;
  return request(options);
}

function del(path, data = {}, header) {
  const options = { path, data, method: 'DELETE' };
  if (header) options.header = header;
  return request(options);
}

function uploadFile(path, fileData = {}, formData = {}) {
  // if no formData, fileData.key must have root[key] format.
  // if has formData, fileData.key is just the key

  const header = getHeader();

  Object.keys(formData).forEach((k) => {
    formData[k] = JSON.stringify(formData[k]);
  });

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: getUrl(path), header, filePath: fileData.path, name: fileData.key, formData,
      success(res) {
        res.data = JSON.parse(res.data);
        resolve(res);
      },
      fail: reject,
    });
  });
}

function uploadFiles(path, data) {
  // multiple files upload only supports updating of a record. Doesn't support creation of record.

  const that = this;
  return new Promise((resolve, reject) => {
    if (!data.files || !data.files.length) return reject(new Error('data.files is empty'));

    const upload = (files, successUp, failUp, count, length) => {
      // wx.showLoading({ title: `uploading ${count}` });
      wx.uploadFile({
        url: getUrl(path), // 仅为示例，非真实的接口地址
        header: getHeader(),
        filePath: data.files[count],
        name: data.key, // 示例，使用顺序给文件命名
        success() { successUp += 1; }, // 成功+1,
        fail() { failUp += 1; }, // 失败+1
        complete(res) {
          count += 1; // 下一张
          if (count === length) {
            // 上传完毕，作一下提示
            console.log(`Upload success ${successUp}, Upload fail ${failUp}`);
            // wx.showToast({ title: `Uploaded ${successUp}`, icon: 'success', duration: 2000 });
            if (res.statusCode === 200) {
              res.data = JSON.parse(res.data);
              return resolve(res);
            }
          }
          // 递归调用，上传下一张
          upload(data.files, successUp, failUp, count, length);
        },
      });
    };

    const successUp = 0; // 成功
    const failUp = 0; // 失败
    const { length } = data.files; // 总数
    const count = 0; // 第几张

    upload(data.files, successUp, failUp, count, length);
  });
}

function objectToQueryString(obj) {
  let path = '';
  let str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        // Handle array values
        obj[p].forEach((val, i) => {
          str.push(`${encodeURIComponent(p)}[]=${encodeURIComponent(val)}`);
          // str.push(`${encodeURIComponent(p)}[${i}]=${encodeURIComponent(val)}`);
        });
      } else if (typeof obj[p] === 'object') {
        // Handle nested objects
        for (const k in obj[p]) {
          if (obj[p].hasOwnProperty(k)) {
            str.push(`${encodeURIComponent(p)}[${encodeURIComponent(k)}]=${encodeURIComponent(obj[p][k])}`);
          }
        }
      } else {
        // Handle simple values
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
      }
    }
  }

  if (str.length) path += '?';
  path += str.join('&');

  return path;
}

function setGetParams(data) {
  const params = [];
  let path = '';
  Object.keys(data).forEach((k) => params.push(`${k}=${data[k]}`));
  if (params.length) path += '?';
  path += params.join('&');
  return path;
}

function get(path, data = {}, header) {
  let url = path;
  if (Object.keys(data).length) url += objectToQueryString(data);
  const options = { path: url };
  if (header) options.header = header;

  return request(options);
}

module.exports = {
  request, post, del, get, put, uploadFile, uploadFiles, objectToQueryString, getUrl,
};
