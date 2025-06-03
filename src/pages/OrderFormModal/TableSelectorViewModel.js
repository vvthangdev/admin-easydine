import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { tableAPI } from "../../services/apis/Table";
import moment from "moment";

const TableSelectorViewModel = ({ formData, onFormDataChange }) => {
  const [allTables, setAllTables] = useState([]); // Lưu toàn bộ danh sách bàn
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchAvailableTables = useCallback(async () => {
    if (!formData.date || !formData.start_time || !formData.end_time) {
      console.warn("Invalid formData:", formData);
      toast.error("Vui lòng điền đầy đủ ngày và giờ");
      return;
    }
    const isValidDate = moment(formData.date, "DD/MM/YYYY", true).isValid();
    const isValidStartTime = moment(formData.start_time, "HH:mm", true).isValid();
    const isValidEndTime = moment(formData.end_time, "HH:mm", true).isValid();
    if (!isValidDate || !isValidStartTime || !isValidEndTime) {
      console.warn("Invalid date or time format:", formData);
      toast.error("Định dạng ngày hoặc giờ không hợp lệ");
      return;
    }
    const startDateTime = moment(
      `${formData.date} ${formData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${formData.date} ${formData.end_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    if (startDateTime.isSameOrAfter(endDateTime)) {
      console.warn("Invalid time range:", { startDateTime, endDateTime });
      toast.error("Thời gian bắt đầu phải trước thời gian kết thúc");
      return;
    }
    setLoading(true);
    try {
      const response = await tableAPI.getAvailableTables({
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      });
      console.log("Available tables response:", response);
      const tables = Array.isArray(response) ? response : [];
      setAllTables(tables);
      setTotalPages(Math.ceil(tables.length / limit));
    } catch (error) {
      console.error("Error fetching available tables:", error);
      toast.error("Không thể tải danh sách bàn trống");
      setAllTables([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [formData.date, formData.start_time, formData.end_time, limit]);

  const groupedTables = useMemo(() => {
    const tables = Array.isArray(allTables) ? [...allTables] : [];
    if (Array.isArray(formData.tables)) {
      formData.tables.forEach((tableId) => {
        if (!tables.some((table) => table._id === tableId)) {
          tables.push({
            _id: tableId,
            table_number: `Bàn ${tableId}`,
            area: "Không xác định",
            capacity: 0,
          });
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
    console.log("Grouped tables:", grouped);
    return grouped;
  }, [allTables, formData.tables]);

  const paginatedTables = useMemo(() => {
    if (!groupedTables[currentTab]) return [];
    const startIndex = (page - 1) * limit;
    return groupedTables[currentTab].slice(startIndex, startIndex + limit);
  }, [groupedTables, currentTab, page, limit]);

  const handleTableChange = useCallback(
    (area, value) => {
      const selectedTableIds = value
        .map((tableKey) => {
          const [, , tableId] = tableKey.split("|");
          return tableId;
        })
        .filter((id) => id !== null);

      const newFormData = {
        ...formData,
        tables: [
          ...formData.tables.filter((tableId) => {
            const table = allTables.find((t) => t._id === tableId);
            return table && table.area !== area;
          }),
          ...selectedTableIds,
        ],
        type: selectedTableIds.length > 0 || formData.tables.filter((tableId) => {
        const table = allTables.find((t) => t._id === tableId);
        return table && table.area !== area;
      }).length > 0 ? "reservation" : "takeaway",
      };
      onFormDataChange(newFormData);
    },
    [formData, allTables, onFormDataChange]
  );

  useEffect(() => {
    fetchAvailableTables();
  }, [fetchAvailableTables]);

  useEffect(() => {
    const areas = Object.keys(groupedTables);
    if (areas.length > 0 && !areas.includes(currentTab)) {
      setCurrentTab(areas[0]);
      setPage(1);
    }
  }, [groupedTables, currentTab]);

  return {
    groupedTables,
    paginatedTables,
    loading,
    currentTab,
    setCurrentTab,
    handleTableChange,
    page,
    setPage,
    totalPages,
  };
};

export default TableSelectorViewModel;