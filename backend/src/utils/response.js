const response = (res, statusCode, message, data) => {
  const resBOdy = {
    status: statusCode < 400 ? 'success' : 'fail',
  };

  if (message !== null) {
    resBOdy.message = message;
  }

  if (data !== null && data !== undefined) {
    resBOdy.data = data;
  }

  return res.status(statusCode).json(resBOdy);
};

export default response;
