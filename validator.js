const { check } = require('express-validator');

let validateRegisterUser = () => {
  return [ 
    check('name', 'Name does not Empty').not().isEmpty(),
    check('phone', 'Phone does not Empty').not().isEmpty(),
    check('password', 'password more than 6 degits').isLength({ min: 6 })
  ]; 
}

let validateLogin = () => {
  return [ 
    check('phone', 'Phone does not Empty').not().isEmpty(),
    check('password', 'Password more than 6 degits').isLength({ min: 6 })
  ]; 
}

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin
};

module.exports = { validate };