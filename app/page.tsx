import IntroScene from "./components/story/IntroScene";
import CollectionScene from "./components/story/CollectionScene";
import CommunityScene from "./components/story/CommunityScene";
import SplashScreen from "./components/ui/SplashScreen";
import Navbar from "./components/ui/Navbar";
import Breakdown from "./components/story/Breakdown";
import TifoCupScene from "./components/story/TifoCupScene";
import MerchScene from "./components/story/MerchScene";
import SponsorsScene from "./components/story/SponsorsScene";

export default function Home() {
  return (
    <SplashScreen>
      <Navbar />
      <main className="bg-black text-white">
        <IntroScene />
        <Breakdown />
        <CollectionScene />
        <TifoCupScene />
        <CommunityScene />
        <MerchScene />
        <SponsorsScene />
      </main>
    </SplashScreen>
  );
}
