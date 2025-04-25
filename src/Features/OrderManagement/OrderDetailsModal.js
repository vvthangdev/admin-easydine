import React from "react";
import { Modal, Button } from "antd";
import moment from "moment";

const OrderDetailsModal = ({ visible, orderDetails, onCancel }) => {
  return (
    <Modal
      title="Chi Tiết Đơn Hàng"
      open={visible}
      onCancel={onCancel}
      className="rounded-xl"
      footer={[
        <Button
          key="close"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
        >
          Đóng
        </Button>,
      ]}
      width="50vw"
    >
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl max-h-[80vh] overflow-y-auto">
        {orderDetails ? (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thông Tin Đơn Hàng</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                <p><span className="font-medium text-gray-900">Mã Đơn Hàng:</span> {orderDetails.order?.id || orderDetails._id || "N/A"}</p>
                <p><span className="font-medium text-gray-900">Mã Khách Hàng:</span> {orderDetails.order?.customer_id || orderDetails.customer_id || "N/A"}</p>
                <p><span className="font-medium text-gray-900">Ngày:</span> {orderDetails.order?.time || orderDetails.time ? moment.utc(orderDetails.order?.time || orderDetails.time).format("DD/MM/YYYY") : "N/A"}</p>
                <p><span className="font-medium text-gray-900">Thời gian bắt đầu:</span> {orderDetails.reservedTables?.[0]?.start_time ? moment.utc(orderDetails.reservedTables[0].start_time).format("HH:mm") : "N/A"}</p>
                <p><span className="font-medium text-gray-900">Thời gian kết thúc:</span> {orderDetails.reservedTables?.[0]?.end_time ? moment.utc(orderDetails.reservedTables[0].end_time).format("HH:mm") : "N/A"}</p>
                <p><span className="font-medium text-gray-900">Loại:</span> {orderDetails.order?.type || orderDetails.type || "N/A"}</p>
                <p><span className="font-medium text-gray-900">Trạng Thái:</span> {orderDetails.order?.status || orderDetails.status || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Danh Sách Bàn Đặt</h3>
              {orderDetails.reservedTables?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
                  {orderDetails.reservedTables.map((table) => (
                    <li key={table._id}>
                      <span className="font-medium text-gray-900">Bàn:</span> {table.table_id || "N/A"}, <span className="font-medium text-gray-900">Thời gian:</span> {table.start_time && table.end_time ? `${moment.utc(table.start_time).format("HH:mm, DD/MM/YYYY")} - ${moment.utc(table.end_time).format("HH:mm, DD/MM/YYYY")}` : "N/A"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">Không có bàn đặt nào.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Danh Sách Mặt Hàng</h3>
              {orderDetails.itemOrders?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {orderDetails.itemOrders.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-row items-start border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="aspect-square w-16 h-16 mr-3">
                        <img
                          src={item.itemImage || "https://via.placeholder.com/80"}
                          alt={item.itemName || "Item"}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col text-xs text-gray-600">
                        <p><span className="font-medium text-gray-900">Tên:</span> {item.itemName || "N/A"}</p>
                        <p><span className="font-medium text-gray-900">Kích thước:</span> {item.size || "Mặc định"}</p>
                        <p><span className="font-medium text-gray-900">Ghi chú:</span> {item.note || "Không có"}</p>
                        <p><span className="font-medium text-gray-900">Giá:</span> {item.itemPrice ? item.itemPrice.toLocaleString() : "N/A"} VND</p>
                        <p><span className="font-medium text-gray-900">Số Lượng:</span> {item.quantity || "N/A"}</p>
                        <p><span className="font-medium text-gray-900">Tổng Tiền:</span> {item.itemPrice && item.quantity ? (item.itemPrice * item.quantity).toLocaleString() : "N/A"} VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Không có mặt hàng nào được đặt.</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Tính Tổng Hóa Đơn</h3>
              <div className="text-sm text-gray-600 mt-2">
                {(() => {
                  const totalAmount =
                    orderDetails.itemOrders?.reduce(
                      (acc, item) => acc + (item.itemPrice || 0) * (item.quantity || 0),
                      0
                    ) || 0;
                  const vat = totalAmount * 0.1;
                  const grandTotal = totalAmount + vat;
                  return (
                    <>
                      <p><span className="font-medium text-gray-900">Tổng Tiền:</span> {totalAmount.toLocaleString()} VND</p>
                      <p><span className="font-medium text-gray-900">VAT (10%):</span> {vat.toLocaleString()} VND</p>
                      <p className="font-semibold text-blue-600"><span className="font-medium text-gray-900">Tổng Cộng:</span> {grandTotal.toLocaleString()} VND</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Đang tải thông tin chi tiết...</p>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;