import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  message,
  Tabs,
  Select,
} from "antd";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";

const { TabPane } = Tabs;

const OrderList = ({ selectedCustomer, onClearFilter }) => {
  const [orders, setOrders] = useState({ ship: [], reservation: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reservation");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({});

  const fetchOrders = async (customerId = null) => {
    setLoading(true);
    try {
      let response;
      if (customerId) {
        response = await orderAPI.searchOrdersByCustomer(customerId);
      } else {
        response = await orderAPI.getAllOrders();
      }

      const ordersData = response.data || response;

      const ordersWithCustomerDetails = await Promise.all(
        ordersData.map(async (order) => {
          const customerResponse = await adminAPI.getCustomerDetails(
            order.customer_id
          );
          return {
            ...order,
            id: order._id,
            customerName: customerResponse.name || "Không xác định",
            customerPhone: customerResponse.phone || "Không xác định",
            customerId: order.customer_id,
          };
        })
      );

      const sortedOrders = ordersWithCustomerDetails.sort((a, b) =>
        moment(b.time).diff(moment(a.time))
      );
      const shipOrders = sortedOrders.filter((order) => order.type === "ship");
      const reservationOrders = sortedOrders.filter(
        (order) => order.type === "reservation"
      );
      setOrders({ reservation: reservationOrders, ship: shipOrders });
    } catch (error) {
      console.error("Error loading orders:", error);
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTables = async (date, startTime, endTime) => {
    try {
      if (!date || !startTime || !endTime) return;
      const startDateTime = moment.utc(
        `${date} ${startTime}`,
        "DD/MM/YYYY HH:mm"
      );
      const endDateTime = moment.utc(`${date} ${endTime}`, "DD/MM/YYYY HH:mm");

      const response = await orderAPI.getAvailableTables({
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      });
      setAvailableTables(response.data || response);
    } catch (error) {
      console.error("Error fetching available tables:", error);
      message.error("Không thể lấy danh sách bàn khả dụng");
    }
  };

  useEffect(() => {
    fetchOrders(selectedCustomer?._id);
  }, [selectedCustomer]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const currentOrder =
        orders.reservation.find((o) => o.id === orderId) ||
        orders.ship.find((o) => o.id === orderId);
      if (!currentOrder) {
        message.error("Không tìm thấy đơn hàng để cập nhật");
        return;
      }

      const updatedOrderData = {
        id: orderId,
        status: newStatus,
        type: currentOrder.type,
      };

      await orderAPI.updateOrder(updatedOrderData);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      const response = await adminAPI.getCustomerDetails(customerId);
      setCustomerDetails(response);
      setCustomerModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết khách hàng");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await orderAPI.getOrderDetails(id);
      setOrderDetails(response.data || response);
      setDetailsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết đơn hàng");
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      date: moment().utc().format("DD/MM/YYYY"),
      start_time: moment().utc().format("HH:mm"),
      end_time: moment().utc().add(1, "hours").format("HH:mm"),
      type: "reservation",
      status: "pending",
    });
    setAvailableTables([]);
    setSelectedItems([]);
    setIsModalVisible(true);
  };

  const handleEdit = async (record) => {
    setEditingOrder(record);
    try {
      const orderDetails = await orderAPI.getOrderDetails(record.id);
      const data = orderDetails.data || orderDetails;

      const reservedTables = data.reservedTables?.map((table) => table.table_id) || [];

      const items = data.itemOrders?.map((item) => ({
        id: item.item_id,
        name: item.itemName,
        price: item.itemPrice,
        quantity: item.quantity,
      })) || [];

      const newFormData = {
        type: record.type || "reservation",
        status: record.status || "pending",
        date: moment.utc(data.time || record.time).format("DD/MM/YYYY"),
        start_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].start_time).format("HH:mm")
          : moment.utc(data.time || record.time).format("HH:mm"),
        end_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].end_time).format("HH:mm")
          : moment.utc(data.time || record.time).add(1, "hours").format("HH:mm"),
        tables: reservedTables,
      };

      setFormData(newFormData);
      setSelectedItems(items);

      fetchAvailableTables(
        newFormData.date,
        newFormData.start_time,
        newFormData.end_time
      );

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error loading order for edit:", error);
      message.error("Không thể tải thông tin đơn hàng để sửa");
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.id} không? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await orderAPI.deleteOrder(record.id);
          setOrders((prevOrders) => ({
            ...prevOrders,
            [record.type]: prevOrders[record.type].filter(
              (order) => order.id !== record.id
            ),
          }));
          message.success("Xóa đơn hàng thành công");
        } catch (error) {
          message.error("Không thể xóa đơn hàng");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      if (
        !formData.type ||
        !formData.date ||
        !formData.start_time ||
        !formData.end_time
      ) {
        message.error("Vui lòng điền đầy đủ thông tin cơ bản!");
        return;
      }

      const startDateTime = moment.utc(
        `${formData.date} ${formData.start_time}`,
        "DD/MM/YYYY HH:mm"
      );
      const endDateTime = moment.utc(
        `${formData.date} ${formData.end_time}`,
        "DD/MM/YYYY HH:mm"
      );

      const orderData = {
        id: editingOrder ? editingOrder.id : undefined,
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        type: formData.type,
        status: formData.status,
        items: selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      if (formData.tables?.length > 0) {
        orderData.tables = formData.tables;
      }

      if (editingOrder) {
        await orderAPI.updateOrder(orderData);
        message.success("Cập nhật đơn hàng thành công");
      } else {
        const response = await orderAPI.createOrder(orderData);
        const newOrder = response.data || response;
        setOrders((prevOrders) => ({
          ...prevOrders,
          [newOrder.type]: [
            ...prevOrders[newOrder.type],
            {
              ...newOrder,
              id: newOrder._id,
              time: newOrder.time || newOrder.start_time,
              customerName: selectedCustomer?.name || "Không xác định",
              customerPhone: selectedCustomer?.phone || "Không xác định",
              customerId: selectedCustomer?._id,
            },
          ],
        }));
        message.success("Thêm đơn hàng thành công");
      }
      setIsModalVisible(false);
      setFormData({});
      setSelectedItems([]);
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error adding/updating order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const columns = [
    { title: "Mã Đơn Hàng", dataIndex: "id", key: "id" },
    {
      title: "Họ tên - Số điện thoại",
      key: "customer_info",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewCustomerDetails(record.customerId)}
        >
          {`${record.customerName} - ${record.customerPhone}`}
        </Button>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "time",
      key: "time",
      render: (text) => moment.utc(text).format("DD/MM/YY, HH:mm"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(record.id, value)}
          popupMatchSelectWidth={false}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="confirmed">Confirmed</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
        </Select>
      ),
    },
    { title: "Loại Đơn Hàng", dataIndex: "type", key: "type" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="default" onClick={() => handleViewDetails(record.id)}>
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách đơn hàng</h2>
        <Space>
          {selectedCustomer && (
            <>
              <span>
                Đang hiển thị đơn hàng của: {selectedCustomer.name} -{" "}
                {selectedCustomer.phone}
              </span>
              <Button type="default" onClick={onClearFilter}>
                Xóa bộ lọc
              </Button>
            </>
          )}
          <Button type="primary" onClick={handleAdd}>
            Thêm Đơn Hàng Mới
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Đơn Hàng Đặt Chỗ" key="reservation">
          <Table
            columns={columns}
            dataSource={orders.reservation}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Đơn Hàng Giao Hàng" key="ship">
          <Table
            columns={columns}
            dataSource={orders.ship}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setFormData({});
          setAvailableTables([]);
          setSelectedItems([]);
        }}
        width={1200}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: "flex", height: "500px" }}>
          <div
            style={{
              flex: 1,
              padding: "16px",
              borderRight: "1px solid #f0f0f0",
            }}
          >
            <OrderBasicInfo
              formData={formData}
              setFormData={setFormData}
              availableTables={availableTables}
              fetchAvailableTables={fetchAvailableTables}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: "16px",
              borderRight: "1px solid #f0f0f0",
            }}
          >
            <ItemSelector setSelectedItems={setSelectedItems} />
          </div>
          <div style={{ flex: 1, padding: "16px" }}>
            <SelectedItems
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Thông Tin Khách Hàng"
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCustomerModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {customerDetails ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={customerDetails.avatar}
                alt={customerDetails.name}
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              />
              <h3>{customerDetails.name}</h3>
            </div>
            <p>
              <b>Địa Chỉ:</b> {customerDetails.address}
            </p>
            <p>
              <b>Email:</b> {customerDetails.email}
            </p>
            <p>
              <b>Số Điện Thoại:</b> {customerDetails.phone}
            </p>
            <p>
              <b>Username:</b> {customerDetails.username}
            </p>
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </Modal>

      <Modal
        title="Chi Tiết Đơn Hàng"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {orderDetails ? (
          <div>
            <h3>Thông Tin Đơn Hàng</h3>
            <p>
              <b>Mã Đơn Hàng:</b>{" "}
              {orderDetails.order?.id || orderDetails._id || "N/A"}
            </p>
            <p>
              <b>Mã Khách Hàng:</b>{" "}
              {orderDetails.order?.customer_id ||
                orderDetails.customer_id ||
                "N/A"}
            </p>
            <p>
              <b>Ngày:</b>{" "}
              {moment.utc(orderDetails.order?.time || orderDetails.time).format(
                "DD/MM/YYYY"
              )}
            </p>
            <p>
              <b>Thời gian bắt đầu:</b>{" "}
              {orderDetails.reservedTables?.[0]
                ? moment
                    .utc(orderDetails.reservedTables[0].start_time)
                    .format("HH:mm")
                : "N/A"}
            </p>
            <p>
              <b>Thời gian kết thúc:</b>{" "}
              {orderDetails.reservedTables?.[0]
                ? moment
                    .utc(orderDetails.reservedTables[0].end_time)
                    .format("HH:mm")
                : "N/A"}
            </p>
            <p>
              <b>Loại:</b>{" "}
              {orderDetails.order?.type || orderDetails.type || "N/A"}
            </p>
            <p>
              <b>Trạng Thái:</b>{" "}
              {orderDetails.order?.status || orderDetails.status || "N/A"}
            </p>

            <h3>Danh Sách Bàn Đặt</h3>
            {orderDetails.reservedTables?.length > 0 ? (
              <ul>
                {orderDetails.reservedTables.map((table) => (
                  <li key={table._id}>
                    <b>Bàn:</b> {table.table_id}, <b>Thời gian:</b>{" "}
                    {`${moment
                      .utc(table.start_time)
                      .format("HH:mm, DD/MM/YYYY")} - ${moment
                      .utc(table.end_time)
                      .format("HH:mm, DD/MM/YYYY")}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có bàn đặt nào.</p>
            )}

            <h3>Danh Sách Mặt Hàng</h3>
            {orderDetails.itemOrders?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {orderDetails.itemOrders.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "8px",
                    }}
                  >
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      style={{
                        width: "80px",
                        height: "80px",
                        marginRight: "16px",
                      }}
                    />
                    <div>
                      <p>
                        <b>Tên:</b> {item.itemName}
                      </p>
                      <p>
                        <b>Giá:</b> {item.itemPrice.toLocaleString()} VND
                      </p>
                      <p>
                        <b>Số Lượng:</b> {item.quantity}
                      </p>
                      <p>
                        <b>Tổng Tiền:</b>{" "}
                        {(item.itemPrice * item.quantity).toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có mặt hàng nào được đặt.</p>
            )}

            <div
              style={{
                marginTop: "20px",
                borderTop: "1px solid #ddd",
                paddingTop: "16px",
              }}
            >
              <h3>Tính Tổng Hóa Đơn</h3>
              {(() => {
                const totalAmount =
                  orderDetails.itemOrders?.reduce(
                    (acc, item) => acc + item.itemPrice * item.quantity,
                    0
                  ) || 0;
                const vat = totalAmount * 0.1;
                const grandTotal = totalAmount + vat;
                return (
                  <div>
                    <p>
                      <b>Tổng Tiền:</b> {totalAmount.toLocaleString()} VND
                    </p>
                    <p>
                      <b>VAT (10%):</b> {vat.toLocaleString()} VND
                    </p>
                    <p style={{ fontWeight: "bold", color: "#d9534f" }}>
                      <b>Tổng Cộng:</b> {grandTotal.toLocaleString()} VND
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin chi tiết...</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;