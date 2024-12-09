import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Upload } from 'antd';
import { userAPI } from "../../services/apis/User"; // Giả sử bạn có một API cho hồ sơ cá nhân
import { UploadOutlined } from '@ant-design/icons';
import { supabase } from "../../supabase/supasbase"; // Đảm bảo bạn đã cấu hình Supabase
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profile, setProfile] = useState(null); // Đặt mặc định là null
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Modal xác nhận xóa
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState([]); // Trạng thái cho ảnh đại diện
    const [password, setPassword] = useState(''); // Trạng thái cho mật khẩu
    const navigate = useNavigate();

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getUserInfo();
            console.log("check res:", response);
            setProfile(response);
            form.setFieldsValue(response); // Đặt giá trị cho form
            // Chuyển đổi avatar thành mảng nếu cần
            setAvatar(response.avatar ? [{ url: response.avatar }] : []); // Giả sử response có trường avatar
        } catch (error) {
            message.error("Lỗi khi tải thông tin hồ sơ");
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            let imageUrl = '';

            // Nếu có file ảnh, upload lên Supabase và lấy URL
            if (avatar?.length > 0 && avatar?.[0]?.originFileObj) {
                const timestamp = Date.now();
                const file = avatar?.[0]?.originFileObj;
                const { data, error: uploadError } = await supabase.storage
                    .from('thanh')
                    .upload(`images/${timestamp}_${file.name}`, file);

                if (uploadError) {
                    throw uploadError;
                }

                // Lấy URL của ảnh
                imageUrl = `https://supabase.fcs.ninja/storage/v1/object/public/thanh/${encodeURIComponent(data.path)}`;
            }
            else if (profile.avatar) {
                imageUrl = profile.avatar;
            }

            const requestData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                avatar: imageUrl, // Gửi ảnh đại diện
            };

            // Cập nhật thông tin hồ sơ
            await userAPI.updateUser(requestData);
            setProfile({ ...profile, ...requestData }); // Cập nhật state profile
            message.success('Cập nhật hồ sơ thành công');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
        finally {
            window.location.reload();
        }
    };

    const handleUploadChange = ({ fileList }) => {
        setAvatar(fileList);
    };

    // Hàm xóa người dùng
    const handleDeleteUser = async () => {
        const token=localStorage.getItem('accessToken');
        try {
            const requestData = {
                password: password,
                accessToken: token
            }
            // Gọi API xóa người dùng với mật khẩu
            await userAPI.deleteUser(requestData); // Giả sử bạn cần gửi mật khẩu
            setProfile(null);
            setIsDeleteModalVisible(false);
            message.success("Xóa hồ sơ thành công!");
            window.location.reload();

        } catch (error) {
            console.error('Lỗi khi xóa hồ sơ:', error);
            message.error('Có lỗi xảy ra khi xóa hồ sơ. Vui lòng thử lại.');
        }
        finally {
            navigate('/login');
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Quản lý hồ sơ cá nhân</h1>
                    <Button
                        type="primary"
                        onClick={handleEdit}
                        className="bg-blue-500 hover:bg-blue-600 transition duration-300"
                    >
                        Chỉnh sửa hồ sơ
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => setIsDeleteModalVisible(true)} // Mở modal xác nhận xóa
                    >
                        Xóa hồ sơ
                    </Button>
                </div>

                {profile ? (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center mb-4">
                            <img
                                src={profile.avatar} // Hình ảnh đại diện
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
                            />
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Thông tin cá nhân</h2>
                                <p className="text-gray-700"><strong>Tên:</strong> {profile.name}</p>
                                <p className="text-gray-700"><strong>Email:</strong> {profile.email}</p>
                                <p className="text-gray-700"><strong>Số điện thoại:</strong> {profile.phone}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
                )}

                <Modal
                    title="Chỉnh sửa hồ sơ cá nhân"
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
                    }}
                    className="rounded-lg"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-4"
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item label="Ảnh đại diện">
                            <Upload
                                listType="picture"
                                fileList={avatar}
                                onChange={handleUploadChange}
                                beforeUpload={() => false} // Ngăn không cho tự động tải lên
                            >
                                <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal xác nhận xóa */}
                <Modal
                    title="Xác nhận xóa hồ sơ"
                    open={isDeleteModalVisible}
                    onOk={handleDeleteUser}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    okText="Xóa"
                    cancelText="Hủy"
                    className="rounded-lg"
                >
                    <p>Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác.</p>
                    <Form layout="vertical">
                        <Form.Item
                            label="Nhập mật khẩu để xác nhận"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}