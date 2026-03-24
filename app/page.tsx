import Header from "./components/Herder";
import HeroSlider from "./components/HeroSlider";
import PopularActivity from "./components/populer";
import ProductsList from "./components/ProductsList";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSlider />
      <ProductsList />
      <PopularActivity />
    </main>
  );
}
