"use client";

import Hero from "./components/hero/hero";
import Video from "./components/video/video";
import Offers from "./components/offers/offers";
import Activities from "./components/activities/activities";
import Carousel from "./components/carousel/carousel";
import Infrastructures from "./components/infrastructures/infrastructures";
import History from "./components/history/history";
import Infos from "./components/infos/infos";
import Newsletter from "./components/newsletter/newsletter";
import Map from "./components/map/map";

export default function Home() {
  return (
    <div className="font-sans scroll-smooth">
      <Hero />
      <Video />
      <Offers />
      <Activities />
      <Carousel />
      <Infrastructures />
      <History />
      <Infos />
      <Newsletter />
      <Map />
    </div>
  );
}
