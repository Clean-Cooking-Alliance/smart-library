import React, { useState } from 'react';

interface CollapsibleSummaryProps {
  summary: string;
}

const CollapsibleSummary: React.FC<CollapsibleSummaryProps> = ({ summary }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const previewLimit = 550;

  const getPreviewText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    const preview = text.slice(0, limit);
    const lastPeriodIndex = preview.lastIndexOf('.');
    if (lastPeriodIndex !== -1) {
      return preview.slice(0, lastPeriodIndex + 1);
    }
    return preview;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <p className="text-gray-600 mb-3">
        {isCollapsed ? `${getPreviewText(summary, previewLimit)}...` : summary}
      </p>
      <button
        onClick={toggleCollapse}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {isSliced &&
          (isCollapsed ? 'Show more' : 'Show less')
        }
      </button>
    </div>
  );
};

export default CollapsibleSummary;