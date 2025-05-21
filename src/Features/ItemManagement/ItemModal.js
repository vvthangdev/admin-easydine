import React from "react";
import { Modal, Form, Input, InputNumber, Select, Upload, Button, Space } from "antd";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ItemModal = ({
  type,
  visible,
  editingItem,
  categories,
  selectedItem,
  onOk,
  onCancel,
  form,
  fileList,
  setFileList,
}) => {
  const renderContent = () => {
    if (type === "item") {
      return (
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
          >
            <Input placeholder="Nhập tên món" className="border rounded-md" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber className="w-full border rounded-md" placeholder="Nhập giá" min={0} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 1000, message: "Mô tả không được vượt quá 1000 ký tự!" }]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả món ăn (tùy chọn)"
              className="border rounded-md"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            name="categories"
            label="Danh mục"
            // Bỏ required, danh mục là tùy chọn
          >
            <Select
              mode="multiple"
              placeholder="Chọn danh mục (tùy chọn)"
              allowClear
              style={{ width: "100%" }}
            >
              {categories
                .filter((cat) => cat && cat._id)
                .map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.List name="sizes">
            {(fields, { add, remove }) => (
              <>
                <Form.Item label="Kích cỡ (tùy chọn)">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[{ required: true, message: "Vui lòng nhập tên kích cỡ!" }]}
                      >
                        <Input placeholder="Tên kích cỡ" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                      >
                        <InputNumber placeholder="Giá" min={0} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm kích cỡ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item label="Ảnh (tùy chọn)">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />} className="bg-blue-500 text-white rounded-md">
                Chọn ảnh
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      );
    } else if (type === "category") {
      return (
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" className="border rounded-md" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input placeholder="Nhập mô tả (tùy chọn)" className="border rounded-md" />
          </Form.Item>
        </Form>
      );
    } else if (type === "deleteItem" || type === "deleteCategory") {
      return (
        <p>
          Bạn có chắc chắn muốn xóa {type === "deleteItem" ? "món ăn" : "danh mục"}{" "}
          <strong>{selectedItem?.name}</strong> không? Hành động này không thể hoàn tác.
        </p>
      );
    }
  };

  const getTitle = () => {
    if (type === "item") return editingItem ? "Sửa thông tin món ăn" : "Thêm món ăn mới";
    if (type === "category") return "Thêm danh mục mới";
    return `Xác nhận xóa ${type === "deleteItem" ? "món ăn" : "danh mục"}`;
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={type.includes("delete") ? "Xóa" : "OK"}
      cancelText="Hủy"
      className="rounded-lg"
      wrapClassName="flex flex-col"
    >
      {renderContent()}
    </Modal>
  );
};

export default ItemModal;