import HeroSection from "../../components/HomePage/HeroSection.js"
import WhyChoseUs from "../../components/HomePage/WhyChoseUs.js"
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
    )
}