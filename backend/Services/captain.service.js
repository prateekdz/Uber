const captainModel = require('../models/captain.model');

module.exports.createCaptain = async (data) => {
    const { email, password, phone, fullname, vehicle } = data;

    if (
        !email ||
        !password ||
        !fullname ||
        !fullname.firstname ||
        !fullname.lastname ||
        !vehicle ||
        !vehicle.color ||
        !vehicle.plate ||
        !vehicle.capacity ||
        !vehicle.vehicleType
    ) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password,
        phone,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        }
    });

    return captain;
};
    