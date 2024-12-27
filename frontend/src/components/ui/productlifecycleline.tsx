const LineCurve = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 400 180" // Adjusted viewBox height to reduce padding
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="white" />
  
          {/* Line curve */}
          <path
            d="M 50 150 
              C 100 100, 150 50, 200 50 
              S 300 100, 390 100"
            fill="none"
            stroke="blue"
            strokeWidth="4"
          />
  
          {/* Dotted vertical lines */}
          <line x1="50" y1="150" x2="50" y2="10" stroke="blue" strokeDasharray="4" />
          <line x1="150" y1="150" x2="150" y2="10" stroke="blue" strokeDasharray="4" />
          <line x1="230" y1="150" x2="230" y2="10" stroke="blue" strokeDasharray="4" />
          <line x1="340" y1="150" x2="340" y2="10" stroke="blue" strokeDasharray="4" />
          <line x1="390" y1="150" x2="390" y2="10" stroke="blue" strokeDasharray="4" />
  
          {/* Labels */}
          <text x="50" y="165" fill="blue" fontSize="12" fontWeight="bold">
            Introduction
          </text>
          <text x="160" y="40" fill="blue" fontSize="12" fontWeight="bold">
            Growth
          </text>
          <text x="240" y="50" fill="blue" fontSize="12" fontWeight="bold">
            Maturity
          </text>
          <text x="345" y="120" fill="blue" fontSize="12" fontWeight="bold">
            Decline
          </text>
        </svg>
      </div>
    );
  };
  
  export default LineCurve;