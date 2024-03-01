const router = require('express').Router();
const axios = require("axios");

router.get('/post', async (req, res) => {
  try {
    const response = await axios.get("https://api.postalpincode.in/pincode/110084");
    console.log(response.data[0].PostOffice);

    
    res.json(response.data[0].PostOffice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;