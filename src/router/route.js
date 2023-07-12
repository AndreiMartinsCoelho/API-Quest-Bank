const express=require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
  res.status(200).send("<h1>API para Quest Bank</h1>");
})

module.exports=router;