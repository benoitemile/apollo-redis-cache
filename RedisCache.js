const ioredis = require('ioredis');

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
        console.error('ERROR:', err)
        this.isWorking = false;
      });
    this.client = client;
  }
  set(key, value, options) {
    const { ttl } = Object.assign({}, this.defaultSetOptions, options);
    return this.client
      .set(key, value, 'EX', ttl)
      .catch(err => {
        console.error(err);
      });
  }
  get(key) {
    if (!this.isWorking) return false;
    return this.client
      .get(key)
      .catch(err => {
        console.error(err);
      });
  }
  delete(key) {
    if (!this.isWorking) return false;
    return this.client
      .del(key)
      .catch(err => {
        console.error(err);
      });
  }
  flush() {
    if (!this.isWorking) return false;
    return this.client
      .flushdb()
      .catch(err => {
        console.error(err);
      });
  }
  close() {
    return this.client
      .quit()
      .catch(err => {
        console.error(err);
      });
  }
}

exports.RedisCache = RedisCache;
