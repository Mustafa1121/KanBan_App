const router = require('express').Router()
const { body } = require('express-validator')
const User = require('../models/user')
const tokenHandler = require('../handlers/tokenHandler')
const validation = require('../handlers/validation')
const UseController = require('../controllers/User')


router.post(
    '/signup',
    body('username').isLength({ min: 8 }).withMessage('Username must be greater than 8 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be greater than 8 characters'),
    body('confirmPassword').isLength({ min: 8 }).withMessage('confirmPassword must be greater than 8 characters'),
    body('username').custom(value => {
        return User.findOne({ username: value }).then(user => {
            if (user) {
                return Promise.reject('Username Already Used')
            }
        })
    }),
    validation.validate,
    UseController.register
)


router.post(
    '/login',
    body('username').isLength({ min: 8 }).withMessage('Username must be greater than 8 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be greater than 8 characters'),
    validation.validate,
    UseController.login
)

router.post(
    '/verify-token',
    tokenHandler.verifyToken,
    (req, res) => {
        res.status(200).json({ user: req.user })
    }
)

module.exports = router