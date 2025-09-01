import HeroCarousel from "@/components/HeroCarousel";
import QuickCategories from "@/components/QuickCategories";
import PromotionsCarousel from "@/components/PromotionsCarousel";
import HotPicksCarousel from "@/components/HotPicksCarousel";
import UserShortcuts from "@/components/UserShortcuts";
import CommunityHighlights from "@/components/CommunityHighlights";
import ReviewsCarousel from "@/components/ReviewsCarousel";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Access Categories */}
      <QuickCategories />

      {/* Promotions & Weekly Specials */}
      <PromotionsCarousel />

      {/* Today's Hot Picks */}
      <HotPicksCarousel />

      {/* User Features Shortcuts */}
      <UserShortcuts />

      {/* Community Highlights */}
      <CommunityHighlights />

      {/* Customer Reviews */}
      <ReviewsCarousel />
    </div>
  );
};

export default Home;