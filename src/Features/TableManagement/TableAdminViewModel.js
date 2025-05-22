import { useState } from "react";

const TableAdminViewModel = ({ tables, areas }) => {
  const initialArea = areas.length > 0 ? areas[0] : "";
  const [activeArea, setActiveArea] = useState(initialArea);

  const filteredTables =
    activeArea === ""
      ? tables
      : tables.filter((table) => table.area === activeArea);

  const tabAreas = [...new Set(tables.map((table) => table.area))];

  return {
    activeArea,
    setActiveArea,
    filteredTables,
    tabAreas,
  };
};

export default TableAdminViewModel;