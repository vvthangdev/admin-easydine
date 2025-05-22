import React from "react";
import {
  Modal,
  Box,
  Button,
  Grid,
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

const OrderFormModalView = ({ visible, editingOrder, selectedCustomer, onCancel, onSubmit, table }) => {
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
  } = OrderFormModalViewModel({ visible, editingOrder, selectedCustomer, onCancel, onSubmit, table });

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
              sx={{
                p: 2,
                borderRight: { md: "1px solid", borderColor: "divider" },
                overflowY: "auto",
                width: { xs: "100%", md: "50%" },
              }}
            >
              {showItemSelector ? (
                <ItemSelectorView
                  setSelectedItems={setSelectedItems}
                  menuItems={menuItems}
                  setMenuItems={setMenuItems}
                  sx={{ maxWidth: "100%", width: "100%" }}
                />
              ) : (
                <OrderBasicInfoView
                  formData={formData}
                  setFormData={setFormData}
                  availableTables={availableTables}
                  fetchAvailableTables={fetchAvailableTables}
                  isTableAvailable={table?.status === "Available"}
                  editingOrder={editingOrder}
                />
              )}
            </Grid>
            <Grid
              sx={{
                p: 2,
                overflowY: "auto",
                width: { xs: "100%", md: "50%" },
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
                        <Button
                          variant="contained"
                          color="info"
                          onClick={handleOpenPaymentModal}
                          disabled={loading}
                          sx={{ minWidth: 100 }}
                        >
                          Thanh Toán
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>
              <SelectedItemsView
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
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {editingOrder ? "Cập nhật" : "Thêm"}
            </Button>
          </Box>
        </Box>
      </Modal>
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