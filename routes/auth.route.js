const express = require('express');
const app = express();
const authRoute = express.Router();

// auth controllers
const auth_controller = require('../controllers/auth.controller');

//Login auth API
authRoute.post('/login', auth_controller.auth_login);

//Token Generate
authRoute.post('/token', auth_controller.auth_token);

//Logout auth API
authRoute.put('/logout', auth_controller.auth_logout);

module.exports = authRoute;
