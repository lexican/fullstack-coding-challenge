const DeviceModel = require("../model/device");

// @route api/device
// @desc returns all devices
// @access Public
exports.all = async function (req, res) {
  const devices = await DeviceModel.find({});
  res.status(200).json({ devices });
};

// @route api/device
// @desc create a new device
// @access Public
exports.createNewDevice = async function (req, res) {
  var deviceModel = new DeviceModel();
  deviceModel.device = req.body.device;
  deviceModel.os = req.body.os;
  deviceModel.manufacturer = req.body.manufacturer;
  deviceModel.lastCheckedOutDate = new Date();
  deviceModel.lastCheckedOutBy = req.body.lastCheckedOutBy;
  deviceModel.isCheckedOut = req.body.isCheckedOut;
  deviceModel.save(function (err) {
    console.log(err);
    if (err) res.send(err);
    res.send("Device successfully added!");
  });
};

// @route
// @desc Update a device details by id
// @access Public
exports.update = async function (req, res) {
  const id = req.params.id;
  await DeviceModel.findByIdAndUpdate(id, req.body, function (error, docs) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send("Device successfully updated!");
    }
  });
};

// @route api/device
// @desc delete a device by id
// @access Public
exports.delete = async function (req, res) {
  try {
    const id = req.params.id;
    await DeviceModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Device has been deleted successfully" });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: error.message });
  }
};
