'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import gravatar from 'gravatar'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
if (env === 'test') {
}

const hash = HttpHash()

hash.set('POST /test', async function test (req, res, params) {
  let trap = await json(req)
  //console.log("[API] save User", trap)
  var dataRSP = {
    from: 'test',
    at: new Date().toISOString(),
  }
  send(res, 201, dataRSP)
})

export default async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
