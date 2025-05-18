import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  Button,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import MergeOrderModal from "../OrderUpdate/MergeOrderModal";
import SplitOrderModal from "../OrderUpdate/SplitOrderModal";

const OrderFormModal = ({
  visible,
  editingOrder,
  selectedCustomer,
  onCancel,
  onSubmit,
  table,
}) => {
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    type: "reservation",
    status: table?.status === "Available" ? "pending" : "pending",
    date: moment().format("DD/MM/YYYY"),
    start_time: moment().format("HH:mm"),
    end_time: "23:59",
    tables: table ? [table.table_id] : [],
  });
  const [loading, setLoading] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const fetchAvailableTables = useCallback(async (date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return;
    setLoading(true);
    try {
      const response = await tableAPI.getAvailableTables({
        start_time: startTime,
        end_time: endTime,
      });
      setAvailableTables(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching available tables:", error);
      toast.error("Không thể tải danh sách bàn trống");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = useCallback(async () => {
    if (!editingOrder) return;
    setLoading(true);
    try {
      const data = await orderAPI.getOrderInfo({ id: editingOrder.id });

      const reservedTables =
        data.reservedTables?.map((table) => ({
          _id: table.table_id,
          table_id: table.table_id,
          table_number: table.table_number,
          area: table.area,
          capacity: table.capacity,
          status: table.status,
          start_time: table.start_time,
          end_time: table.end_time,
        })) || [];

      const items =
        data.itemOrders?.map((item) => ({
          id: item.item_id,
          name: item.itemName,
          price: item.itemPrice,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
          itemName: item.itemName,
          itemImage: item.itemImage || "https://via.placeholder.com/80",
          itemPrice: item.itemPrice,
        })) || [];

      const newFormData = {
        type: data.order?.type || "reservation",
        status: data.order?.status || "pending",
        staff_id: data.order?.staff_id || undefined,
        date: moment
          .utc(data.order?.time || editingOrder.time)
          .local()
          .format("DD/MM/YYYY"),
        start_time: data.reservedTables?.[0]
          ? moment
              .utc(data.reservedTables[0].start_time)
              .local()
              .format("HH:mm")
          : moment
              .utc(data.order?.time || editingOrder.time)
              .local()
              .format("HH:mm"),
        end_time: "23:59",
        tables: reservedTables.map((table) => table._id),
      };

      setFormData(newFormData);
      setSelectedItems(items);
      setOrderDetails({
        ...data,
        order: {
          ...data.order,
          id: editingOrder.id,
          customer_id: editingOrder.customerId,
          time: editingOrder.time,
        },
      });
      setCurrentOrderId(editingOrder.id);

      const startDateTime = moment(
        `${newFormData.date} ${newFormData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${newFormData.date} 23:59`,
        "DD/MM/YYYY HH:mm"
      ).utc();

      const response = await tableAPI.getAvailableTables({
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      });

      const availableTablesFromAPI = Array.isArray(response) ? response : [];
      const existingTableIds = availableTablesFromAPI.map((table) => table._id);
      const additionalReservedTables = reservedTables.filter(
        (table) => !existingTableIds.includes(table._id)
      );
      const mergedTables = [...availableTablesFromAPI, ...additionalReservedTables];

      setAvailableTables(mergedTables);
    } catch (error) {
      console.error("Error loading order for edit:", error);
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [editingOrder]);

  const resetForm = useCallback(() => {
    const now = moment();
    const newFormData = {
      date: now.format("DD/MM/YYYY"),
      start_time: now.format("HH:mm"),
      end_time: "23:59",
      type: "reservation",
      status: table?.status === "Available" ? "pending" : "pending",
      tables: table ? [table.table_id] : [],
    };
    setFormData(newFormData);
    setSelectedItems([]);
    setAvailableTables([]);
    setMenuItems([]);
    setShowItemSelector(false);
    setOrderDetails(null);
    setCurrentOrderId(null);

    const startDateTime = moment(
      `${newFormData.date} ${newFormData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${newFormData.date} 23:59`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    fetchAvailableTables(
      newFormData.date,
      startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
    );
  }, [table, fetchAvailableTables]);

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        fetchOrderDetails();
      } else {
        resetForm();
      }
    }
  }, [visible, editingOrder, fetchOrderDetails, resetForm]);

  const handleModalOk = async () => {
    const isValidDate = moment(formData.date, "DD/MM/YYYY", true).isValid();
    const isValidStartTime = moment(formData.start_time, "HH:mm", true).isValid();
    const isValidEndTime = moment(formData.end_time, "HH:mm", true).isValid();

    if (
      !formData.type ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (!isValidDate || !isValidStartTime || !isValidEndTime) {
      toast.error("Định dạng ngày hoặc giờ không hợp lệ");
      return;
    }
    if (
      formData.type === "reservation" &&
      (!formData.tables || formData.tables.length === 0)
    ) {
      toast.error("Vui lòng chọn ít nhất một bàn");
      return;
    }
    if (!selectedItems || selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một món ăn");
      return;
    }

    setLoading(true);
    try {
      const startDateTime = moment(
        `${formData.date} ${formData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${formData.date} ${formData.end_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();

      const orderData = {
        id: editingOrder ? editingOrder.id : undefined,
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        type: formData.type,
        status: formData.status,
        tables: formData.tables || [],
        items: selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
        })),
        customer_id: selectedCustomer?._id,
        staff_id: formData.staff_id || null,
      };

      const response = await onSubmit(orderData);
      if (!editingOrder && response?._id) {
        setCurrentOrderId(response._id);
        setOrderDetails({
          order: {
            id: response._id,
            customer_id: selectedCustomer?._id,
            time: startDateTime.toISOString(),
            type: formData.type,
            status: formData.status,
          },
          reservedTables: formData.tables.map((tableId) => ({
            table_id: tableId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
          })),
          itemOrders: selectedItems.map((item) => ({
            item_id: item.id,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            itemImage: item.itemImage,
            quantity: item.quantity,
            size: item.size || null,
            note: item.note || "",
          })),
        });
      }

      if (!splitModalVisible && !mergeModalVisible) {
        setFormData({});
        setSelectedItems([]);
        setAvailableTables([]);
        setMenuItems([]);
        setShowItemSelector(false);
        setCurrentOrderId(null);
        setOrderDetails(null);
        onCancel();
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemClick = () => {
    setShowItemSelector(true);
  };

  const handleDoneSelectingItems = () => {
    setShowItemSelector(false);
  };

  const handleSplitSuccess = () => {
    if (editingOrder || currentOrderId) {
      fetchOrderDetails();
      onSubmit({ id: currentOrderId || editingOrder.id });
    }
  };

  const handleMergeSuccess = () => {
    if (editingOrder || currentOrderId) {
      fetchOrderDetails();
      onSubmit({ id: currentOrderId || editingOrder.id });
    }
  };

  const handleOpenSplitModal = async () => {
    if (!currentOrderId && !editingOrder) {
      toast.info("Vui lòng lưu đơn hàng trước khi tách!");
      await handleModalOk();
      if (currentOrderId) {
        setSplitModalVisible(true);
      }
    } else {
      setSplitModalVisible(true);
    }
  };

  const handleOpenMergeModal = async () => {
    if (!currentOrderId && !editingOrder) {
      toast.info("Vui lòng lưu đơn hàng trước khi gộp!");
      await handleModalOk();
      if (currentOrderId) {
        setMergeModalVisible(true);
      }
    } else {
      setMergeModalVisible(true);
    }
  };

  return (
    <>
      <Modal
        open={visible}
        onClose={onCancel}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            width: { xs: "95vw", md: "90vw" },
            height: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={onCancel}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Hủy
            </Button>
          </Box>
          <Grid container sx={{ flex: 1, overflow: "hidden" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: 2,
                borderRight: { md: "1px solid", borderColor: "divider" },
                overflowY: "auto",
                maxWidth: { md: "50%" },
                width: { md: "50%" },
              }}
            >
              {showItemSelector ? (
                <ItemSelector
                  setSelectedItems={setSelectedItems}
                  menuItems={menuItems}
                  setMenuItems={setMenuItems}
                  sx={{ maxWidth: "100%", width: "100%" }}
                />
              ) : (
                <OrderBasicInfo
                  formData={formData}
                  setFormData={setFormData}
                  availableTables={availableTables}
                  fetchAvailableTables={fetchAvailableTables}
                  isTableAvailable={table?.status === "Available"}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: 2,
                overflowY: "auto",
                maxWidth: { md: "50%" },
                width: { md: "50%" },
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                {showItemSelector ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDoneSelectingItems}
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                  >
                    Xong
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddItemClick}
                      disabled={loading}
                      sx={{ minWidth: 100 }}
                    >
                      Thêm Món
                    </Button>
                    {formData.type === "reservation" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleOpenSplitModal}
                          disabled={loading}
                          sx={{ minWidth: 100 }}
                        >
                          Tách Đơn
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleOpenMergeModal}
                          disabled={loading}
                          sx={{ minWidth: 100 }}
                        >
                          Gộp Đơn
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>
              <SelectedItems
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                menuItems={menuItems}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOk}
              disabled={loading}
              sx={{ minWidth: 100 }}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {editingOrder ? "Cập nhật" : "Thêm"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <SplitOrderModal
        visible={splitModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setSplitModalVisible(false)}
        onSuccess={handleSplitSuccess}
        zIndex={1001}
      />
      <MergeOrderModal
        visible={mergeModalVisible}
        targetOrder={{ id: currentOrderId || editingOrder?.id }}
        onCancel={() => setMergeModalVisible(false)}
        onSuccess={handleMergeSuccess}
        zIndex={1001}
      />
    </>
  );
};

export default OrderFormModal;