import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AwardsAndCertifications = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const certifications = [
    {
      id: 1,
      title: "Best Dental Clinic 2023",
      awardImage: process.env.PUBLIC_URL + "/images/award/award-image.png",
      certificateImage: process.env.PUBLIC_URL + "/images/award/certificate-1.png",
    },
    {
      id: 2,
      title: "Excellence in Implantology",
      awardImage: process.env.PUBLIC_URL + "/images/award/ECA-AWARD.png",
      certificateImage: process.env.PUBLIC_URL + "/images/award/certificate-2.png",
    },
    {
      id: 3,
      title: "Top Cosmetic Dentistry",
      awardImage: process.env.PUBLIC_URL + "/images/award/cme-award.png",
      certificateImage: process.env.PUBLIC_URL + "/images/award/certificate-3.png",
    },

  ];

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // 🔥 PERFECT SCROLL (ONE FULL SLIDE)
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-20 px-4 bg-blue-50">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Awards & Certifications
        </h2>

        <div className="relative">

          {/* LEFT BUTTON */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white p-3 rounded-full disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory scroll-smooth"
          >
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex-shrink-0 w-full snap-start px-2"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                  {/* IMAGE ROW */}
                  <div className="flex flex-col md:flex-row">

                    {/* AWARD */}
                    <div className="w-full md:w-1/2 h-64 md:h-96 p-4 md:p-6 bg-gray-100 flex items-center justify-center">
                      <img
                        src={cert.awardImage}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* CERTIFICATE */}
                    <div className="w-full md:w-1/2 h-64 md:h-96 p-4 md:p-6 bg-gray-100 flex items-center justify-center">
                      <img
                        src={cert.certificateImage}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                  </div>

                  {/* TITLE */}
                  <p className="text-center p-4 font-semibold">
                    {cert.title}
                  </p>

                  {/* BLUE UNDERLINE */}
                  <div className="h-1 bg-blue-500"></div>

                </div>
              </div>
            ))}
          </div>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white p-3 rounded-full disabled:opacity-40"
          >
            <ChevronRight />
          </button>

        </div>
      </div>
    </section>
  );
};

export default AwardsAndCertifications;
