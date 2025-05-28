import { useState, useCallback } from "react";
import { tableAPI } from "../../services/apis/Table";
import { toast } from "react-toastify";

const TableAdminViewModel = ({ tables, areas, onAddSuccess, onEditSuccess, onDeleteSuccess }) => {
  const [activeArea, setActiveArea] = useState(areas.length > 0 ? areas[0] : "");
  const [loading, setLoading] = useState(false);

  // Handle delete table
  const handleDelete = useCallback(
    async (tableId) => {
      setLoading(true);
      try {
        console.log("Deleting table with ID:", tableId); // Debug log
        await tableAPI.deleteTable({ table_id: tableId });
        toast.success("Xóa bàn thành công");
        onDeleteSuccess(tableId); // Gọi callback để thông báo xóa thành công
      } catch (error) {
        console.error("Error deleting table:", error);
        toast.error("Xóa bàn không thành công");
      } finally {
        setLoading(false);
      }
    },
    [onDeleteSuccess]
  );

  // Handle add table
  const handleAdd = useCallback(() => {
    onAddSuccess();
  }, [onAddSuccess]);

  // Handle edit table
  const handleEdit = useCallback(
    (table) => {
      console.log("Editing table:", table); // Debug log
      onEditSuccess({
        table_id: table._id || table.table_id,
        table_number: table.table_number,
        capacity: table.capacity,
        area: table.area,
      });
    },
    [onEditSuccess]
  );

  // Filter tables by active area
  const filteredTables = activeArea
    ? tables.filter((table) => table.area === activeArea)
    : tables;

  // Get unique areas for tabs
  const tabAreas = [...new Set(tables.map((table) => table.area))];

  return {
    activeArea,
    setActiveArea,
    filteredTables,
    tabAreas,
    loading,
    handleDelete,
    handleAdd,
    handleEdit,
  };
};

export default TableAdminViewModel;