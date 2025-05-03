import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, message, Tabs, Select } from "antd";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";
import { userAPI } from "../../services/apis/User";
import { tableAPI } from "../../services/apis/Table";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";
import OrderDetailsModal from "./OrderDetailsModal";
import SplitOrderModal from "./SplitOrderModal";
import MergeOrderModal from "./MergeOrderModal"; // Import modal mới

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
  const [splitModalVisible, setSplitModalVisible] = useState(false); // State cho SplitOrderModal
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [mergeModalVisible, setMergeModalVisible] = useState(false); // State cho MergeOrderModal
  const [mergeSourceOrder, setMergeSourceOrder] = useState(null); // Đơn hàng nguồn

  const handleMergeOrder = (record) => {
    setMergeSourceOrder(record);
    setMergeModalVisible(true);
  };

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

      const startDateTime = moment
        .utc(startTime)
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
      const endDateTime = moment.utc(endTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

      const response = await tableAPI.getAvailableTables({
        start_time: startDateTime,
        end_time: endDateTime,
      });
      setAvailableTables(response.data || response);
    } catch (error) {
      console.error("Error fetching available tables:", error);
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

      if (currentOrder.status === "pending" && newStatus === "confirmed") {
        await orderAPI.confirmOrder(orderId);
        message.success("Xác nhận đơn hàng thành công");
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
      message.error("Không thể cập nhật trạng thái hoặc xác nhận đơn hàng");
    }
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      const response = await adminAPI.getCustomerDetails(customerId);
      setCustomerDetails(response);
      setCustomerModalVisible(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      message.error("Không thể lấy thông tin chi tiết khách hàng");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await orderAPI.getOrderDetails(id);
      const data = response.data || response;

      let staffName = "Chưa phân công";
      if (data.order?.staff_id) {
        try {
          const staffResponse = await userAPI.getUserById(data.order.staff_id);
          staffName =
            staffResponse.username || staffResponse.name || "Không xác định";
        } catch (error) {
          console.error("Error fetching staff details:", error);
        }
      }

      setOrderDetails({
        ...data,
        order: {
          ...data.order,
          staffName,
        },
      });
      setDetailsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Không thể lấy thông tin chi tiết đơn hàng");
    }
  };

  const handleSplitOrder = async (record) => {
    try {
      const response = await orderAPI.getOrderDetails(record.id);
      const data = response.data || response;
      setOrderDetails(data);
      setSplitModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details for split:", error);
      message.error("Không thể lấy thông tin chi tiết đơn hàng để tách");
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    const now = moment();
    const date = now.format("DD/MM/YYYY");
    const start_time = now.format("HH:mm");
    const end_time = now.add(1, "hours").format("HH:mm");
    const newFormData = {
      date,
      start_time,
      end_time,
      type: "reservation",
      status: "pending",
    };
    setFormData(newFormData);
    setAvailableTables([]);
    setSelectedItems([]);
    setIsModalVisible(true);

    const startDateTime = moment(
      `${date} ${start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(`${date} ${end_time}`, "DD/MM/YYYY HH:mm").utc();
    fetchAvailableTables(
      date,
      startDateTime.format("YYYY-MM-DDTHH:mm:ss"),
      endDateTime.format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const handleEdit = async (record) => {
    setEditingOrder(record);
    try {
      const orderDetails = await orderAPI.getOrderDetails(record.id);
      const data = orderDetails.data || orderDetails;

      const reservedTables =
        data.reservedTables?.map((table) => table.table_id) || [];
      const items =
        data.itemOrders?.map((item) => ({
          id: item.item_id,
          name: item.itemName,
          price: item.itemPrice,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
        })) || [];

      const newFormData = {
        type: record.type || "reservation",
        status: record.status || "pending",
        staff_id: data.order?.staff_id || undefined,
        date: moment
          .utc(data.time || record.time)
          .local()
          .format("DD/MM/YYYY"),
        start_time: data.reservedTables?.[0]
          ? moment
              .utc(data.reservedTables[0].start_time)
              .local()
              .format("HH:mm")
          : moment
              .utc(data.time || record.time)
              .local()
              .format("HH:mm"),
        end_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].end_time).local().format("HH:mm")
          : moment
              .utc(data.time || record.time)
              .local()
              .add(1, "hours")
              .format("HH:mm"),
        tables: reservedTables,
      };

      setFormData(newFormData);
      setSelectedItems(items);

      const startDateTime = moment(
        `${newFormData.date} ${newFormData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${newFormData.date} ${newFormData.end_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      fetchAvailableTables(
        newFormData.date,
        startDateTime.format("YYYY-MM-DDTHH:mm:ss"),
        endDateTime.format("YYYY-MM-DDTHH:mm:ss")
      );

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error loading order for edit:", error);
      message.error("Không thể tải thông tin đơn hàng để sửa");
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Xác nhận xóa đơn hàng",
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.id}? Hành động này không thể hoàn tác.`,
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
          message.success(`Xóa đơn hàng ${record.id} thành công`);
        } catch (error) {
          console.error("Error deleting order:", error);
          message.error("Xóa đơn hàng không thành công");
        }
      },
      onCancel: () => {},
    });
  };

  const handleModalOk = async () => {
    try {
      if (!formData.type || !formData.date || !formData.start_time) {
        message.error("Vui lòng điền đầy đủ thông tin cơ bản!");
        return;
      }

      const startDateTime = moment(
        `${formData.date} ${formData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = formData.end_time
        ? moment(
            `${formData.date} ${formData.end_time}`,
            "DD/MM/YYYY HH:mm"
          ).utc()
        : moment(`${formData.date} ${formData.start_time}`, "DD/MM/YYYY HH:mm")
            .add(1, "hours")
            .utc();

      const orderData = {
        id: editingOrder ? editingOrder.id : undefined,
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        type: formData.type,
        status: formData.status,
        staff_id: formData.staff_id || null,
        customer_id: selectedCustomer?._id,
        items: selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
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
    {
      title: "Họ tên - Số điện thoại",
      key: "customer_info",
      render: (_, record) => (
        <Button
          type="link"
          className="text-blue-600 hover:text-blue-700"
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
      render: (text) =>
        text ? moment.utc(text).local().format("DD/MM/YY HH:mm") : "N/A",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(record.id, value)}
          className="w-32 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
          <Button
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => handleViewDetails(record.id)}
          >
            Xem Chi Tiết
          </Button>
          {record.type === "reservation" && (
            <>
              <Button
                className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300"
                onClick={() => handleSplitOrder(record)}
              >
                Tách Đơn
              </Button>
              <Button
                className="px-4 py-1 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-300"
                onClick={() => handleMergeOrder(record)}
              >
                Gộp Đơn
              </Button>
            </>
          )}
        </Space>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <Button
          type="link"
          className="text-red-600 hover:text-red-700"
          onClick={() => handleDelete(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Danh sách đơn hàng
        </h2>
        <Space>
          {selectedCustomer && (
            <>
              <span>
                Đang hiển thị đơn hàng của: {selectedCustomer.name} -{" "}
                {selectedCustomer.phone}
              </span>
              <Button
                className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
                onClick={onClearFilter}
              >
                Xóa bộ lọc
              </Button>
            </>
          )}
          <Button
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleAdd}
          >
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
            className="text-sm text-gray-600"
            rowClassName="hover:bg-gray-100 transition-all duration-200"
          />
        </TabPane>
        <TabPane tab="Đơn Hàng Giao Hàng" key="ship">
          <Table
            columns={columns}
            dataSource={orders.ship}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="text-sm text-gray-600"
            rowClassName="hover:bg-gray-100 transition-all duration-200"
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
        width="90vw"
        className="rounded-xl"
        styles={{ padding: 0, background: "transparent" }}
        footer={[
          <Button
            key="cancel"
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => {
              setIsModalVisible(false);
              setFormData({});
              setAvailableTables([]);
              setSelectedItems([]);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleModalOk}
          >
            {editingOrder ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <div className="flex h-[80vh] bg-white/80 backdrop-blur-md rounded-xl">
          <div className="flex-[2] p-6 border-r border-gray-200 overflow-auto">
            <OrderBasicInfo
              formData={formData}
              setFormData={setFormData}
              availableTables={availableTables}
              fetchAvailableTables={fetchAvailableTables}
            />
          </div>
          <div className="flex-[4] p-6 border-r border-gray-200 overflow-auto">
            <ItemSelector setSelectedItems={setSelectedItems} />
          </div>
          <div className="flex-[4] p-6 overflow-auto">
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
          <Button
            key="close"
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => setCustomerModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        {customerDetails ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={customerDetails.avatar || "https://via.placeholder.com/80"}
                alt={customerDetails.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {customerDetails.name}
              </h3>
            </div>
            <p>
              <b>Địa Chỉ:</b> {customerDetails.address || "Chưa cung cấp"}
            </p>
            <p>
              <b>Email:</b> {customerDetails.email || "Chưa cung cấp"}
            </p>
            <p>
              <b>Số Điện Thoại:</b> {customerDetails.phone || "Chưa cung cấp"}
            </p>
            <p>
              <b>Username:</b> {customerDetails.username || "Chưa cung cấp"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Đang tải thông tin...</p>
        )}
      </Modal>

      <OrderDetailsModal
        visible={detailsModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setDetailsModalVisible(false)}
      />

      <SplitOrderModal
        visible={splitModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setSplitModalVisible(false)}
        onSuccess={() => fetchOrders(selectedCustomer?._id)}
      />

      <MergeOrderModal
        visible={mergeModalVisible}
        sourceOrder={mergeSourceOrder}
        orders={orders.reservation}
        onCancel={() => setMergeModalVisible(false)}
        onSuccess={() => fetchOrders(selectedCustomer?._id)}
      />
    </div>
  );
};

export default OrderList;
