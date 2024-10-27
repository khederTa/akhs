const { Package, ActivityType } = require("../models");

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: {
        model: ActivityType,
        through: { attributes: [] }, // Exclude join table attributes
      },
    });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving Packages" });
  }
};

// Create a new Package and link it with existing ActivityTypes
exports.createPackage = async (req, res) => {
  try {
    const { name, description, activityTypeIds } = req.body;
    console.log({ name, description, activityTypeIds });
    // Create the new Package
    const newPackage = await Package.create({ name, description });

    // Link the Package with existing ActivityTypes
    if (activityTypeIds && Array.isArray(activityTypeIds)) {
      const activityTypes = await ActivityType.findAll({
        where: { id: activityTypeIds },
      });

      if (activityTypes.length) {
        await newPackage.addActivityTypes(activityTypes);
      }
    }

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: "Error creating Package" });
  }
};

exports.getPackageById = async (req, res) => {
  const package = await Package.findByPk(req.params.id);
  res.json(package);
};

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, activityTypeIds } = req.body;

    // Find the Package by ID
    const package = await Package.findByPk(id);

    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Update the Package's fields
    package.name = name;
    package.description = description;
    await package.save();

    // Update the associated ActivityTypes
    if (activityTypeIds && Array.isArray(activityTypeIds)) {
      const activityTypes = await ActivityType.findAll({
        where: { id: activityTypeIds },
      });

      // Clear existing associations and reassign new ones
      await package.setActivityTypes(activityTypes);
    }

    // Fetch the updated Package with associated ActivityTypes
    const updatedPackage = await Package.findByPk(id, {
      include: {
        model: ActivityType,
        through: { attributes: [] },
      },
    });

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: "Error updating Package" });
  }
};

exports.deletePackage = async (req, res) => {
  await Package.destroy({ where: { id: req.params.id } });
  res.json({ message: "Package deleted" });
};
