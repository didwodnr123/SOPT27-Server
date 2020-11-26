var express = require('express');
var router = express.Router();

router.get('/popular', (req, res) => {
    res.status(200).send('popular ranking news');
})
router.get('/bestreply', (req, res) => {
    res.status(200).send('best reply ranking news');
})
router.get('/age', (req, res) => {
    res.status(200).send('age ranking news');
})

module.exports = router;