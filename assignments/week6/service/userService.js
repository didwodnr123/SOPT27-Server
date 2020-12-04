const crypto = require('crypto');
const { User } = require('../models');

module.exports = {
    emailCheck: async (email) => {
        try {
            const user = await User.findOne({
                where: {
                    email,
                } 
            });
            return user;
        } catch (err) {
            throw err;
        }
    },

    signup: async (email, userName, password) => {
        try{
            const salt = crypto.randomBytes(64).toString('base64');
            const digest = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('base64');
            const user = await User.create({
                email: email,
                password: digest,
                userName: userName,
                salt: salt
            });
            return user;
        } catch(err){
            throw err;
        }
    },

    signin: async (email, password, salt) => {
        try {
            const inputPwdDigest = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('base64');
            const user = await User.findOne({
                where: {
                    email,
                    password: inputPwdDigest
                }
            });
            return user;
        } catch(err) {
            throw err;
        }
    }
}