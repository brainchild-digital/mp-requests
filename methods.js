import { getHost, getHeader } from './helpers';

function getUrl(path) {
  return /http/.test(path) ? path : getHost() + path;
}

function request({ path, method = 'GET', data = {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(path),
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
  return new Promise((resolve) => {
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

  // wx.uploadFile({
  //   url: getUrl(path), header, filePath, name, formData,
  //   success(res) {
  //     if (res.statusCode === 200) res.data = JSON.parse(res.data);
  //     resolve(res);
  //   },
  //   fail: reject,
  // });
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
  request, post, del, get, put, uploadFile, uploadFiles,
};
