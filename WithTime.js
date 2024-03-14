const EventEmitter = require('./CustomEventEmitter');
const { performance } = require('perf_hooks');
const https = require('https');
class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    this.emit('start');
    const start = performance.now();
    try {
      const data = await asyncFunc(...args);
      console.log(data);
      this.emit('data', data);
    } catch (error) {
      this.emit('error', error);
    } finally {
      this.emit('end', performance.now() - start);
    }
  }
}

const fetchFromUrl = (url) => {
  return new Promise(function (resolve, reject) {
    var req = https.get(url, function (res) {
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      // cumulate data
      var body = [];
      res.on('data', function (chunk) {
        body.push(chunk);
      });
      // resolve on e
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    // reject on request error
    req.on('error', function (err) {
      reject(err);
    });
    req.end();
  });
};

const withTime = new WithTime();

withTime.on('start', () => console.log('About to execute'));
withTime.on('end', (ms) => console.log(`Done with execute in ${ms}ms`));
withTime.on('data', (data) => console.log(JSON.stringify(data, null, 4)));
withTime.on('error', (error) => console.log('ERROR', error));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners('end'));
