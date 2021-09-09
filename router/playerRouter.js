const {Router} = require('express')
const playerController = require('../controllers/playerController')
const router = new Router()


router.post('/createPlayer', playerController.createPlayer)
router.get('/getAllPlayers', playerController.getAllPlayers)
router.get('/getPlayer/:id', playerController.getPlayer)
router.put('/updatePlayer', playerController.updatePlayer)


module.exports = router