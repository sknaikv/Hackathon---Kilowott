module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  };

  // Handle specific error types
  if (err.code === 'VALIDATION_ERROR') {
    statusCode = 400;
    errorResponse.error = {
      code: err.code,
      message: err.message,
      details: err.details
    };
  } else if (err.code === 'NOT_FOUND') {
    statusCode = 404;
    errorResponse.error = {
      code: err.code,
      message: err.message
    };
  } else if (err.code === 'WOOCOMMERCE_ERROR' || err.statusCode === 401 || err.statusCode === 403) {
    statusCode = 502;
    errorResponse.error = {
      code: 'WOOCOMMERCE_ERROR',
      message: err.message || 'Failed to communicate with WooCommerce',
      details: err.details || { statusCode: err.statusCode }
    };
  } else if (err.code === 'AI_SERVICE_ERROR' || err.code === 'AI_NETWORK_ERROR') {
    statusCode = 503;
    errorResponse.error = {
      code: 'AI_SERVICE_ERROR',
      message: err.message || 'AI service temporarily unavailable'
    };
  } else if (err.code === 'NETWORK_ERROR') {
    statusCode = 503;
    errorResponse.error = {
      code: 'NETWORK_ERROR',
      message: err.message || 'Network error occurred'
    };
  } else if (err.message) {
    errorResponse.error.message = err.message;
  }

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
