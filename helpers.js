function getHost() {
  const { server } = getApp().globalData;
  if (server.structure) {
    const path = [server.root[server.env], ...server.structure.map((x) => (server[x]))].join('/');
    return `${path}/`;
  }
  return `${[server.root[server.env], server.api, server.lang].join('/')}/`;
}

function getHeader() {
  return wx.getStorageSync('header') || {};
}

module.exports = {
  getHost,
  getHeader,
};
