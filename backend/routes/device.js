const express = require("express");
const { check, validationResult } = require("express-validator");
const device = require("../controller/device");

const router = express.Router();

//get all devices
router.get("/", device.all);

//CREATE DEVICE ROUTE

router.post(
  "/",
  [
    check("device").not().isEmpty().withMessage("device is required"),
    check("os").not().isEmpty().withMessage("os is required"),
    check("manufacturer")
      .not()
      .isEmpty()
      .withMessage("manufacturer is required"),
    check("lastCheckedOutBy")
      .not()
      .isEmpty()
      .withMessage("lastCheckedOutBy is required"),
    check("isCheckedOut")
      .not()
      .isEmpty()
      .withMessage("isCheckedOut is required"),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      device.createNewDevice(req, res);
    }
  }
);

//UPDATE DEVICE ROUTE
router.put(
  "/:id", device.update
);

//DELETE DEVICE ROUTE
router.delete("/:id", device.delete);

module.exports = router;
