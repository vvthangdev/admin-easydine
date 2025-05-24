import { useEffect, useMemo, useState, useCallback } from "react";
import { adminAPI } from "../../services/apis/Admin";
import { voucherAPI } from "../../services/apis/Voucher";
import moment from "moment";
import { toast } from "react-toastify";

const OrderBasicInfoViewModel = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [voucherData, setVoucherData] = useState(null);

  const fetchStaffList = async () => {
    try {
      const response = await adminAPI.getAllStaff();
      setStaffList(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      setStaffList([]);
    }
  };

  const applyVoucher = useCallback(async (voucherCode, orderId) => {
    try {
      const response = await voucherAPI.applyVoucher(voucherCode, orderId);
      setVoucherData(response);
      toast.success("Áp dụng voucher thành công");
      setFormData((prev) => ({
        ...prev,
        voucherCode,
        voucherId: response.voucherId,
        discountAmount: response.discountAmount,
        finalAmount: response.finalAmount,
      }));
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error(error.message || "Không thể áp dụng voucher");
    }
  }, [setFormData]);

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

  const groupedTables = useMemo(() => {
    const tables = Array.isArray(availableTables) ? [...availableTables] : [];

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

    const grouped = tables.reduce((acc, table) => {
      const area = table.area || "Không xác định";
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(table);
      return acc;
    }, {});
    console.log("OrderBasicInfoViewModel: groupedTables:", grouped);
    return grouped;
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

    setFormData((prev) => {
      const tables = Array.isArray(prev.tables) ? prev.tables : [];
      const otherAreaTableIds = tables.filter((tableId) => {
        const table = (Array.isArray(availableTables) ? availableTables : []).concat(
          prev.reservedTables || []
        ).find((t) => t._id === tableId || t.table_id === tableId);
        return table && table.area !== area;
      });
      const newTables = [...otherAreaTableIds, ...selectedTableIds];
      console.log("handleTableChange: area:", area, "selectedTableIds:", selectedTableIds, "newTables:", newTables);
      return {
        ...prev,
        tables: newTables,
      };
    });
  };

  const subtotal = useMemo(() => {
    const items = Array.isArray(formData.items) ? formData.items : [];
    return items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [formData.items]);

  const total = useMemo(() => {
    if (voucherData && formData.voucherId) {
      return formData.finalAmount || subtotal;
    }
    return subtotal;
  }, [subtotal, voucherData, formData.voucherId, formData.finalAmount]);

  return {
    staffList,
    groupedTables,
    handleChange,
    handleTableChange,
    subtotal,
    total,
    applyVoucher,
    voucherData,
  };
};

export default OrderBasicInfoViewModel;