<div
        className="fixed bottom-2 left-0 w-full flex items-center justify-center"
        style={{ height: "4.375rem", background: "rgba(0, 0, 0, 0.90)" }}
      >
        <div
          className="flex items-center"
          style={{
            width: "20.75rem",
            height: "3.125rem",
            borderRadius: "0.5rem",
            background: "rgba(255, 255, 255, 0.94)",
            padding: "0 1rem",
            gap: "1rem",
          }}
        >
          <button
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110"
            style={{
              width: "2.375rem",
              height: "2.375rem",
              borderRadius: "0.25rem",
              background: "#000",
            }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="logo"
              style={{
                width: "1.2rem",
                height: "1.2rem",
              }}
            />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
          onClick={() => navigate("/playground/mockpitching/report")}
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110"
            style={{
              width: "2.5rem",
              height: "2.25rem",
              borderRadius: "0.25rem",
              background: "#AD6FDE",
            }}
          >
            <img
              src={ContactsIcon || "/placeholder.svg"}
              alt="Contacts"
              style={{ width: "1.2rem", height: "1.2rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img
              src={AddIcon || "/placeholder.svg"}
              alt="Add"
              style={{ width: "1.5rem", height: "1.5rem", filter: "invert(100%)" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img
              src={SpeedometerIcon || "/placeholder.svg"}
              alt="Speedometer"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img src={TuneIcon || "/placeholder.svg"} alt="Tune" style={{ width: "1.5rem", height: "1.5rem" }} />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
            onClick={() => navigate("/playground")}
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-105 text-xs font-medium"
            style={{
              width: "2.5rem",
              height: "1.875rem",
              borderRadius: "0.1875rem",
              background: "#33005C",
              color: "#AD6FDE",
            }}
          >
            EXIT
          </button>
        </div>
</div>