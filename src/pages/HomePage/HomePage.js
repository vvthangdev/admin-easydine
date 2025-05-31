import HeroSection from "../../components/HomePage/HeroSection";
import WhyChoseUs from "../../components/HomePage/WhyChoseUs";
export default function HomePage() {
  return (
    <div>
      <div>
        {/*<Header logo="/Assets/Header/logoRestaurant.png" navLinks={navLinks} cl />*/}
        <HeroSection />
        {/* <Menu /> */}
        <WhyChoseUs />
        Các thành phần khác
      </div>
    </div>
  );
}
