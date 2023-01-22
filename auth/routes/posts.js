const express = require('express')
const router = express.Router();
const verify = require('./verifytoken')


router.get('/getPost',verify, (req,res) => {
    res.json({posts: {title: 'my first post', description: 'random data you should not access'}})
})

module.exports = router