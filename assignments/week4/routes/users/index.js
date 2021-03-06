const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const util = require('../../modules/util');
const rm = require('../../modules/responseMessage');
const sc = require('../../modules/statusCode');
const { User } = require('../../models');

router.post('/signup', async (req, res) => {
    // 1. req.body에서 데이터 가져오기
    const {
        email,
        password,
        userName
    } = req.body;
    //2. request data 확인하기, id 또는 password data가 없다면 NullValue 반환
    if(!email || !password || !userName){
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    //3. 존재하는 아이디인지 확인하기. 이미 존재하는 아이디면 ALREADY ID 반환
    try {
        const alreadyEmail = await User.findOne({
            where: {
                email: email,
            }
        });
        if(alreadyEmail){
            return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.ALREADY_EMAIL));
        }
        //4. salt 생성
        const salt = crypto.randomBytes(64).toString('base64');
        //5. 2차 세미나때 배웠던 pbkdf2 방식으로 (비밀번호 + salt) 해싱하여 => 암호화된 password 를 만들기!
        const digest = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('base64');
        //6. usersDB에 id, 암호화된 password, salt 저장!
        const user = await User.create({
            email: email,
            password: digest,
            userName: userName,
            salt: salt
        });
        //7. status: 200 message: SING_UP_SUCCESS, data: id만 반환! (비밀번호, salt 반환 금지!!)
        return res.status(sc.OK).send(util.success(sc.OK, rm.SIGN_UP_SUCCESS, {id: user.id, email, userName}));
    } catch (err) {
        console.error(err);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.SIGN_UP_FAIL));
    }
});

router.post('/signin', async (req, res) => {
    // 1. req.body에서 데이터 가져오기
    const {
        email,
        password
    } = req.body; 
    //2. request data 확인하기, id 또는 password data가 없다면 NullValue 반환
    if(!email || !password){
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    //3. 존재하는 아이디인지 확인하기. 존재하지 않는 아이디면 NO USER 반환
    try {
        const user = await User.findOne({
            where: {
                email: email,
            }
        });
        if(!user){
            return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NO_USER));
        }
        //4. 비밀번호 확인하기 - 로그인할 id의 salt를 DB에서 가져와서 사용자가 request로 보낸 password와
        // 암호화를 한후 디비에 저장되어있는 password와 일치하면 true일치하지 않으면 Miss Match password 반환
        const { id, userName, salt, password: digest } = user;
        const inputPwd = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('base64');
        if(inputPwd != digest){
            return res.status(sc.BAD_REQUEST).send(util.success(sc.BAD_REQUEST, rm.MISS_MATCH_PW));
        }
        //5. status: 200 ,message: SIGNIN SUCCESS, data: id 반환 (비밀번호, salt 반환 금지!!)
        return res.status(sc.OK).send(util.success(sc.OK, rm.SIGN_IN_SUCCESS, { id, email, userName }));
    } catch(err) {
        console.error(err);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.SIGN_IN_FAIL));
    }
});

router.get('/', async (req, res) => {
    // 1.모든 유저정보 조회 (id, email, userName)!
    try{
        const users = await User.findAll({
            attributes: ['id', 'email', 'userName'],
        });
        res.send(util.success(sc.OK, rm.USER_READ_ALL_SUCCESS, users));
    } catch (err) {
        res.send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.USER_READ_ALL_FAIL));
    }
});

router.put('/', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
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
});

module.exports = router;