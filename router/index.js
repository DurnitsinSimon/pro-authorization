const {Router} = require('express')
const userController = require('../controllers/userController')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const rolesMiddleware = require('../middlewares/rolesMiddleware')
const passport = require('passport')
const router = new Router()

require('../google/googleAuth')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32})
, userController.registration )
router.post('/login', userController.login )
router.post('/logout', userController.logout )
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users',authMiddleware, rolesMiddleware(['ADMIN']), userController.getUsers)
router.get('/updateToAdmin',authMiddleware, rolesMiddleware(['ADMIN']),  userController.updateToAdmin)
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile', 'https://www.googleapis.com/auth/plus.login' ]}))


module.exports = router