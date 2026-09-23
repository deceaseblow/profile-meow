import React from "react";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif"
};
const imagesModules = import.meta.glob("../assets/gallery/*.jpg", { eager: true });
const images = Object.values(imagesModules).map((img) => img.default);

export default function Gallery() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8" style={fontStyle}>
        Gallery
      </h1>
      <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gallery ${index + 1}`}
            className="w-full h-auto object-contain rounded-lg transition-transform duration-300"
          />
        ))}
      </div>

    </div>
  );
}
