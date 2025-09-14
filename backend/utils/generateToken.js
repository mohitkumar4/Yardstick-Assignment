const jwt = require('jsonwebtoken');

const generateToken = (res, userId, tenantId, role) => {
  const payload = { userId, tenantId, role };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return token;
};

module.exports = generateToken;