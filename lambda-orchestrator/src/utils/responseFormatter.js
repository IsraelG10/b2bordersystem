function formatSuccess(data, correlationId) {
  return {
    statusCode: 201,
    body: JSON.stringify({ success: true, correlationId, data }),
  };
}

function formatError(message, correlationId) {
  return {
    statusCode: 400,
    body: JSON.stringify({ success: false, message, correlationId }),
  };
}

module.exports = { formatSuccess, formatError };
