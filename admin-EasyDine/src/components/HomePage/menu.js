import { useEffect, useState } from 'react';
import { itemAPI } from "../../services/apis/Item";
import { message } from "antd";
import { Link } from "react-router-dom";

export default function Menu() {
    const [listItems, setListItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await itemAPI.getAllItem();
            console.log("check res:", response);
            setListItems(response);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi tải menu!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const popularItems = [
        {
            id: 1,
            name: "Phở Đặc Biệt",
            rating: 4.8,
            reviews: 120,
            price: "89.000đ",
            image: "/Assets/HomePage/cake1.jpg",
            category: "Món Truyền Thống"
        },
        {
            id: 2,
            name: "Bún Chả Hà Nội",
            rating: 4.9,
            reviews: 150,
            price: "75.000đ",
            image: "/Assets/HomePage/cake2.jpg",
            category: "Món Nổi Tiếng"
        },
        {
            id: 3,
            name: "Bánh Mì Thịt Nướng",
            rating: 4.7,
            reviews: 98,
            price: "35.000đ",
            image: "/Assets/HomePage/cake3.jpg",
            category: "Ăn Nhanh"
        },
        {
            id: 4,
            name: "Cơm Tấm Sườn Bì",
            rating: 4.8,
            reviews: 135,
            price: "65.000đ",
            image: "/Assets/HomePage/cake1.jpg",
            category: "Món Chính"
        }
    ];

    const [activeCategory, setActiveCategory] = useState('Tất Cả');
    const categories = ['Tất Cả', 'Món Truyền Thống', 'Món Nổi Tiếng', 'Ăn Nhanh', 'Món Chính'];

    return (
        <section className="py-16 px-4 md:px-20 bg-white">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Món Ăn Phổ Biến
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Khám phá những món ăn được yêu thích nhất tại nhà hàng chúng tôi,
                    được chế biến từ những nguyên liệu tươi ngon nhất
                </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === category
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Food Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {listItems.slice(0, 4).map((item) => ( // Only render the first 4 items
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                    >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Overlay with quick actions */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-300">
                                    Đặt Ngay
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {item.name}
                                </h3>
                                <span className="text-orange-500 font-bold">
                                    {item.price.toLocaleString()} Đ
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-4 h-4 ${index < Math.floor(5)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    (8888 đánh giá)
                                </span>
                            </div>

                            {/* Category Tag */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {item.category}
                                </span>
                                <button className="text-orange-500 hover:text-orange-600 text-sm font-semibold">
                                    Xem chi tiết →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
                <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    <Link to="/menu">
                        Xem Tất Cả Món Ăn
                    </Link>
                </button>
            </div>
        </section>
    );
}