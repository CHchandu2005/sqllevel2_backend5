const router=require('express').Router()
const apiController=require('../controllers/apiController');

const authenticateUser = require('../middleware/auth');
router.get('/getquestions',authenticateUser,apiController.sendquestions);
router.post('/submitquestions',authenticateUser,apiController.submitquestions);  
module.exports=router;