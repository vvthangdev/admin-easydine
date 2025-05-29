import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { tableAPI } from "../../services/apis/Table";
import { toast } from "react-toastify";

const TableFormModalViewModel = ({ onClose, onSubmitSuccess, editingTable }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editingTable
      ? {
          table_number: editingTable.table_number?.toString() || "",
          capacity: editingTable.capacity?.toString() || "",
          area: editingTable.area || "",
        }
      : { table_number: "", capacity: "", area: "" },
    mode: "onChange",
  });

  // Reset form when editingTable changes
  useEffect(() => {
    console.log("editingTable changed:", editingTable); // Debug log
    if (editingTable) {
      reset({
        table_number: editingTable.table_number?.toString() || "",
        capacity: editingTable.capacity?.toString() || "",
        area: editingTable.area || "",
      });
    } else {
      reset({ table_number: "", capacity: "", area: areas[0] || "" });
    }
  }, [editingTable, reset, areas]);

  // Fetch areas from API
  const fetchAreas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tableAPI.getAllAreas();
      if (!Array.isArray(response)) {
        throw new Error("Dữ liệu khu vực không hợp lệ");
      }
      setAreas(response);
      if (response.length > 0 && !editingTable) {
        reset((formValues) => ({ ...formValues, area: response[0] }));
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Lỗi khi tải danh sách khu vực");
    } finally {
      setLoading(false);
    }
  }, [editingTable, reset]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data) => {
      setLoading(true);
      const requestData = {
        table_number: parseInt(data.table_number, 10),
        capacity: parseInt(data.capacity, 10),
        area: data.area,
      };

      try {
        let result;
        if (editingTable) {
          console.log("Updating table with data:", { ...requestData, table_id: editingTable.table_id });
          result = await tableAPI.updateTable({ ...requestData, table_id: editingTable.table_id });
        } else {
          console.log("Adding new table with data:", requestData);
          result = await tableAPI.addTable(requestData);
        }

        // Kiểm tra phản hồi API
        if (!result || !result._id || !result.table_number || !result.capacity || !result.area) {
          throw new Error("Phản hồi API không hợp lệ hoặc thiếu dữ liệu");
        }

        console.log("API response:", result);

        // Chuẩn hóa dữ liệu để truyền qua onSubmitSuccess
        const tableData = {
          table_id: result._id,
          table_number: result.table_number,
          capacity: result.capacity,
          area: result.area,
        };

        // Gọi onSubmitSuccess và hiển thị thông báo thành công
        onSubmitSuccess(tableData);
        toast.success(
          editingTable
            ? `Cập nhật bàn số ${tableData.table_number} thành công`
            : `Thêm bàn số ${tableData.table_number} thành công`
        );

        handleClose();
      } catch (error) {
        console.error("Error saving table:", error.message, error);
        toast.error(
          editingTable ? "Cập nhật bàn không thành công" : "Thêm bàn không thành công"
        );
      } finally {
        setLoading(false);
      }
    },
    [editingTable, onSubmitSuccess]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return {
    control,
    handleSubmit,
    reset,
    handleFormSubmit,
    handleClose,
    areas,
    loading,
    errors,
  };
};

export default TableFormModalViewModel;