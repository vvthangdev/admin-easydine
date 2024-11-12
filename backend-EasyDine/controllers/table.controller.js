const Table = require("../models/table_info");

const getAllTables = async (req, res) => {
  try {
    const tables = await TableInfo.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables" });
  }
};

const addTable = async (req, res) => {
  try {
    const { capacity, status } = req.body;
    const newTable = await TableInfo.create({ capacity, status });
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ error: "Error creating table" });
  }
};

const tableInfo = async (req, res) => {
  try {
    const table = await TableInfo.findByPk(req.params.id);
    if (table) {
      res.json(table);
    } else {
      res.status(404).json({ error: "Table not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching table" });
  }
};

const updateTable = async (req, res) => {
  try {
    const { capacity, status } = req.body;
    const table = await TableInfo.findByPk(req.params.id);
    if (table) {
      table.capacity = capacity || table.capacity;
      table.status = status || table.status;
      await table.save();
      res.json(table);
    } else {
      res.status(404).json({ error: "Table not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating table" });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await TableInfo.findByPk(req.params.id);
    if (table) {
      await table.destroy();
      res.json({ message: "Table deleted" });
    } else {
      res.status(404).json({ error: "Table not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting table" });
  }
};

module.exports = {
  getAllTables,
  addTable,
  tableInfo,
  updateTable,
  deleteTable,
};
