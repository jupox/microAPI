'use strict';

import { send, json } from 'micro';
import HttpHash from 'http-hash';
import gravatar from 'gravatar';
import config from './config';
import DbStub from './test/stub/db';

var env = process.env.NODE_ENV || 'production';
if (env === 'test') {}

var hash = HttpHash();

hash.set('POST /test', async function test(req, res, params) {
  //NEED JSON Req data
  var trap = await json(req);
  //console.log("[API] save User", trap)
  var dataRSP = {
    from: 'test',
    at: new Date().toISOString()
  };
  send(res, 201, dataRSP);
});

export default (async function main(req, res) {
  var method = req.method,
      url = req.url;

  var match = hash.get(method.toUpperCase() + ' ' + url);

  if (match.handler) {
    try {
      await match.handler(req, res, match.params);
    } catch (e) {
      send(res, 500, { error: e.message });
    }
  } else {
    send(res, 404, { error: 'route not found' });
  }
});