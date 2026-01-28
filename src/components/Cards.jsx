import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

import slide1Mobile from "../assets/slide1Mobile.png";
import slide2Mobile from "../assets/slide2Mobile.png";
import slide3Mobile from "../assets/slide3Mobile.png";
import useIsMobile from "../hooks/useIsMobile";

function Cards() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const EXCLUSIVE_ITEMS = [
    {
      title: "Website Exclusive",
      subtitle: "Go Beyond Limits",
      image: isMobile ? slide1Mobile : slide1,
      route: "/gamingKeyboard",
    },
    {
      title: "New Collection",
      subtitle: "Explore Premium Gear",
      image: isMobile ? slide2Mobile : slide2,
      route: "/gamingMouse",
    },
    {
      title: "Special Offers",
      subtitle: "Up to 50% Off",
      image: isMobile ? slide3Mobile : slide3,
      route: "/product/edkCfAGZdXX8FdVdd7Rl",
    },
  ];

  useEffect(() => {
    if (!isHovered) { 
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="container mx-auto px-4 py-12">
      <div
        className="relative rounded-xl overflow-hidden group h-96"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {EXCLUSIVE_ITEMS.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <Link to={item.route}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {EXCLUSIVE_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
