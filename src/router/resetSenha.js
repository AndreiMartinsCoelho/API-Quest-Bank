const express = require("express");
const router = express.Router();
const resetController = require("../controller/resetController");

router.post("/", async (req, res) => {
  const data = req.body;
  const result = await resetController.changePassword(data);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});

router.post("/reset", async (req, res) => {
  const data = req.body;
  const result = await resetController.changePassword(data);

  if (result.success) {
    res.status(200).json({
      auth: true,
      user: result.user,
    });
  } else {
    res.status(401).json({
      auth: false,
      message: result.message,
    });
  }
});

module.exports = router;
