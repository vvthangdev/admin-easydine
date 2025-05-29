import React from "react";
import { Modal, Button, Tooltip, List, Typography } from "@mui/material";
import OrderFormModalView from "../../OrderFormModal/OrderFormModalView";
import TableCardViewModel from "./TableCardViewModel";
import moment from "moment";

const TableCardView = ({ table, onRelease, tables, onMergeSuccess, onOrderSuccess }) => {
  const {
    isMergeModalVisible,
    setIsMergeModalVisible,
    isOrderModalVisible,
    setIsOrderModalVisible,
    editingOrder,
    calculateServingTime,
    getTableImage,
    getVietnameseStatus,
    getSourceTables,
    handleCardClick,
    handleOrderSubmit,
    handleMergeOrder,
    setEditingOrder,
    
  } = TableCardViewModel({ table, onRelease, tables, onMergeSuccess, onOrderSuccess });

  return (
    <>
      <Tooltip
        title={
          <div
            style={{
              padding: 8,
              background: "#fff",
              borderRadius: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2" color="text.primary">
              <strong>Số bàn:</strong> {table.table_number}
            </Typography>
            <Typography variant="body2" color="text.primary">
              <strong>Sức chứa:</strong> {table.capacity}
            </Typography>
            <Typography variant="body2" color="text.primary">
              <strong>Trạng thái:</strong> {getVietnameseStatus(table.status)}
            </Typography>
            {(table.status === "Reserved" || table.status === "Occupied") && (
              <Typography variant="body2" color="text.primary">
                <strong>Thời gian:</strong>{" "}
                {calculateServingTime(table.start_time, table.status)}
              </Typography>
            )}
            {table.same_order_tables && (
              <Typography variant="body2" color="text.primary">
                <strong>Bàn gộp:</strong> Bàn{" "}
                {table.same_order_tables.join(", ")} (Đơn #{table.order_number})
              </Typography>
            )}
            <Typography variant="body2" color="text.primary">
              <strong>Bắt đầu:</strong>{" "}
              {table.start_time
                ? moment.utc(table.start_time).local().format("HH:mm, DD/MM/YYYY")
                : "-"}
            </Typography>
            <Typography variant="body2" color="text.primary">
              <strong>Kết thúc:</strong>{" "}
              {table.end_time
                ? moment.utc(table.end_time).local().format("HH:mm, DD/MM/YYYY")
                : "-"}
            </Typography>
          </div>
        }
      >
        <div
          onClick={handleCardClick}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: 16,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s",
            cursor: "pointer",
            width: 250,
            height: 200,
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={getTableImage(table.status)}
                alt={`Table ${table.status}`}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Typography variant="h6" color="text.primary">
                Bàn {table.table_number}
              </Typography>
              {(table.status === "Reserved" || table.status === "Occupied") && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ maxHeight: 20, overflow: "hidden" }}
                >
                  {calculateServingTime(table.start_time, table.status)}
                </Typography>
              )}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {(table.status === "Reserved" || table.status === "Occupied") ? (
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onRelease();
                }}
                fullWidth
              >
                Trả bàn
              </Button>
            ) : (
              <div style={{ height: 36 }} />
            )}
          </div>
        </div>
      </Tooltip>

      <Modal
        open={isMergeModalVisible}
        onClose={() => setIsMergeModalVisible(false)}
        aria-labelledby="merge-modal-title"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            background: "#fff",
            borderRadius: 8,
            padding: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <Typography id="merge-modal-title" variant="h6" gutterBottom>
            Chọn bàn nguồn để ghép đơn
          </Typography>
          <List>
            {getSourceTables(tables, table.reservation_id).map((sourceTable) => (
              <div
                key={sourceTable.table_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <div>
                  <Typography variant="body1">
                    <strong>Bàn {sourceTable.table_number}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Đơn #{sourceTable.order_number}
                  </Typography>
                  <Typography variant="body2">
                    Bàn gộp:{" "}
                    {sourceTable.same_order_tables
                      ? sourceTable.same_order_tables.join(", ")
                      : "Không có"}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleMergeOrder(
                      sourceTable,
                      tables,
                      table,
                      onMergeSuccess,
                      setIsMergeModalVisible
                    )
                  }
                >
                  Ghép đơn
                </Button>
              </div>
            ))}
          </List>
          <Button
            variant="outlined"
            onClick={() => setIsMergeModalVisible(false)}
            fullWidth
            style={{ marginTop: 16 }}
          >
            Đóng
          </Button>
        </div>
      </Modal>

      <OrderFormModalView
        visible={isOrderModalVisible}
        editingOrder={editingOrder}
        selectedCustomer={
          editingOrder?.customer_id ? { _id: editingOrder.customer_id } : null
        }
        onCancel={() => {
          setIsOrderModalVisible(false);
          setEditingOrder(null);
        }}
        onSubmit={handleOrderSubmit}
        table={table}
      />
    </>
  );
};

export default TableCardView;