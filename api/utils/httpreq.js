const http = require('http');
const { parse: url_parse } = require('url');
const { pipeline } = require('stream');

module.exports = async function httpreq({ retry_interval_ms, ...options }) {
  do {
    const resp_promise = http_stream(options).then(it => (
      readall(it)
      .then(content => ({
        status: it.statusCode,
        headers: it.headers,
        content,
      }))
    ));

    if (!retry_interval_ms) {
      return resp_promise;
    }

    try {
      const resp = await resp_promise;
      if (resp.status >= 500) {
        throw Object.assign(new Error('HTTP 50x Error'), { code: 'HTTP50X' });
      }
      return resp;
    } catch (err) {
      console.error(
        `http error (${err.code}),`,
        `will retry after ${retry_interval_ms * 1e-3}s`,
      );
    }
    await new Promise(resolve => setTimeout(resolve, retry_interval_ms));
  } while (true); // eslint-disable-line no-constant-condition
}

function http_stream({ content, url, ...options }) {
  if (url) {
    const { hostname, port, path } = url_parse(url);
    options = {
      hostname,
      port,
      path,
      ...options,
    };
  }
  return new Promise((resolve, reject) => {
    const req = (
      http.request(options)
      .on('error', reject)
      .on('response', resolve)
    );
    if (!content) {
      return req.end();
    }
    if (Buffer.isBuffer(content) || typeof content == 'string') {
      return req.end(content);
    }
    pipeline(content, req, err => {
      if (err) {
        reject(err);
      }
    });
  });
}

const readall = stream => new Promise((resolve, reject) => {
  const chunks = [];
  stream
  .on('data', chunk => chunks.push(chunk))
  .on('error', reject)
  .on('end', _ => resolve(Buffer.concat(chunks)));
});
