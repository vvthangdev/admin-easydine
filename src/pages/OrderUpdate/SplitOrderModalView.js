import React from "react";
import { Modal, Button, Table, Input } from "antd";
import SplitOrderModalViewModel from "./SplitOrderModalViewModel";

const SplitOrderModalView = ({ visible, orderDetails, onCancel, onSuccess, zIndex }) => {
  const { splitItems, columns, handleQuantityChange, handleSplitOrder } = SplitOrderModalViewModel({
    visible,
    orderDetails,
    onCancel,
    onSuccess,
  });

  return (
    <Modal
      title="Tách Đơn Hàng"
      open={visible}
      onCancel={onCancel}
      className="rounded-xl"
      footer={[
        <Button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
        >
          Hủy
        </Button>,
        <Button
          key="split"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleSplitOrder}
        >
          Tách Đơn
        </Button>,
      ]}
      width="80vw"
      style={{ top: 50 }}
      zIndex={zIndex || 1001}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn Món để Tách
          </h3>
          <Table
            columns={columns}
            dataSource={splitItems}
            rowKey="key"
            pagination={false}
            size="middle"
            className="text-base text-gray-600 mt-2"
            scroll={{ x: true }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SplitOrderModalView;