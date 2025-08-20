const captainModel = require('../models/captain.model');
const captainService = require('../Services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptainExists = await captainModel.findOne({ email });
        if (isCaptainExists) {
            return res.status(400).json({ message: 'Captain with this email already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const newCaptainData = {
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            }
        };

        const captain = await captainService.createCaptain(newCaptainData);

        const token = captain.generateAuthToken();
        res.status(201).json({ token, captain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json(req.captain);
};

module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({ token, captain: { _id: captain._id, fullname: captain.fullname, email: captain.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
