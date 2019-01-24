function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}
function prettyReply (fn) {
  return async function (...props) {
    try {
      return success(await fn(...props));
    } catch(e) {
      return failure(e.message);
    }
  }
}
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
module.exports = {
  success: success,
  failure: failure,
  prettyReply: prettyReply,
}
