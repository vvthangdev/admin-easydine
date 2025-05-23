import { useEffect, useMemo, useState } from "react";
import { adminAPI } from "../../services/apis/Admin"; // Thay userAPI bằng adminAPI
import moment from "moment";

const OrderBasicInfoViewModel = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
}) => {
  const [staffList, setStaffList] = useState([]);

  const fetchStaffList = async () => {
    try {
      const response = await adminAPI.getAllStaff(); // Sử dụng adminAPI
      setStaffList(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      setStaffList([]);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    if (formData.date && formData.start_time && formData.end_time) {
      const startDateTime = moment(
        `${formData.date} ${formData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${formData.date} ${formData.end_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      fetchAvailableTables(
        formData.date,
        startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
      );
    }
  }, [formData.date, formData.start_time, formData.end_time, fetchAvailableTables]);

  // Gộp availableTables và bàn đã chọn từ formData.tables
  const groupedTables = useMemo(() => {
    const tables = Array.isArray(availableTables) ? [...availableTables] : [];

    // Thêm các bàn đã chọn từ formData.tables nếu chưa có trong availableTables
    if (Array.isArray(formData.tables) && formData.reservedTables) {
      formData.tables.forEach((tableId) => {
        if (!tables.some((table) => table._id === tableId)) {
          const reservedTable = formData.reservedTables.find(
            (rt) => rt.table_id === tableId
          );
          if (reservedTable) {
            tables.push({
              _id: reservedTable.table_id,
              table_number: reservedTable.table_number,
              area: reservedTable.area || "Không xác định",
              capacity: reservedTable.capacity || 0,
            });
          }
        }
      });
    }

    // Nhóm bàn theo khu vực
    return tables.reduce((acc, table) => {
      const area = table.area || "Không xác định";
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(table);
      return acc;
    }, {});
  }, [availableTables, formData.tables, formData.reservedTables]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (area, value) => {
    const selectedTableIds = value
      .map((tableKey) => {
        const [, , tableId] = tableKey.split("|");
        return tableId;
      })
      .filter((id) => id !== null);

    // Cập nhật formData.tables, giữ các bàn ở khu vực khác
    setFormData((prev) => {
      const tables = Array.isArray(prev.tables) ? prev.tables : [];
      const otherAreaTableIds = tables.filter((tableId) => {
        const table = (Array.isArray(availableTables) ? availableTables : []).concat(
          prev.reservedTables || []
        ).find((t) => t._id === tableId || t.table_id === tableId);
        return table && table.area !== area;
      });
      return {
        ...prev,
        tables: [...otherAreaTableIds, ...selectedTableIds],
      };
    });
  };

  // Tính toán hóa đơn từ formData.items
  const subtotal = useMemo(() => {
    const items = Array.isArray(formData.items) ? formData.items : [];
    return items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [formData.items]);

  const vat = useMemo(() => {
    return Math.round(subtotal * 0.1);
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + vat;
  }, [subtotal, vat]);

  return {
    staffList,
    groupedTables,
    handleChange,
    handleTableChange,
    subtotal,
    vat,
    total,
  };
};

export default OrderBasicInfoViewModel;