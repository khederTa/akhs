const { File } = require("../models"); // Adjust path as needed

// Create a new file
exports.createFile = async (req, res) => {
  const { fileData } = req.body;
  const base64Data = fileData.split(",")[1]; // Remove metadata part if present
  const buffer = Buffer.from(base64Data, "base64");

  try {
    const newFile = await File.create({ file: buffer });
    res.status(201).json({ fileId: newFile.id });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Failed to save file" });
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
