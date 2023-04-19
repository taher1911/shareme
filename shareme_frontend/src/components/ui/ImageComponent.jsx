import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";

const ImageComponent = ({ src, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);
  return (
    <>
      {!imageLoaded && (
        <Blurhash
          hash="3DNT,uIB~qr:"
          width="100%"
          height={320}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      {imageLoaded && (
        <img
          onLoad={() => setImageLoaded(true)}
          src={src}
          alt="user-post"
          loading="lazy"
          className={className}
        />
      )}
    </>
  );
};

export default ImageComponent;
