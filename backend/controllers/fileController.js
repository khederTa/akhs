const { File } = require("../models"); // Adjust path as needed

// Create a new file
exports.createFile = async (req, res) => {
  console.log("Create File....")
  try {
    const { fileData } = req.body; // Assuming file data is sent as binary/base64 in request body
    const newFile = await File.create({ file: fileData });
    res.status(201).json({ fileId: newFile.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create file" });
  }
};

// Retrieve a file by ID
exports.getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

// Update a file by ID
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileData } = req.body;
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    file.file = fileData;
    await file.save();
    res.status(200).json({ message: "File updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update file" });
  }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    await file.destroy();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" });
  }
};
