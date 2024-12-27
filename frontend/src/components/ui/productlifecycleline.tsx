const LineCurve = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          width="40vw"
          height="40vh"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="#002744" />
  
          {/* Line curve */}
          <path
            d="M 50 150 
            C 100 100, 150 50, 200 50 
            S 300 100, 390 100"
            fill="none"
            stroke="#66cc66"
            strokeWidth="4"
          />
  
          {/* Dotted vertical lines */}
          <line x1="50" y1="200" x2="50" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="150" y1="200" x2="150" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="230" y1="200" x2="230" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="340" y1="200" x2="340" y2="10" stroke="#66cc66" strokeDasharray="4" />
  
  
          {/* Labels */}
          <text x="50" y="185" fill="#fff" fontSize="12" fontWeight="bold">
            Introduction
          </text>
          <text x="160" y="40" fill="#fff" fontSize="12" fontWeight="bold">
            Growth
          </text>
          <text x="240" y="50" fill="#fff" fontSize="12" fontWeight="bold">
            Maturity
          </text>
          <text x="350" y="120" fill="#fff" fontSize="12" fontWeight="bold">
            Decline
          </text>
        </svg>
      </div>
    );
  };

  export default LineCurve;