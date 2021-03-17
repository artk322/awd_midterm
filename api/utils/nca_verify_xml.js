const httpreq = require('./httpreq.js');

module.exports = async function nca_verify_xml(xml) {
  const { content } = await httpreq({
    method: 'POST',
    hostname: 'ncanode',
    port: 14579,
    path: '/',
    headers: { 'content-type': 'application/json' },
    content: JSON.stringify({
      version: '1.0',
      method: 'XML.verify',
      params: {
        xml,
        verifyOcsp: true,
        // verifyCrl: true,
      },
    }),
  });
  const { result } = JSON.parse(content);
  return result;
}

