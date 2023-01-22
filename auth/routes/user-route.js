const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const User= require('../model/user-model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Message = require('../model/message-model');
const Volunteer = require('../model/volunteer-model');
const User = require('../model/user-model')
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 





dotenv.config()

mongoose.connect(
    process.env.DB_CONNECT,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});


/**
 * @openapi
 * '/users/register':
 *  post:
 *     tags:
 *     - User
 *     summary: Create an account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *              - confirmPassword
 *              - role
 *            properties:
 *              firstName: 
 *                type: string
 *                default: User's first name
 *              lastName:
 *                type: string
 *                default: User's last name
 *              email:
 *                type: string
 *                default: User's email address
 *              password:
 *                type: string
 *                default: User's password
 *              confirmPassword: 
 *                type: string
 *                default: User's password again
 *              role:
 *                type: string
 *                default: User's role
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.post('/register', async (req, res) => {

    
    const schema = Joi.object().keys({ 
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
        role: Joi.string().min(4).required()
    })
    const {error} = schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message) 
    
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const hashedCPassword = await bcrypt.hash(req.body.confirmPassword, salt)


    const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    confirmPassword: hashedCPassword,
    role: req.body.role

  })

  try{
     await user.save()
     res.send({user: user._id})
  }catch(err){
    res.status(400).send(err)
  }
})

/**
 * @openapi
 * '/users/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: User's email address
 *              password:
 *                type: string
 *                default: User's password
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.post('/login', async (req, res) => {

    
    const regSchema = Joi.object().keys({ 
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })
    const {error} = regSchema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message) 

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email is not found')

     const validPass = await bcrypt.compare(req.body.password,user.password)
     if(!validPass) return res.status(400).send('Invalid password')
    
     const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
     res.header('auth-token', token).send(token)

 
})
/**
 * @openapi
 * '/users/updateUser/email':
 *  post:
 *     tags:
 *     - User
 *     summary: Create an account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *              - confirmPassword
 *            properties:
 *              password:
 *                type: string
 *                default: User's password
 *              confirmPassword: 
 *                type: string
 *                default: User's password again
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
router.post('/updateUser', (req, res) => {
    User.findOneAndUpdate({ "email": req.body.email }, {
        $set: {
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
    }, (err, result) => {
        if (err) {
            res.send({ message: "db error occured while inserting data", error: err })
        } else {
            res.send("Account info updated successfully")
        }
    })
})
/**
 * @openapi
 * '/users/addMessage':
 *  post:
 *     tags:
 *     - User
 *     summary: Create an account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - subject
 *              - message
 *            properties:
 *              firstName: 
 *                type: string
 *                default: User's first name
 *              lastName:
 *                type: string
 *                default: User's last name
 *              subject:
 *                type: string
 *                default: User's subject address
 *              message:
 *                type: string
 *                default: User's message
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */

router.post('/addMessage', (req, res) => {
    Message.create(req.body, (err, result) => {
        if (err) {
            res.send({ message: "db error occured while inserting data", error: err })
        } else {
            res.send("Message sent successfully")
        }
    })
})

/**
 * @openapi
 * '/users/addVolunteer':
 *  post:
 *     tags:
 *     - User
 *     summary: Create an account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - phoneNumber
 *              - email
 *              - address
 *              - gender
 *              - postalCode
 *              - reason
 *            properties:
 *              firstName: 
 *                type: string
 *                default: User's first name
 *              lastName:
 *                type: string
 *                default: User's last name
 *              phoneNumber:
 *                type: string
 *                default: User's phone number
 *              email:
 *                type: string
 *                default: User's email address
 *              address:
 *                type: string
 *                default: User's password
 *              gender: 
 *                type: string
 *                default: User's gender
*              postalCode: 
 *                type: string
 *                default: User's Postal code
 *              reason:
 *                type: string
 *                default: User's reason
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */

router.post('/addVolunteer', (req, res) => {
    Volunteer.create(req.body, (err, result) => {
        if (err) {
            res.send({ message: "db error occured while inserting data", error: err })
        } else {
            res.send("Message sent successfully")
        }
    })
})


/**
 * @openapi
 * users/findAllUsers:
 *  get:
 *     summary: Find all users
 *     tags:
 *     - User
 *     description: Returns all Users
 *     responses:
 *       200:
 *         description: API is  running
 */
router.get('/findAllUsers', (req, res) => {
    User.find({}, (err, records) => {
        if (err) {
            res.send({ message: "db error occured while inserting data", error: err })
        } else {
            res.send({users: records})
        }
    })
})
/**
 * @openapi
 * '/api/deleteUser/{email}':
 *  delete:
 *     tags:
 *     - User
 *     summary: Remove User by email
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique email of the User
 *        required: true
 *     responses:
 *      200:
 *        description: Removed
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found
 */
router.post('/deleteUser', (req, res) => {
    User.findOneAndDelete({ "email": req.body.email}, (err, result) => {
        if (err) {
            res.send({ message: "db error occured while inserting data", error: err })
        } else {
            res.redirect('/users/findAllUsers')
        }
    })
})

module.exports = router;