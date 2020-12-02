const util = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
const { User, Post, Like } = require('../models');
const { Op } = require('sequelize');

module.exports = {
    createPost: async (req, res) => {
        const { userId, title, contents } = req.body;
        const image = req.file.location;
        try {
            const post = await Post.create({ UserId: userId, title, contents, postImageUrl: image });
            return res.status(sc.OK).send(util.success(sc.OK, rm.CREATE_POST_SUCCESS, post));
        } catch(err) {
            console.error(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.CREATE_POST_FAIL));
        }
    },

    readAllPost: async (req, res) => {
        try {
            const allPosts = await Post.findAll({
                attributes: ['id', 'title', 'contents', 'postImageUrl'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'userName', 'email']
                    }, 
                    {
                        model: User,
                        as: 'Liker',
                        attributes: { exclude: ['password', 'salt', 'id', 'email'] }
                    }
                ]
            });
            return res.status(sc.OK).send(util.success(sc.OK, rm.READ_ALL_POST_SUCCESS, allPosts));
        } catch(err) {
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.READ_ALL_POST_FAIL));
        }
    },

    createLike: async (req, res) => {
        const PostId = req.params.postId;
        const UserId = req.body.userId;
        try {
            const alreadyLike = await Like.findOne({
                where: {
                    [Op.and]: [
                      { PostId: PostId },
                      { UserId: UserId }
                    ]
                }
            });
            if(alreadyLike){
                return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, "이미 좋아요 하였습니다."));
            }
            const like = await Like.create({ PostId, UserId });
            return res.status(sc.OK).send(util.success(sc.OK, rm.CREATE_LIKE_SUCCESS, like));
        } catch (err) {
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.success(sc.INTERNAL_SERVER_ERROR, rm.CREATE_LIKE_FAIL));
        }
    },

    deleteLike: async (req, res) => {
        const PostId = req.params.postId;
        const UserId = req.body.userId;
        try {
            const alreadyLike = await Like.findOne({
                where: {
                    [Op.and]: [
                      { PostId: PostId },
                      { UserId: UserId }
                    ]
                }
            });
            if(!alreadyLike){
                res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, "좋아요가 되어 있지 않습니다."));
            }
            await Like.destroy({
                where: {
                    [Op.and]: [
                      { PostId: PostId },
                      { UserId: UserId }
                    ]
                }
            });
            return res.status(sc.OK).send(util.success(sc.OK, "좋아요 취소 성공."));
        } catch(err) {
            console.error(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, "좋아요 취소 에러."));
        }
    }
}
