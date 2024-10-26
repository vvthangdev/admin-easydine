const Table = require("../models/tablesModel.js");

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json({ tables });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error fetching tables", error: error.message });
  }
};
