import React, { useState } from 'react';

interface CollapsibleSummaryProps {
  summary: string;
}

const CollapsibleSummary: React.FC<CollapsibleSummaryProps> = ({ summary }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const previewLimit = 550;

  const getPreviewText = (text: string, limit: number): [string, boolean] => {
    if (text.length <= limit) return [text, false];
    const preview = text.slice(0, limit);
    const lastPeriodIndex = preview.lastIndexOf('.');
    if (lastPeriodIndex !== -1) {
      return [preview.slice(0, lastPeriodIndex + 1), true];
    }
    return [preview, true];
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [previewText, isSliced] = getPreviewText(summary, previewLimit);

  return (
    <div>
      <p className="text-gray-600 mt-3">
        {isCollapsed ? `${previewText}${isSliced ? '...' : ''}` : summary}
      </p>
      <button
        onClick={toggleCollapse}
        className="text-blue-600 hover:text-blue-800 hover:underline mb-6"
      >
        {isSliced &&
          (isCollapsed ? 'Show more' : 'Show less')
        }
      </button>
    </div>
  );
};

export default CollapsibleSummary;