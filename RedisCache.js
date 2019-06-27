const ioredis = require('ioredis');
const consola = require('consola');

class RedisCache {
  constructor(options) {
    this.isWorking = false;
    this.defaultSetOptions = {
      ttl: 300,
    };
    const client = new ioredis(options)
      .on('ready', success => {
        this.isWorking = true;
      })
      .on('error', err => {
        consola.error('ERROR:', err)
        this.isWorking = false;
      });
    this.client = client;
  }
  set(key, value, options) {
    const { ttl } = Object.assign({}, this.defaultSetOptions, options);
    return this.client
      .set(key, value, 'EX', ttl)
      .catch(err => {
        consola.error(err);
      });
  }
  get(key) {
    if (!this.isWorking) return false;
    return this.client
      .get(key)
      .catch(err => {
        consola.error(err);
      });
  }
  delete(key) {
    if (!this.isWorking) return false;
    return this.client
      .del(key)
      .catch(err => {
        consola.error(err);
      });
  }
  flush() {
    if (!this.isWorking) return false;
    return this.client
      .flushdb()
      .catch(err => {
        consola.error(err);
      });
  }
  close() {
    return this.client
      .quit()
      .catch(err => {
        consola.error(err);
      });
  }
}

exports.RedisCache = RedisCache;
