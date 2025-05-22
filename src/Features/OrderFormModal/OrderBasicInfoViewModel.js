import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { userAPI } from "../../services/apis/User";

const OrderBasicInfoViewModel = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
  editingOrder,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [activeTab, setActiveTab] = useState("Tầng 1");

  useEffect(() => {
    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const users = await userAPI.getAllUser();
        const staffArray = Array.isArray(users) ? users : [];
        setStaffList(staffArray);
        if (formData.staff_id && !staffArray.find((staff) => staff._id === formData.staff_id)) {
          setFormData((prev) => ({ ...prev, staff_id: "" }));
        }
      } catch (error) {
        console.error("Error fetching staff list:", error);
        toast.error("Không thể tải danh sách nhân viên");
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaffList();
  }, []);

  const groupedTables = availableTables.reduce((acc, table) => {
    const area = table.area || "Không xác định";
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(table);
    return acc;
  }, {});

  const handleChange = (field, value) => {
    console.log("handleChange called:", { field, value });
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      newData.end_time = "23:59";

      if (newData.date && newData.start_time) {
        const isValidDate = moment(newData.date, "DD/MM/YYYY", true).isValid();
        const isValidStartTime = moment(newData.start_time, "HH:mm", true).isValid();
        if (!isValidDate || !isValidStartTime) {
          console.error("Invalid date or start time format");
          return newData;
        }

        const startDateTime = moment(
          `${newData.date} ${newData.start_time}`,
          "DD/MM/YYYY HH:mm"
        ).utc();
        const endDateTime = moment(
          `${newData.date} 23:59`,
          "DD/MM/YYYY HH:mm"
        ).utc();

        if (!endDateTime.isValid()) {
          console.error("Invalid end time format");
          return newData;
        }

        fetchAvailableTables(
          newData.date,
          startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
        );
      }

      console.log("New formData:", newData);
      return newData;
    });
  };

  const handleTableChange = (area, value) => {
    const selectedTableIds = value.map((tableKey) => {
      const [tableNumber, tableArea] = tableKey.split("|");
      const table = availableTables.find(
        (t) => t.table_number === parseInt(tableNumber) && t.area === tableArea
      );
      return table ? table._id : null;
    }).filter((id) => id !== null);

    setFormData((prev) => {
      const otherAreaTableIds = prev.tables.filter((tableId) => {
        const table = availableTables.find((t) => t._id === tableId);
        return table && table.area !== area;
      });
      return {
        ...prev,
        tables: [...otherAreaTableIds, ...selectedTableIds],
      };
    });
  };

  return {
    staffList,
    loadingStaff,
    activeTab,
    setActiveTab,
    groupedTables,
    handleChange,
    handleTableChange,
  };
};

export default OrderBasicInfoViewModel;