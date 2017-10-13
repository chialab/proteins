/* eslint-env node */
if (typeof global !== 'undefined') {
    global.self = global;
}

if (typeof Proxy === 'undefined') {
    require('proxy-polyfill');
}

if (typeof Promise === 'undefined') {
    self.Promise = require('promise-polyfill');
}
