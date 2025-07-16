import React from "react";
import wallpaper from "../assets/wallpaper.svg";

function EvaluateReportCapital({ dataGiven }) {
  const data = {
    companyName: "Vertex",
    description: "AI-driven platform for startup fundraising strategy.",
    market_focus: "SaaS / AI / Early-stage Tech",
    stage: "Seed",
    verdict: "Promising fit for select accelerators and early-stage VCs.",
    fundraising_status: "Preparing deck and early outreach",
    use_of_funds: "Product development, GTM, and hiring key talent",
    strengths: [
      "Strong founding team with domain experience",
      "Clear product-market fit in a growing sector",
      "Well-articulated GTM strategy",
    ],
    weaknesses: [
      "Limited traction metrics",
      "Needs more detailed financial projections",
    ],
    red_flags: [
      "Unclear customer acquisition cost (CAC)",
      "No existing investor commitments",
    ],
    score: 78, // out of 100

    accelerators: [
      {
        name: "Y Combinator",
        fit: "80%",
        chance: "23%",
        remarks:
          "Ideal fit for founder backing, needs improved ask and GTM clarity.",
      },
      {
        name: "Antler",
        fit: "85%",
        chance: "62%",
        remarks:
          "Global pre-seed accelerator, strong support for SaaS and tooling.",
      },
      {
        name: "Techstars",
        fit: "65%",
        chance: "12%",
        remarks:
          "Great match for founder enablement tools, would expect clearer CAC/LTV.",
      },
    ],

    venture_capitalists: [
      {
        name: "Better Capital",
        fit: "75%",
        chance: "20%",
        remarks:
          "Backs India-first SaaS at early stages, will like traction and model.",
      },
      {
        name: "Sequoia Surge",
        fit: "40%",
        chance: "20%",
        remarks: "Strong India-regional SaaS focus, will expect revenue logic.",
      },
      {
        name: "Peak XV",
        fit: "52%",
        chance: "24%",
        remarks: "Strong India-regional SaaS focus, will expect revenue logic.",
      },
      {
        name: "Lightspeed",
        fit: "52%",
        chance: "24%",
        remarks: "Strong India-regional SaaS focus, will expect revenue logic.",
      },
    ],
  };

  return (
    <div className="text-white px-5 py-9">
      <h5>{data.description}</h5>

      {/* Accelerators */}
      <div className="py-9">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Accelerators
        </h2>
        <div className="md:px-[9rem] pt-5">
          <div
            style={{
              gridTemplateColumns: "7rem 9rem 9rem 9rem 19rem", // Adjust as needed
            }}
            className="grid text-sm font-semibold text-gray-300  pb-4"
          >
            <span className=""></span>
            <span className="">NAME</span>
            <span className="">FIT</span>
            <span className="">CHANCE</span>
            <span className="text-center">REMARKS</span>
          </div>
          {data.accelerators.map((info, idx) => (
            <div
              key={idx}
              style={{
                gridTemplateColumns: "7rem 9rem 9rem 9rem 19rem", // Adjust as needed
              }}
              className="grid py-2 text-sm items-center"
            >
              <span>
                <div className="w-14 h-15 bg-gray-600 rounded"></div>
              </span>
              <span className="">{info.name}</span>
              <span className="text-4xl font-semibold">{info.fit}</span>
              <span className="text-4xl font-semibold">{info.chance}</span>
              <span className="text-gray-300">{info.remarks}</span>
            </div>
          ))}
        </div>
      </div>

      {/* wallpaper  */}
      <div
        className="my-9 relative text-center h-[4rem] md:h-[9rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        {/* Black overlay */}
        <div className="absolute inset-0 opacity-10"></div>

        {/* Text content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <p className="text-xl md:text-2xl text-white">
            Use{" "}
            <span className="font-semibold text-2xl md:text-3xl">
              Fundraising
            </span>{" "}
            to unlock the full <br /> potential of Vertx Flow in securing
            capital.
          </p>
        </div>
      </div>

      {/* Venture Capitalists */}
      <div className="py-9">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Venture Capitalists
        </h2>
        <div className="md:px-[9rem] pt-5">
          <div
            style={{
              gridTemplateColumns: "7rem 9rem 9rem 9rem 19rem", // Adjust as needed
            }}
            className="grid text-sm font-semibold text-gray-300  pb-4"
          >
            <span className=""></span>
            <span className="">NAME</span>
            <span className="">FIT</span>
            <span className="">CHANCE</span>
            <span className="text-center">REMARKS</span>
          </div>
          {data.venture_capitalists.map((info, idx) => (
            <div
              key={idx}
              style={{
                gridTemplateColumns: "7rem 9rem 9rem 9rem 19rem", // Adjust as needed
              }}
              className="grid py-2 text-sm items-center"
            >
              <span>
                <div className="w-14 h-15 bg-gray-600 rounded"></div>
              </span>
              <span className="">{info.name}</span>
              <span className="text-4xl font-semibold">{info.fit}</span>
              <span className="text-4xl font-semibold">{info.chance}</span>
              <span className="text-gray-300">{info.remarks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvaluateReportCapital;
