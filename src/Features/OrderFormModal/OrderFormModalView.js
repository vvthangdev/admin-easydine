import React from "react";
import {
  Modal,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import OrderBasicInfoView from "./OrderBasicInfoView";
import ItemSelectorView from "./ItemSelectorView";
import SelectedItemsView from "./SelectedItemsView";
import MergeOrderModalView from "../OrderUpdate/MergeOrderModalView";
import SplitOrderModalView from "../OrderUpdate/SplitOrderModalView";
import PaymentModal from "./PaymentModal";
import OrderFormModalViewModel from "./OrderFormModalViewModel";

const OrderFormModalView = ({
  visible,
  editingOrder,
  selectedCustomer,
  onCancel,
  onSubmit,
  table,
}) => {
  const {
    availableTables,
    selectedItems,
    setSelectedItems,
    menuItems,
    setMenuItems,
    formData,
    setFormData,
    loading,
    showItemSelector,
    splitModalVisible,
    mergeModalVisible,
    paymentModalVisible,
    orderDetails,
    currentOrderId,
    targetOrder,
    fetchAvailableTables,
    handleModalOk,
    handleAddItemClick,
    handleDoneSelectingItems,
    handleSplitSuccess,
    handleMergeSuccess,
    handlePaymentSuccess,
    handleOpenSplitModal,
    handleOpenMergeModal,
    handleOpenPaymentModal,
    handleConfirmOrder,
    handleCancelOrder,
    handleCancelAddItems,
    setMergeModalVisible,
    setSplitModalVisible,
    setPaymentModalVisible,
  } = OrderFormModalViewModel({
    visible,
    editingOrder,
    selectedCustomer,
    onCancel,
    onSubmit,
    table,
  });

  const isNewOrEmptyTable = !editingOrder || table?.status === "Available";
  const isPending = formData.status === "pending";

  return (
    <>
      <Modal
        open={visible}
        onClose={showItemSelector ? handleCancelAddItems : onCancel}
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
          {/* Header */}
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography variant="h6">
              {editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={showItemSelector ? handleCancelAddItems : onCancel}
              disabled={loading}
              sx={{ minWidth: 80, fontSize: "0.875rem" }}
            >
              Hủy
            </Button>
          </Box>

          {/* Nội dung chính, hỗ trợ cuộn */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {showItemSelector ? (
              <>
                <Box
                  sx={{
                    width: "50%", // Cố định 50%
                    p: 1,
                    overflowY: "auto",
                    height: "100%",
                    borderRight: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ItemSelectorView
                    setSelectedItems={setSelectedItems}
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                    sx={{ maxWidth: "100%", width: "100%" }}
                    availableTables={availableTables}
                    selectedTables={formData.tables}
                    setFormData={setFormData}
                    defaultTable={table}
                    fetchAvailableTables={fetchAvailableTables}
                    isExistingOrder={!!editingOrder}
                  />
                </Box>
                <Box
                  sx={{
                    width: "50%", // Cố định 50%
                    p: 1,
                    overflowY: "auto",
                    height: "100%",
                  }}
                >
                  <SelectedItemsView
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    menuItems={menuItems}
                    readOnly={false}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  p: 1,
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <OrderBasicInfoView
                  formData={formData}
                  setFormData={setFormData}
                  availableTables={availableTables}
                  fetchAvailableTables={fetchAvailableTables}
                  isTableAvailable={table?.status === "Available"}
                  editingOrder={editingOrder}
                />
              </Box>
            )}
          </Box>

          {/* Footer nút chính */}
          <Box
            sx={{
              p: 1,
              bgcolor: "background.default",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            {showItemSelector ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleDoneSelectingItems}
                disabled={loading}
                sx={{ minWidth: 80, fontSize: "0.875rem" }}
              >
                Xong
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalOk}
                disabled={loading}
                sx={{ minWidth: 80, fontSize: "0.875rem" }}
                startIcon={loading && <CircularProgress size={16} color="inherit" />}
              >
                Cập nhật
              </Button>
            )}
          </Box>

          {/* Footer nút hành động phụ */}
          {!showItemSelector && (
            <Box
              sx={{
                p: 1,
                bgcolor: "background.default",
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
                borderTop: "1px solid",
                borderColor: "divider",
                flexShrink: 0,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddItemClick}
                disabled={loading}
                sx={{ minWidth: 80, fontSize: "0.875rem" }}
              >
                Thêm Món
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleOpenSplitModal}
                disabled={loading}
                sx={{ minWidth: 80, fontSize: "0.875rem" }}
              >
                Tách Đơn
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenMergeModal}
                disabled={loading}
                sx={{ minWidth: 80, fontSize: "0.875rem" }}
              >
                Gộp Đơn
              </Button>
              {isPending ? (
                <>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    sx={{ minWidth: 80, fontSize: "0.875rem" }}
                  >
                    Xác Nhận
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancelOrder}
                    disabled={loading}
                    sx={{ minWidth: 80, fontSize: "0.875rem" }}
                  >
                    Hủy Đơn
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleOpenPaymentModal}
                  disabled={loading}
                  sx={{ minWidth: 80, fontSize: "0.875rem" }}
                >
                  Thanh Toán
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Modal con */}
      <SplitOrderModalView
        visible={splitModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setSplitModalVisible(false)}
        onSuccess={handleSplitSuccess}
        zIndex={1001}
      />
      <MergeOrderModalView
        visible={mergeModalVisible}
        targetOrder={targetOrder}
        onCancel={() => setMergeModalVisible(false)}
        onSuccess={handleMergeSuccess}
        zIndex={1001}
      />
      <PaymentModal
        visible={paymentModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setPaymentModalVisible(false)}
        onConfirm={handlePaymentSuccess}
        zIndex={1001}
      />
    </>
  );
};

export default OrderFormModalView;