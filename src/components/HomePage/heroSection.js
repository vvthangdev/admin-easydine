import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-between px-4 md:px-20 py-12 bg-gradient-to-r from-orange-50 to-orange-100">
      <div className="flex flex-col gap-6 max-w-xl items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 text-center">
          Quản lý
          <span className="text-orange-500 block mt-2">Nhà hàng của bạn</span>
          Một cách thật dễ dàng
        </h1>

        <p className="text-lg md:text-xl text-gray-600 text-center">
          Hãy cùng trải nghiệm!
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full w-fit transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Khám phá ngay
        </button>
      </div>

      <div className="hidden md:block">
        <img
          src="../../Assets/HomePage/breadsup.jpg"
          alt="Bánh mì ngon"
          className="w-[500px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
