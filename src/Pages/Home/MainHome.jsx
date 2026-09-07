import React from "react";
import Bannar from "./Bannar/Bannar";
import Main from "./Main/Main";
import OurServices from "./OurServices/OurServices";
import FeatureSection from "./FeatureSection/FeatureSection";
import PriorityBanner from "./PriorityBanner/PriorityBanner";
import TestimonialSection from "./TestimonialSection/TestimonialSection";
import FAQSection from "./FAQSection/FAQSection";

const MainHome = () => {
  return (
    <div>
      <Bannar />
      <Main />
      <OurServices />
      <FeatureSection />
      <PriorityBanner />
      <TestimonialSection />
      <FAQSection />
    </div>
  );
};

export default MainHome;