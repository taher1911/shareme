import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import MobilePin from "./MobilePin";
const breakPoints = {
  default: 4,
  3000: 5,
  2000: 4,
  1200: 3,
  1000: 2,
  500: 1,
};
const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakPoints}>
      {pins?.map((pin) => (
        <div key={pin._id}>
          <Pin pin={pin} className="w-max" />
          <MobilePin pin={pin} className="w-max" />
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
