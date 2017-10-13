import 'proxy-polyfill';
import Promise from 'promise-polyfill';
if (typeof window !== 'undefined') {
    window.Promise = window.Promise || Promise;
}

import './clone.spec.js';
import './events.spec.js';
import './factory.spec.js';
import './keypath.spec.js';
import './merge.spec.js';
import './mixin.spec.js';
import './observable.spec.js';
import './proto.spec.js';
import './symbolic.spec.js';
import './types.spec.js';
import './url.spec.js';
