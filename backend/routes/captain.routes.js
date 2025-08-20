const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const { use } = require('react');
const userModel = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 1 }).withMessage('Vehicle plate is required')
        .matches(/^[A-Z0-9]{1,10}$/).withMessage('Please fill a valid vehicle plate number'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isLength({ min: 1 }).withMessage('Vehicle type is required')
], 

    captainController.registerCaptain
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], 
    captainController.loginCaptain
);

router.get('/profile',authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

module.exports = router;