const jwt = require('jsonwebtoken');
const accessTokenDetails = require('../constants/constant');
const refreshTokenDetails = require('../constants/constant');
const authService = require('../services/auth.service');

let refreshTokens = [];
const accessTokenSecret = accessTokenDetails.accessTokenSecret;
const refreshTokenSecret = refreshTokenDetails.refreshTokenSecret;

// Login Employee
const login = async function (req, res, next) {
    const validUser = await authService.verifyUser(req.body.username);

    console.log('validUser: ', validUser);
    if (validUser && (validUser.username === req.body.username && validUser.password === req.body.password)) {
        // generate an access token
        const accessToken = jwt.sign({ userId: validUser._id, userRole: validUser.role }, accessTokenSecret, { expiresIn: '30s' });
        const refreshToken = jwt.sign({ username: validUser.username, userRole: validUser.role }, refreshTokenSecret);

        // userId: validUser[0]._id,
        //     idToken: this.jwtService.sign(payload),
        //         expiresIn: 30,
        //             userRole: validUser[0].role

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken,
            userId: validUser._id,
            userRole: validUser.role,
            expiresIn: 30 
        });
    } else {
        res.status(401).send('Username or password incorrect');
        // res.send('Username or password incorrect');
    }

}

module.exports.auth_login = login;

const token = async function (req, res, next) {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
}

module.exports.auth_token = token;

const logout = async function (req, res, next) {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
}

module.exports.auth_logout = logout;