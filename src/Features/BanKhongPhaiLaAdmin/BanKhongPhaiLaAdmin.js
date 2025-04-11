
export default function BanKhongPhaiLaAdmin() {
    console.log("check thanh")
    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Thực đơn' },
        { path: '/reservation', label: 'Đặt bàn' },
        { path: '/contact', label: 'Liên hệ' },
    ];
    return (
        <div>
            <div className="text-red-600">
                Bạn không phải là admin!
            </div>
        </div>
    )
}