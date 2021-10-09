# CODESMITHS SHANGHAI WECHAT MINI PROGRAM REQUESTS HELPERS - USER GUIDE

## Helper Functions

### HTTP Requests

* get(path, data = {})
* post(path, data = {})
* put(path, data = {})
* del(path, data = {})

### Other

* getHost()
* getHeader()

## Installation

Using npm:

```bash
npm i @codesmiths/mp-requests
```

## Configuration

Before using the request functions, make sure your /env/server.js is configured the correct way.

* The environment (`env`) is defined based on Mini Program envVersion.
* `getHost` function constructs the host url based on `structure` defined in server.js. Origin is one of the root urls based on your defined `env`. Other elements you pass in the structure array corresponds with the `key` you export.
* Request functions uses `getHost` function and append it with the `path` you pass as param.

```javascript
// const dev = true;
let env;

const { envVersion } = wx.getAccountInfoSync().miniProgram;
if (envVersion === 'release') env = 'prod';
if (envVersion === 'trial') env = 'stag';
if (envVersion === 'develop') env = dev ? 'dev' : 'stag';

module.exports = {
  lang: 'en',
  api: 'api/v1',
  env,
  root: {
    dev: 'http://localhost:3000',
    stag: 'https://www.stagingurl.com',
    prod: 'https://wwww.productionurl.com',
  },
  structure: ['origin', 'api', 'lang'],
};

// getHost() in prod env will return the following url:
// https://wwww.productionurl.com/api/v1/en/
```

### Headers

Headers need to be stored in Mini Program Storage.

```javascript
wx.setStorage({ key: 'header', data: 'headerData' })
```

All request functions use the header in the  Mini Program storage.

You can also get the header directly fron the storage with

```javascript
getHeader()
```

## Example

### Request Functions

All request functions accept 2 params `(path, {someData: {}})`

path is the

```javascript
import http from '@codesmiths/mp-requests';

http.get('restaurants')
  .then((res) => {
    console.log(res)
  });

http.post('contact-us', { email: 'hello@codesmiths.co' })
  .then((res) => {
    console.log(res)
  });

http.put('address', { address: '上海市巨鹿路' })
  .then((res) => {
    console.log(res)
  });

http.del('restaurant/1')
  .then((res) => {
    console.log(res)
  });

```
