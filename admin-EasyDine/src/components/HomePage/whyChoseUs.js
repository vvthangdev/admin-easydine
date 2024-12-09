import { useNavigate } from 'react-router-dom';
export default function WhyChoseUs() {
    const navigate = useNavigate();
    const features = [
        {
            id: 1,
            icon: "🌟",
            title: "Chất Lượng Hàng Đầu",
            description: "Nguyên liệu tươi ngon được chọn lọc kỹ càng mỗi ngày",
            stat: "100%",
            statText: "Khách hàng hài lòng"
        },
        {
            id: 2,
            icon: "🚚",
            title: "Giao Hàng Nhanh Chóng",
            description: "Giao hàng trong vòng 30 phút trong khu vực nội thành",
            stat: "30",
            statText: "Phút giao hàng"
        },
        {
            id: 3,
            icon: "👨‍🍳",
            title: "Đầu Bếp Chuyên Nghiệp",
            description: "Đội ngũ đầu bếp với hơn 10 năm kinh nghiệm",
            stat: "15+",
            statText: "Đầu bếp chuyên nghiệp"
        },
        {
            id: 4,
            icon: "🏆",
            title: "Món Ăn Đặc Sắc",
            description: "Menu đa dạng với các món ăn đặc trưng của nhiều vùng miền",
            stat: "50+",
            statText: "Món ăn độc đáo"
        }
    ];

    return (
        <section className="py-16 px-4 md:px-20 bg-gradient-to-b from-white to-orange-50">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Tại Sao Chọn Chúng Tôi?
                </h2>
                <p className="text-gray-600">
                    Chúng tôi cam kết mang đến cho bạn những trải nghiệm ẩm thực tuyệt vời nhất
                    với chất lượng phục vụ hàng đầu
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
                    >
                        {/* Icon */}
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4">
                            {feature.description}
                        </p>

                        {/* Stats */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="text-2xl font-bold text-orange-500 mb-1">
                                {feature.stat}
                            </div>
                            <div className="text-sm text-gray-500">
                                {feature.statText}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
                <div className="bg-orange-500 text-white p-8 rounded-2xl max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Trải Nghiệm Ngay Hôm Nay
                    </h3>
                    <p className="mb-6 text-orange-100">
                        Đặt bàn ngay để thưởng thức những món ăn tuyệt vời của chúng tôi
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => { navigate("/reservation") }} className="bg-white text-orange-500 px-8 py-3 rounded-full hover:bg-orange-50 transition-colors duration-300">
                            Đặt Bàn Ngay
                        </button>
                        <button onClick={() => { navigate("/menu") }} className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300">
                            Xem Menu
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>4.9/5 đánh giá</span>
                </div>
                <div>•</div>
                <div>1000+ khách hàng hài lòng</div>
                <div>•</div>
                <div>Chứng nhận vệ sinh an toàn thực phẩm</div>
            </div>
        </section>
    );
}
