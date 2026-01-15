import dynamic from "next/dynamic";

// Above-fold components - import directly for fast initial load
import Hero from "./components/hero/hero";
import Video from "./components/video/video";
import Offers from "./components/offers/offers";
import Activities from "./components/activities/activities";
import Breadcrumbs from "./components/breadcrumbs/breadcrumbs";

// Below-fold components - lazy load to reduce initial bundle
const Competition = dynamic(() => import("./components/competition/competition"));
const Carousel = dynamic(() => import("./components/carousel/carousel"));
const Infrastructures = dynamic(() => import("./components/infrastructures/infrastructures"));
const Restaurant = dynamic(() => import("./components/restaurant/restaurant"));
const History = dynamic(() => import("./components/history/history"));
const Infos = dynamic(() => import("./components/infos/infos"));
const Newsletter = dynamic(() => import("./components/newsletter/newsletter"));
const Map = dynamic(() => import("./components/map/map"));

export default function Home() {
  return (
    <div className="font-sans scroll-smooth">
      <Breadcrumbs items={[]} />
      <Hero />
      <Video />
      <Offers />
      <Activities />
      <Competition />
      <Carousel />
      <Infrastructures />
      <Restaurant />
      <History />
      <Infos />
      <Newsletter />
      <Map />
    </div>
  );
}
