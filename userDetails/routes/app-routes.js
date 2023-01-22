const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config()

const multer = require('multer');
// let uri = "mongodb+srv://haliyah:haliyah@cluster0.9ekj33o.mongodb.net/?retryWrites=true&w=majority"

const ImageModel = require('../models/image-models')
const DonationModel = require('../models/donation-models')

const uri = process.env.URI_NAME

console.log(uri);

mongoose.connect(
    // 'mongodb://127.0.0.1:27017/konectdb', 
    "mongodb+srv://haliyah:haliyah@cluster0.9ekj33o.mongodb.net/?retryWrites=true&w=majority",
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});


const Storage  = multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb) => {
        cb(null, file.originalname);
    },
})


const upload = multer({
    storage: Storage
}).single('testImage')

router.get('/', (req, res) => {
    res.send("it works lol.")
})

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {
            const newImage = new ImageModel({
            name: req.body.name,
            // logo: { data: req.body.filename, contentType: 'image/png'},
            category:req.body.category,
            tag: req.body.tag,
            image: { data: req.file.filename, contentType: 'image/png'},
            mission: req.body.mission,
            email: req.body.email,
            phonenumber: req.body.phonenumber
            })
            newImage.save()
            .then(() => res.send("sucessfully uploaded"))
            .catch(err => console.log(err));
        }
    })
})


router.post('/donate', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {
            const newDonation = new DonationModel({
            name: req.body.name,
            orgName:req.body.orgName,
            image: { data: req.file.filename, contentType: 'image/png'},
            detail: req.body.detail,
            category: req.body.category
            })
            newDonation.save()
            .then(() => res.send("sucessfully uploaded"))
            .catch(err => console.log(err));
        }
    })
})

router.get('/getDetails', (req, res) => {
    ImageModel.find({}, (err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})
router.get('/getDetailInfo', (req, res) => {
    // console.log(req.query);
    ImageModel.find({name:req.query.name}, (err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})
router.get('/getDetailSector', (req, res) => {
    // console.log(req.query);
    ImageModel.find({tag:req.query.tag}, (err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})

router.get('/getDonations', (req, res) => {
    DonationModel.find({}, (err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})

router.get('/getDonation/:name', (req, res) => {
    // console.log(req.params);
    DonationModel.find({name: req.params.name},(err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})

module.exports = router