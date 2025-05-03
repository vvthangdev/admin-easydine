import React from "react";
import { Modal, Button } from "antd";

const ReleaseTableModal = ({ visible, onCancel, onConfirm, tableNumber }) => {
  return (
    <Modal
      title="Xác nhận trả bàn"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300"
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700"
        >
          Trả bàn
        </Button>,
      ]}
    >
      <p>Bạn có chắc muốn trả bàn số {tableNumber} không?</p>
    </Modal>
  );
};

export default ReleaseTableModal;