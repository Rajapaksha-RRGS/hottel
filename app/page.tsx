import Header from "./components/Herder";
import HeroSlider from "./components/HeroSlider";
import PopularActivity from "./components/populer";


export default function Home() {
  return (
    <main>
      <Header />
      <HeroSlider />

      <PopularActivity />
    </main>
  );
}
