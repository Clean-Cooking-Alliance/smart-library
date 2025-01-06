import React, { useState } from 'react';
import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

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

interface EcosystemMapProps {
  results: BaseSearchResult[];
  setSearchQuery: (query: string) => void;
}

const FlowDiagram: React.FC<EcosystemMapProps> = ({ setSearchQuery }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleStepClick = (stepName: string) => {
    setSearchQuery(stepName);
  };

  const styles = { width: '100%', height: '100%' };

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Cultural Taboos and Practices' }, style: { borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '2', position: { x: 75, y: 50 }, data: { label: 'Purchasing Behavior' }, style: { borderRadius: '50%', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '3', position: { x: 200, y: 100 }, data: { label: 'Cooking Habits' }, style: { borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '4', position: { x: 200, y: 200 }, data: { label: 'Household Financial Management' }, style: { borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '5', position: { x: 250, y: 35 }, data: { label: 'Utilities Pricing Trends' }, style: { borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '6', position: { x: 300, y: 105 }, data: { label: 'Cookstove Usage Behaviour' }, style: { borderRadius: '50%', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '7', position: { x: 350, y: 220 }, data: { label: 'Distribution and Availability' }, style: { borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
    { id: '8', position: { x: 425, y: 100 }, data: { label: 'Cookstove Satisfaction' }, style: { borderRadius: '50%', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #042449', fontSize: '50%' } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e6-8', source: '6', target: '8' },
    { id: 'e7-8', source: '7', target: '8' },
  ];

  const nodes = initialNodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      backgroundColor: node.id === hoveredNodeId ? 'rgba(86, 141, 67, 0.5)' : '#ffffff',
    },
  }));

  return (
    <div style={{ width: '90vw', height: '50vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={initialEdges}
        style={styles}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
        onNodeMouseLeave={() => setHoveredNodeId(null)}
        onNodeClick={(_, node) => handleStepClick(node.data.label)}
      />
    </div>
  );
};

export default FlowDiagram;
