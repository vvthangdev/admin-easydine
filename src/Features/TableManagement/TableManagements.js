import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Space,
  message,
  Tag,
} from "antd";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import { userAPI } from "../../services/apis/User";
import moment from "moment";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTable, setEditingTable] = useState(null);
  const [releasingTable, setReleasingTable] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await tableAPI.getAllTablesStatus();
      const formattedTables = await Promise.all(
        response.tables.map(async (table) => {
          let customer_name = "N/A";
          let staff_name = "N/A";
          if (table.reservation_id) {
            try {
              const orderResponse = await orderAPI.getOrderById(table.reservation_id);
              const order = orderResponse.data || orderResponse;
              const customerResponse = await userAPI.getUserById(order.customer_id);
              const customer = customerResponse.data || customerResponse;
              customer_name = customer?.username || customer?.name || "N/A";
              if (order.staff_id) {
                const staffResponse = await userAPI.getUserById(order.staff_id);
                const staff = staffResponse.data || staffResponse;
                staff_name = staff?.username || staff?.name || "Chưa phân công";
              }
            } catch (error) {
              console.error(`Error fetching details for reservation ${table.reservation_id}:`, error);
            }
          }
          return {
            ...table,
            start_time: table.start_time ? new Date(table.start_time).toISOString() : null,
            end_time: table.end_time ? new Date(table.end_time).toISOString() : null,
            customer_name,
            staff_name,
          };
        })
      );
      setTables(formattedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      message.error("Lỗi khi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleReleaseTable = async () => {
    if (!releasingTable?.reservation_id || !releasingTable?.table_number) {
      message.error("Thông tin đặt chỗ hoặc bàn không hợp lệ");
      return;
    }

    try {
      await tableAPI.releaseTable({
        reservation_id: releasingTable.reservation_id,
        table_id: releasingTable.table_number,
      });
      setTables(tables.map((table) =>
        table.table_number === releasingTable.table_number
          ? { 
              ...table, 
              status: "Available", 
              start_time: null, 
              end_time: null, 
              reservation_id: null,
              customer_name: "N/A",
              staff_name: "N/A",
            }
          : table
      ));
      message.success(`Trả bàn số ${releasingTable.table_number} thành công`);
      setIsReleaseModalVisible(false);
      setReleasingTable(null);
    } catch (error) {
      console.error("Error releasing table:", error);
      message.error("Trả bàn không thành công");
    }
  };

  const confirmReleaseTable = (record) => {
    if (!record.reservation_id) {
      message.error("Không tìm thấy đặt chỗ cho bàn này");
      return;
    }
    setReleasingTable(record);
    setIsReleaseModalVisible(true);
  };

  const columns = [
    {
      title: "Số bàn",
      dataIndex: "table_number",
      key: "table_number",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Available":
            color = "green";
            break;
          case "Reserved":
            color = "orange";
            break;
          case "Occupied":
            color = "blue";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Người đặt",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Nhân viên phục vụ",
      dataIndex: "staff_name",
      key: "staff_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => (time ? moment.utc(time).local().format("HH:mm, DD/MM/YYYY") : "-"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      render: (time) => (time ? moment.utc(time).local().format("HH:mm, DD/MM/YYYY") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-700"
          >
            Xóa
          </Button>
          {record.status !== "Available" && (
            <Button
              type="link"
              onClick={() => confirmReleaseTable(record)}
              className="text-green-600 hover:text-green-700"
            >
              Trả bàn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingTable(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTable(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await tableAPI.deleteTable({ table_number: record.table_number });
      setTables(tables.filter((table) => table.table_number !== record.table_number));
      message.success(`Xóa bàn số ${record.table_number} thành công`);
    } catch (error) {
      console.error("Error deleting table:", error);
      message.error("Xóa bàn không thành công");
    }
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const requestData = {
          table_number: values.table_number,
          capacity: values.capacity,
        };

        try {
          if (editingTable) {
            await tableAPI.updateTable(requestData);
            setTables(tables.map((table) =>
              table.table_number === editingTable.table_number
                ? { ...table, ...requestData }
                : table
            ));
            message.success(`Cập nhật bàn số ${requestData.table_number} thành công`);
          } else {
            const newTable = await tableAPI.addTable(requestData);
            setTables([...tables, { ...newTable, status: "Available", customer_name: "N/A", staff_name: "N/A" }]);
            message.success(`Thêm bàn số ${requestData.table_number} thành công`);
          }
          setIsModalVisible(false);
          form.resetFields();
        } catch (error) {
          console.error("Error saving table:", error);
          message.error(editingTable ? "Cập nhật bàn không thành công" : "Thêm bàn không thành công");
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
        message.error("Vui lòng kiểm tra thông tin nhập");
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý bàn</h1>
        <Button
          type="primary"
          onClick={handleAdd}
          className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Thêm bàn mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={tables}
          rowKey="table_number"
          loading={loading}
          className="w-full text-sm text-gray-600"
          rowClassName="hover:bg-gray-100 transition-all duration-200"
        />
      </div>

      <Modal
        title={editingTable ? "Sửa thông tin bàn" : "Thêm bàn mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={editingTable ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        footer={[
          <Button
            key="cancel"
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleModalOk}
          >
            {editingTable ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="table_number"
            label="Số bàn"
            rules={[{ required: true, message: "Vui lòng nhập số bàn!" }]}
          >
            <InputNumber
              className="w-full"
              type="number"
              placeholder="Nhập số bàn"
              min={1}
            />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Sức chứa"
            rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
          >
            <InputNumber
              className="w-full"
              type="number"
              placeholder="Nhập sức chứa"
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận trả bàn"
        open={isReleaseModalVisible}
        onOk={handleReleaseTable}
        onCancel={() => {
          setIsReleaseModalVisible(false);
          setReleasingTable(null);
        }}
        okText="Trả bàn"
        cancelText="Hủy"
        footer={[
          <Button
            key="cancel"
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => {
              setIsReleaseModalVisible(false);
              setReleasingTable(null);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300"
            onClick={handleReleaseTable}
          >
            Trả bàn
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn trả bàn số {releasingTable?.table_number} không?</p>
      </Modal>
    </div>
  );
}