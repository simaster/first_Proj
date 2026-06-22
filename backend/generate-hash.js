const bcrypt = require('bcryptjs');

bcrypt.hash('8227', 12).then(hash => {
  console.log('Hashed password:', hash);
});
