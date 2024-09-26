// const User = require("../db/models/user.j");
const {db} = require('../db/models')
const UUID = require('uuid')

const signup = async (req, res, next) => {
    const body = req.body;

    const newUser = await db.user.create({
        id: UUID.v4(),
        username: body.username,
        email: body.email,
        password: body.password,
    });

    if (!newUser) {
        return res.status(400).json({
            status: 'fails',
            message: 'Failed to create new user'
        });
    }
    return res.status(201).json({
        status: 'Success',
        data: newUser,
    })
};

module.exports = {signup}