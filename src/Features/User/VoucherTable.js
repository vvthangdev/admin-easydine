import React from "react";
import { Table, Button, Space, message } from "antd";
import { voucherAPI } from "../../services/apis/Voucher";

const VoucherTable = ({ vouchers, loading, selectedUser, onEdit, onAddUser, fetchVouchers }) => {
  const handleDelete = async (record) => {
    try {
      await voucherAPI.deleteVoucher(record._id);
      fetchVouchers();
      message.success("Xóa voucher thành công");
    } catch (error) {
      message.error("Xóa voucher không thành công: " + error.message);
    }
  };

  const columns = [
    { title: "Mã", dataIndex: "code", key: "code", width: "20%", ellipsis: true },
    { title: "Giảm giá", dataIndex: "discount", key: "discount", width: "15%", ellipsis: true },
    {
      title: "Loại",
      dataIndex: "discountType",
      key: "discountType",
      width: "15%",
      ellipsis: true,
      className: "hidden sm:table-cell",
    },
    {
      title: "Giá trị tối thiểu",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      width: "20%",
      ellipsis: true,
      className: "hidden lg:table-cell",
    },
    {
      title: "Người dùng áp dụng",
      dataIndex: "applicableUsers",
      key: "applicableUsers",
      width: "25%",
      ellipsis: true,
      className: "hidden lg:table-cell",
      render: (users) => (users && users.length > 0 ? users.join(", ") : "Tất cả"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "25%",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          {selectedUser && (
            <Button type="link" onClick={() => onAddUser(record)}>
              Thêm người dùng
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={Array.isArray(vouchers) ? vouchers : []}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSizeOptions: [5, 10],
          defaultPageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} voucher`,
        }}
        className="min-w-0"
        tableLayout="fixed"
      />
    </div>
  );
};

export default VoucherTable;