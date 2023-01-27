const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
// const { CloudinaryStorage } = require("multer-storage-cloudinary")
const dotenv = require('dotenv');
const cloudinary = require("../utils/cloudinary")

dotenv.config()

const multer = require('multer');


const ImageModel = require('../models/image-models')
const DonationModel = require('../models/donation-models')

const uri = process.env.URI_NAME

console.log(uri);

mongoose.connect(

    uri,
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
// const Storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "uploads",
//     },
//   });


const upload = multer({
    storage: Storage
}).single('testImage')

router.get('/', (req, res) => {
    res.send("it works lol.")
})

router.post('/upload', (req, res) => {
    upload(req, res,  async (err) => {
     try {
        if(err) {
            console.log(err);
        } else {

            const result = await cloudinary.uploader.upload(req.file.path)

            const newImage = new ImageModel({
            name: req.body.name,
            category:req.body.category,
            tag: req.body.tag,
            image: { data: result.secure_url, contentType: 'image/png'},
            mission: req.body.mission,
            email: req.body.email,
            phonenumber: req.body.phonenumber
            })
            newImage.save()
            .then(() => res.send("sucessfully uploaded"))
            .catch(err => console.log(err));
        }
     } catch (err) {
        console.log(err);
    }}
    )
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