const express = require('express');
const router = express.Router();
const util = require('../../modules/util');
const rm = require('../../modules/responseMessage');
const sc = require('../../modules/statusCode');
let membersDB = require('../../modules/members');

/** 멤버 생성 */
router.post('/', (req, res) => {
    console.log('err');
    const { name, part, age } = req.body;
    if(!name || !part || !age){
        console.log('필요한 값이 없습니다.');
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    const idx = membersDB[membersDB.length - 1].idx + 1
    membersDB.push({
        idx,
        name,
        part,
        age
    });
    return res.status(sc.OK).send(util.success(sc.OK, rm.MEMBER_CREATE_SUCCESS, membersDB[idx]));
});

/** 모든 멤버 조회 */
router.get('/', (req, res) => {
    return res.status(sc.OK).send(util.success(sc.OK, rm.MEMBER_READ_ALL_SUCCESS, membersDB));
})

/** idx 값으로 특정 멤버 조회 */
router.get('/:idx', (req, res) => {
    const { idx } = req.params;
    const member = membersDB.find((member) => member.idx == idx);
    if(!member){
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, "No member"));
    }
    return res.status(sc.OK).send(util.success(sc.OK, rm.MEMBER_READ_SUCCESS, member));
})

/** idx 값으로 특정 멤버 삭제 */
router.delete('/:idx', (req, res) => {
    const { idx } = req.params;
    const member = membersDB.find(member => member.idx == idx);
    if(!idx){
        console.log('필요한 값이 없습니다.');
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    if(!member){
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, "No member"));
    }
    membersDB = membersDB.filter(member => member.idx != idx);
    return res.status(sc.OK).send(util.success(sc.OK, rm.MEMBER_DELETE_SUCCESS, member)); 
})

/** name으로 특정 멤버 정보 수정 */
router.put('/:idx', (req, res) => {
    const { idx } = req.params;
    const { name, part, age } = req.body;
    if(!idx) {
        console.log('필요한 값이 없습니다!');
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    if (!name || !part || !age) {
        console.log('필요한 값이 없습니다!');
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    const memberIdx = membersDB.findIndex(member => member.idx == idx);
    if(memberIdx === -1) {
        console.log('idx가 유효하지 않습니다.');
        return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.NO_USER));
    }
    membersDB[memberIdx] = {
        idx: Number.parseInt(idx),
        name,
        part,
        age
    }
    return res.status(sc.OK).send(util.success(sc.OK, rm.MEMBER_UPDATE_SUCCESS, membersDB)); 
});

module.exports = router;