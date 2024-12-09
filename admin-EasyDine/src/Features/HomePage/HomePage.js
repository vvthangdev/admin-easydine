import HeroSection from "../../components/HomePage/heroSection"
import Menu from "../../components/HomePage/menu"
import WhyChoseUs from "../../components/HomePage/whyChoseUs"
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