import React from "react";
import moment from "moment";
import { getVietnameseStatus } from "./TableCardUtils";

const TableCardDetails = ({ orderData, customerInfo, staffName }) => {
  // Kiểm tra nếu orderData là null hoặc undefined
  if (!orderData) {
    return <p>Không có thông tin đơn hàng.</p>;
  }

  // Kiểm tra nếu orderData.order không tồn tại
  if (!orderData.order) {
    return <p>Thông tin đơn hàng không hợp lệ.</p>;
  }

  return (
    <div className="flex gap-6">
      {/* Cột trái: Thông tin đơn hàng và danh sách bàn đặt */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thông Tin Đơn Hàng</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
            <p>
              <span className="font-medium text-gray-900">Mã Đơn Hàng:</span>{" "}
              #{orderData.order.id.slice(-4)}
            </p>
            <p>
              <span className="font-medium text-gray-900">Tên Khách Hàng:</span>{" "}
              {customerInfo.name}
            </p>
            <p>
              <span className="font-medium text-gray-900">Ngày:</span>{" "}
              {moment.utc(orderData.order.time).local().format("DD/MM/YYYY")}
            </p>
            <p>
              <span className="font-medium text-gray-900">Số Điện Thoại:</span>{" "}
              {customerInfo.phone}
            </p>
            <p>
              <span className="font-medium text-gray-900">Thời gian bắt đầu:</span>{" "}
              {orderData.reservedTables?.[0]?.start_time
                ? moment.utc(orderData.reservedTables[0].start_time).local().format("HH:mm")
                : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-900">Địa Chỉ:</span>{" "}
              {customerInfo.address}
            </p>
            <p>
              <span className="font-medium text-gray-900">Thời gian kết thúc:</span>{" "}
              {orderData.reservedTables?.[0]?.end_time
                ? moment.utc(orderData.reservedTables[0].end_time).local().format("HH:mm")
                : "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-900">Loại:</span>{" "}
              {orderData.order.type}
            </p>
            <p>
              <span className="font-medium text-gray-900">Trạng Thái:</span>{" "}
              {getVietnameseStatus(orderData.order.status)}
            </p>
            <p>
              <span className="font-medium text-gray-900">Nhân viên phục vụ:</span>{" "}
              {staffName}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Danh Sách Bàn Đặt</h3>
          {orderData.reservedTables?.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
              {orderData.reservedTables.map((table) => (
                <li key={table._id}>
                  <span className="font-medium text-gray-900">Bàn:</span>{" "}
                  {table.table_id},{" "}
                  <span className="font-medium text-gray-900">Thời gian:</span>{" "}
                  {table.start_time && table.end_time
                    ? `${moment.utc(table.start_time).local().format("HH:mm, DD/MM/YYYY")} - ${moment
                        .utc(table.end_time)
                        .local()
                        .format("HH:mm, DD/MM/YYYY")}`
                    : "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">Không có bàn đặt nào.</p>
          )}
        </div>
      </div>

      {/* Cột phải: Danh sách món ăn và tổng hóa đơn */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold text-gray-900">Danh Sách Mặt Hàng</h3>
          {orderData.itemOrders?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {orderData.itemOrders.map((item) => (
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
                    <p>
                      <span className="font-medium text-gray-900">Tên:</span>{" "}
                      {item.itemName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Kích thước:</span>{" "}
                      {item.size || "Mặc định"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Ghi chú:</span>{" "}
                      {item.note || "Không có"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Giá:</span>{" "}
                      {item.itemPrice ? item.itemPrice.toLocaleString() : "N/A"} VND
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Số Lượng:</span>{" "}
                      {item.quantity || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Tổng Tiền:</span>{" "}
                      {item.itemPrice && item.quantity
                        ? (item.itemPrice * item.quantity).toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </p>
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
                orderData.itemOrders?.reduce(
                  (acc, item) => acc + (item.itemPrice || 0) * (item.quantity || 0),
                  0
                ) || 0;
              const vat = totalAmount * 0.1;
              const grandTotal = totalAmount + vat;
              return (
                <>
                  <p>
                    <span className="font-medium text-gray-900">Tổng Tiền:</span>{" "}
                    {totalAmount.toLocaleString()} VND
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">VAT (10%):</span>{" "}
                    {vat.toLocaleString()} VND
                  </p>
                  <p className="font-semibold text-blue-600">
                    <span className="font-medium text-gray-900">Tổng Cộng:</span>{" "}
                    {grandTotal.toLocaleString()} VND
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCardDetails;