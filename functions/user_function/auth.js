const jwt = require('jsonwebtoken');
const config = require('./config')

const generateJwtToken = (data) => {
	const {secrets} = config
console.log('secrets', secrets);
	const {
		ROWID, email, role
    } = data

	return jwt.sign({ ROWID, email, role }, secrets.jwt, {
		expiresIn: secrets.jwtExp,
	})
}

const verifyToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) {
				return reject(err)
			}
			resolve(payload)
		})
	})


const getTokenFromRequest = (req) => {

	const authorization = req.headers.authorization

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1].trim()
	}

	return null
}

module.exports = {
    generateJwtToken,
    getTokenFromRequest,
    verifyToken
}