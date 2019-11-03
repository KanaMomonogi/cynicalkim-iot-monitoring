let express = require('express');
let router = express.Router();
let controller = require('./controller/apiController');

//api router
router.post('/sensorAdd', controller.sensorAdd);
router.get('/sensorList', controller.sensorList);
router.get('/sensorDetail/:sensor', controller.sensorDetail);
router.post('/sensorUpdate/:sensor', controller.sensorUpdate);
router.get('/sensorLogDelete/:sensor', controller.sensorLogDelete);
router.get('/sensorDelete/:sensor', controller.sensorDelete);
router.get('/allLog', controller.logList);
router.get('/allLogDelete', controller.allLogDelete);
router.get('/allDataDelete', controller.allDataDelete);

router.post('/logAdd', controller.logAdd);
module.exports = router;
