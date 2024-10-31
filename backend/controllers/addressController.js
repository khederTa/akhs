const { Address } = require("../models");

exports.getStates = async (req, res) => {
  try {
    const states = await Address.findAll({
      attributes: ["state"],
      group: ["state"],
    });
    res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCities = async (req, res) => {
  const { state } = req.query;
  try {
    const cities = await Address.findAll({
      where: { state },
      attributes: ["city"],
      group: ["city"],
    });
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getDistricts = async (req, res) => {
  const { city } = req.query;
  try {
    const districts = await Address.findAll({
      where: { city },
      attributes: ["district"],
      group: ["district"],
    });
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getVillages = async (req, res) => {
  const { district } = req.query;
  try {
    const villages = await Address.findAll({
      where: { district },
      attributes: ["id", "village"],
    });
    res.json(villages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// exports.getAllAddresses = async (req, res) => {
//   const addresses = await Address.findAll();
//   res.json(addresses);
// };

// exports.createAddress = async (req, res) => {
//   try {
//     const address = await Address.create({
//       country: req.body.country,
//       city: req.body.city,
//       street: req.body.street,
//       state: req.body.state,
//       buildingname: req.body.buildingname,
//     });
//     res.status(201).json(address);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the address" });
//   }
// };

// exports.getAddressById = async (req, res) => {
//   const address = await Address.findByPk(req.params.id);
//   res.json(address);
// };

// exports.updateAddress = async (req, res) => {
//   await Address.update(req.body, { where: { id: req.params.id } });
//   res.json({ message: "Address updated" });
// };

// exports.deleteAddress = async (req, res) => {
//   await Address.destroy({ where: { id: req.params.id } });
//   res.json({ message: "Address deleted" });
// };
