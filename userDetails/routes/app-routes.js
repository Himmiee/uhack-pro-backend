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


const upload = multer({
    storage: Storage
}).single('testImage')

router.get('/', (req, res) => {
    res.send("it works lol.")
})

/**
 * @openapi
 * '/ngo/upload':
 *  post:
 *     tags:
 *     - NGO
 *     summary: NGO Details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - category
 *              - tag
 *              - image
 *              - mission
 *              - email
 *              - phonenumber
 *            properties:
 *              name: 
 *                type: string
 *                default: NGO's first name
 *              category:
 *                type: string
 *                default: NGO's last name
 *              tag:
 *                type: string
 *                default: NGO's tag address
 *              image:
 *                type: string
 *                default: NGO's image
 *              mission: 
 *                type: string
 *                default: NGO's password again
 *              email:
 *                type: string
 *                default: NGO's email
 *              phonenumber:
 *                type: number
 *                default: NGO's contact no
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */

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


/**
 * @openapi
 * '/ngo/donate':
 *  post:
 *     tags:
 *     - NGO
 *     summary: NGO Details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - orgName
 *              - image
 *              - detail
 *              - category
 *            properties:
 *              name: 
 *                type: string
 *                default: Name
 *              orgName:
 *                type: string
 *                default: Organization's name
 *              image:
 *                type: string
 *                default: Organization's image
 *              detail: 
 *                type: string
 *                default: Organization's detail
 *              category:
 *                type: string
 *                default: Organization's category
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */


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

/**
 * @openapi
 * ngo/getDetails:
 *  get:
 *     summary: Find all NGO Details
 *     tags:
 *     - NGO
 *     description: Returns all NGO details
 *     responses:
 *       200:
 *         description: API is  running
 */
router.get('/getDetails', (req, res) => {
    ImageModel.find({}, (err, results) => {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    })
})
/**
 * @openapi
 * ngo/getDetailInfo/name:
 *  get:
 *     summary: Find NGO Details by Name
 *     tags:
 *     - NGO
 *     description: Returns all NGO details with the name
 *     responses:
 *       200:
 *         description: API is  running
 */
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

/**
 * @openapi
 * ngo/getDetailSector/tag:
 *  get:
 *     summary: Find NGO Details by tag (their sector)
 *     tags:
 *     - NGO
 *     description: Returns all NGO details with the tag (their sector)
 *     responses:
 *       200:
 *         description: API is  running
 */
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
/**
 * @openapi
 * ngo/getDonations:
 *  get:
 *     summary: Find a list of the people who donated
 *     tags:
 *     - NGO
 *     description: Returns all the people that donated
 *     responses:
 *       200:
 *         description: API is  running
 */
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