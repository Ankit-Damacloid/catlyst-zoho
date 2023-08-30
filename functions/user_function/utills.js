const bcrypt = require('bcryptjs');

const compareCredentials = async (userPassword, dbPassword) => {
    const isMatch = await bcrypt.compare(userPassword, dbPassword)
    if(!isMatch) {
        return false;
    }
    return true;
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8)
}

module.exports = {
    compareCredentials,
    hashPassword
}