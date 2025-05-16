import React from "react";

function EvaluateReportSuggestions({ data }) {
  // const [] = data;
  return (
    <div className="pt-[4rem] px-5">
      <div>
        <h1 className="text-2xl font-semibold">
          <span className="w-1 h-6 bg-red-700 mr-2 ml-[-1rem] inline-block"></span>
          Immediate Fixes
        </h1>

        <div className="py-9">
          <div>
            <p className="text-xl font-semibold">Add “The Ask”</p>
            <p className="text-sm text-gray-400">
              Clearly state how much you are raising, funding round type (e.g.,
              $500K pre-seed SAFE), and your planned runway.
            </p>
          </div>
          <div className="py-5">
            <p className="text-xl font-semibold">Add “Use of Funds”</p>
            <p className="text-sm text-gray-400">
              Show where the capital will go (e.g., 40% Product, 30% GTM, 20%
              Hiring, 10% Ops).
            </p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          <span className="w-1 h-6 bg-amber-500 mr-2 ml-[-1rem] inline-block"></span>
          Highly Preferred
        </h1>

        <div className="py-9">
          <div>
            <p className="text-xl font-semibold">Include Unit Economics</p>
            <p className="text-sm text-gray-400">
              Even early CAC, LTV, and payback estimates will show business
              thinking.
            </p>
            <p className="text-sm text-gray-400">
              Add projected gross margin or burn rate if possible.
            </p>
          </div>
          <div className="py-5">
            <p className="text-xl font-semibold">Clarify GTM Strategy</p>
            <p className="text-sm text-gray-400">
              Add funnel projections (e.g., Free Users → Paid → Retained).
            </p>
            <p className="text-sm text-gray-400">
              Show how you're acquiring users: content, outbound, referrals,
              partnerships.
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            <span className="w-1 h-6 bg-green-500 mr-2 ml-[-1rem] inline-block"></span>
            Optional Optimizations
          </h1>

          <div className="py-9">
            <div>
              <p className="text-xl font-semibold">
                Add Screenshots or User Flow
              </p>
              <p className="text-sm text-gray-400">
                Show how Vertx works step-by-step to visualize the platform and
                build trust.
              </p>
            </div>
            <div className="py-5">
              <p className="text-xl font-semibold">Highlight Testimonials</p>
              <p className="text-sm text-gray-400">
                Place startup quotes about how Vertx saved time or improved
                fundraising outcomes.
              </p>
            </div>
            <div className="py-5">
              <p className="text-xl font-semibold">Refine Visuals & Content</p>
              <p className="text-sm text-gray-400">
                Clean up phrasing on a few slides (e.g., incomplete taglines),
                tighten formatting, and ensure visual consistency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluateReportSuggestions;
