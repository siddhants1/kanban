const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const generateJwt = async (user) => {
    try {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512' });
        return {
            success: true,
            token: token,
        };
    }
    catch(err) {
        return {
            success: false,
        };
    }
}

const generatePasswordHash = async (password) => {
    if(!password || password?.trim() === '') return '';
    
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);    
    }
    catch(err) {
        // console.log('what happened', err, '\n what happened');
        return '';
    }
}

const isPasswordValid = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        if(match) {
            return true;
        }
        return false;
    }
    catch(err) {
        return false;
    }
}

const errorFunction = (errorBit, msg, data = {}) => (errorBit ? { message: msg } : { message: msg, data: data });

module.exports = {
    generateJwt,
    generatePasswordHash,
    isPasswordValid,
    errorFunction,
};
