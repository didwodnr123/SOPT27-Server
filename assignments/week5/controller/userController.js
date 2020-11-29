const crypto = require('crypto');
const util = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
const { User, Post } = require('../models');
const { userService } = require('../service');

module.exports = {
    signup: async (req, res) => {
        const {
            email,
            password,
            userName
        } = req.body;
        
        if(!email || !password || !userName){
            return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
        }

        try {
            const alreadyEmail = await userService.emailCheck(email);
            if(alreadyEmail){
                return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.ALREADY_EMAIL));;
            }
            const user = await userService.signup(email, userName, password);
            return res.status(sc.OK).send(util.success(sc.OK, rm.SIGN_UP_SUCCESS, user));
        } catch (err) {
            console.error(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.SIGN_UP_FAIL));
        }
    },

    signin: async (req, res) => {
        const {
            email,
            password
        } = req.body; 
        if(!email || !password){
            return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
        }
        try {
            const user = await userService.emailCheck(email);
            if(!user){
                return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NO_USER));
            }
            const { id, userName, salt, password: digest } = user;
            const inputPwd = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('base64');
            if(inputPwd != digest){
                return res.status(sc.BAD_REQUEST).send(util.success(sc.BAD_REQUEST, rm.MISS_MATCH_PW));
            }
            return res.status(sc.OK).send(util.success(sc.OK, rm.SIGN_IN_SUCCESS, { id, email, userName }));
        } catch(err) {
            console.error(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.SIGN_IN_FAIL));
        }
    },

    readAllUsers: async (req, res) => {
        try{
            const users = await User.findAll({
                attributes: ['id', 'email', 'userName'],
            });
            res.send(util.success(sc.OK, rm.USER_READ_ALL_SUCCESS, users));
        } catch (err) {
            res.send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.USER_READ_ALL_FAIL));
        }
    },

    updateUser: async (req, res) => {
        const { email, userName } = req.body;
        try {
            await User.update({userName: userName}, {
                where: {
                    email: email,
                }
            });
            return res.status(sc.OK).send(util.success(sc.OK, rm.USER_UPDATE_SUCCESS, {email, userName}));
        } catch (err) {
            console.error(err);
            res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.USER_UPDATE_FAIL));
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try{
            await User.destroy({
                where: {
                    id: id,
                }
            });
            return res.status(sc.OK).send(util.success(sc.OK, rm.USER_DELETE_SUCCESS));
        } catch(err){
            console.error(err);
            return res.send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.USER_DELETE_FAIL));
        }
    },

    readUserInfo: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
                attributes: ['email', 'userName'],
                include: {
                    model: Post,
                    attributes: ['id', 'title', 'contents', 'postImageUrl', 'userId']
                }
            });
            return res.status(sc.OK).send(util.success(sc.OK, "회원 정보 조회 성공.", user));
        } catch(err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, "회원 정보 조회 실패."));
        }
    }
}