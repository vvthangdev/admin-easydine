import React, { useState, useEffect } from 'react';
import { itemAPI } from "../../services/apis/Item";
import { message, Button, Modal, Popconfirm } from 'antd';
import CategoryNavigation from "../../components/Menu/categoryNavigation";
import { useHistory, useNavigate } from 'react-router-dom';

export default function MenuItems() {
    const [listItems, setListItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    // Lấy giỏ hàng từ localStorage khi trang được tải lại
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // Lưu giỏ hàng vào localStorage khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await itemAPI.getAllItem();
            setListItems(response);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi tải menu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredItems = selectedCategory === 'all'
        ? listItems
        : listItems.filter(item => item.name.toLowerCase().includes(selectedCategory.toLowerCase()));

    const addToCart = (item) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            const itemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id);
            if (itemIndex > -1) {
                updatedCart[itemIndex].quantity += 1;
            } else {
                updatedCart.push({ ...item, quantity: 1 });
            }
            return updatedCart;
        });
        message.success(`${item.name} đã được thêm vào giỏ hàng!`);
    };

    // Hàm xóa món trong giỏ hàng
    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        message.success("Đã xóa món khỏi giỏ hàng!");
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleGoToReservationPage = () => {
        // Chuyển hướng người dùng sang trang đặt bàn và gửi các món ăn đã chọn
        navigate('/reservation', { state: { cart } });  // Truyền giỏ hàng qua state
    };
    // Điều hướng đến trang đặt ship
    const handleGoToShipOrder = () => {
        navigate('/ship', { state: { cart } });  // Chuyển hướng đến trang đặt ship
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Category Navigation */}
            <CategoryNavigation selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div>Đang tải...</div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <img className="w-full h-48 object-cover" src={item.image} alt={item.name} />
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {item.isPopular && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                🔥 Phổ biến
                                            </span>
                                        )}
                                        {item.discount > 0 && (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                                -{item.discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                        <div className="flex items-center">
                                            <span className="text-amber-500 mr-1">⭐</span>
                                            <span className="text-sm text-gray-600">{item.rating || 5}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                            ⏱️ {item.preparationTime || 30} phút
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                            👥 {item.numReviews || 8888} đánh giá
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-amber-600">
                                                {item.price.toLocaleString()}₫
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {(item.price * (1 + item.discount / 100)).toLocaleString()}₫
                                                </span>
                                            )}
                                        </div>

                                        {/* Thêm vào giỏ hàng */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => addToCart(item)} // Thêm món vào giỏ hàng
                                                className="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600"
                                            >
                                                Thêm vào giỏ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Hiển thị giỏ hàng */}
            {cart.length > 0 && (
                <div
                    onClick={() => setIsModalVisible(true)}
                    className="fixed bottom-4 right-4 bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 cursor-pointer"
                >
                    <span className="font-bold">Giỏ hàng: {cart.length} món</span>
                </div>
            )}

            {/* Modal Giỏ hàng */}
            <Modal
                title="Giỏ Hàng"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={600}
            >
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-2 mb-2">
                            <div>
                                <span>{item.name} x {item.quantity}</span>
                                <span className="text-sm text-gray-500 ml-80">{item.price.toLocaleString()}₫</span>
                            </div>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa món này?"
                                onConfirm={() => removeFromCart(item.id)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="link" className="text-red-500">Xóa</Button>
                            </Popconfirm>
                        </div>
                    ))}
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Tổng: {cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}₫</span>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleGoToReservationPage} // Chuyển hướng đến trang đặt bàn
                                className="px-4 py-2 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-600"
                            >
                                Đặt Bàn
                            </Button>
                            <Button
                                onClick={handleGoToShipOrder} // Chuyển hướng đến trang đặt bàn
                                className="px-4 py-2 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-600"
                            >
                                Đặt Ship
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
