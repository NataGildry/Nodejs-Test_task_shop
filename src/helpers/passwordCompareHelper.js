const bcrypt = require('bcrypt');

module.exports = (password, hash) => bcrypt.compare(password, hash);
