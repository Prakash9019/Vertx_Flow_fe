import React from "react";

function EvaluateReportOverview({ data }) {
  const {
    company_name = "Vertex",
    description = "No description provided.",
    market_focus,
    stage,
    verdict,
    fundraising_status,
    use_of_funds,
    strengths = [],
    team = [],
    weaknesses = [],
    red_flags = [],
    score,
  } = data;

  const fallback = "Missing";

  return (
    <div className="p-6">
      {/* Company Name & Description */}
      <h2 className="text-2xl font-semibold">{company_name}</h2>
      <p className="text-gray-400 mt-2">{description}</p>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Item title="Market Focus" value={market_focus || fallback} />
        <Item title="Stage" value={stage || fallback} />
        <Item title="Verdict" value={verdict?.label || fallback} />
        <Item
          title="Fundraising Status"
          value={fundraising_status || fallback}
        />
        <Item title="Ask" value={fallback} />
        <Item title="Use of Funds" value={use_of_funds || fallback} />
      </div>

      {/* Lists */}
      <Section title="Team" items={team} isTeam />
      <Section title="Strengths" items={strengths} color="green" />
      <Section title="Weaknesses" items={weaknesses} color="yellow" />
      <Section title="Red Flags" items={red_flags} color="red" />

      {/* Score */}
      {score && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">Score</h3>
          <p className="text-purple-600 font-semibold mt-1">
            {score.label} ({score.value}%)
          </p>
        </div>
      )}
    </div>
  );
}

function Item({ title, value }) {
  return (
    <div>
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-gray-300">{value}</p>
    </div>
  );
}

function Section({ title, items, isTeam = false, color = "purple" }) {
  const borderColors = {
    green: "border-l-4 border-green-600",
    yellow: "border-l-4 border-yellow-600",
    red: "border-l-4 border-red-600",
    purple: "border-l-4 border-purple-600",
  };

  return (
    <div className="mt-9 p-4 bg-[#0F0E16] rounded-md">
      {/* Title with side border only */}
      <div className="mb-3">
        <span className={`pl-3 ml-[-1rem] ${borderColors[color]}`}></span>
        <span className="text-2xl font-semibold text-white">{title}</span>
      </div>

      {/* List items */}
      {items.length > 0 ? (
        <ul className="space-y-2 text-gray-300">
          {items.map((item, index) => (
            <li key={index}>
              {isTeam ? (
                <>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">None</p>
      )}
    </div>
  );
}

export default EvaluateReportOverview;
