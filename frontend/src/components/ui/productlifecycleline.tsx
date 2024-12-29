import React from 'react';

interface Tag {
  id?: number;
  name: string;
  category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'unknown';
}

interface BaseSearchResult {
  title: string;
  summary: string;
  source_url: string;
  relevance_score: number;
  source: 'internal' | 'external';
  tags: Tag[];
}

interface ProductLifecycleProps {
  results: BaseSearchResult[];
  setSearchQuery: (query: string) => void;
}

const LineCurve: React.FC<ProductLifecycleProps> = ({ setSearchQuery }) => {
  const handleStepClick = (stepName: string) => {
    const step = stepName;
    setSearchQuery(step);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 400 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100%" height="100%" fill="white" />

        <path
          d="M 50 150 
            C 100 100, 150 50, 200 50 
            S 300 100, 390 100"
          fill="none"
          stroke="#042449"
          strokeWidth="4"
        />

        <line x1="50" y1="150" x2="50" y2="10" stroke="#042449" strokeDasharray="4" />
        <line x1="150" y1="150" x2="150" y2="10" stroke="#042449" strokeDasharray="4" />
        <line x1="230" y1="150" x2="230" y2="10" stroke="#042449" strokeDasharray="4" />
        <line x1="340" y1="150" x2="340" y2="10" stroke="#042449" strokeDasharray="4" />
        <line x1="390" y1="150" x2="390" y2="10" stroke="#042449" strokeDasharray="4" />

        <rect x="50" y="10" width="100" height="140" fill="transparent" onMouseEnter={(e) => { e.currentTarget.style.fill = 'rgba(86, 141, 67, 0.5)'; e.currentTarget.style.cursor = 'pointer'; }} onMouseLeave={(e) => e.currentTarget.style.fill = 'transparent'} onClick={() => handleStepClick("Introduction")}/>
        <rect x="150" y="10" width="80" height="140" fill="transparent" onMouseEnter={(e) => { e.currentTarget.style.fill = 'rgba(86, 141, 67, 0.5)'; e.currentTarget.style.cursor = 'pointer'; }} onMouseLeave={(e) => e.currentTarget.style.fill = 'transparent'} onClick={() => handleStepClick("Growth")}/>
        <rect x="230" y="10" width="110" height="140" fill="transparent" onMouseEnter={(e) => { e.currentTarget.style.fill = 'rgba(86, 141, 67, 0.5)'; e.currentTarget.style.cursor = 'pointer'; }} onMouseLeave={(e) => e.currentTarget.style.fill = 'transparent'} onClick={() => handleStepClick("Maturity")}/>
        <rect x="340" y="10" width="50" height="140" fill="transparent" onMouseEnter={(e) => { e.currentTarget.style.fill = 'rgba(86, 141, 67, 0.5)'; e.currentTarget.style.cursor = 'pointer'; }} onMouseLeave={(e) => e.currentTarget.style.fill = 'transparent'} onClick={() => handleStepClick("Decline")}/>

        <text x="65" y="150" fill="#042449" fontSize="12" fontWeight="bold" onClick={() => handleStepClick("Introduction")}>
          Introduction
        </text>
        <text x="160" y="40" fill="#042449" fontSize="12" fontWeight="bold" onClick={() => handleStepClick("Growth")}>
          Growth
        </text>
        <text x="240" y="50" fill="#042449" fontSize="12" fontWeight="bold" onClick={() => handleStepClick("Maturity")}>
          Maturity
        </text>
        <text x="345" y="120" fill="#042449" fontSize="12" fontWeight="bold" onClick={() => handleStepClick("Decline")}>
          Decline
        </text>
      </svg>
    </div>
  );
};

export default LineCurve;