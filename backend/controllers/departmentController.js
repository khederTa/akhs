const { Department } = require("../models");

exports.getAllDepartments = async (req, res) => {
  const departments = await Department.findAll();
  res.json(departments);
};

exports.createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.json(department);
};

exports.getDepartmentById = async (req, res) => {
  const department = await Department.findByPk(req.params.id);
  res.json(department);
};

exports.updateDepartment = async (req, res) => {
  await Department.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Department updated" });
};

exports.deleteDepartment = async (req, res) => {
  await Department.destroy({ where: { id: req.params.id } });
  res.json({ message: "Department deleted" });
};
