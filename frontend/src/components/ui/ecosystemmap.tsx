import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const FlowDiagram = () => {

    const styles = {
      width: '100%',
      height: 100,
    };
    const initialNodes = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Cultural Taboos and Practices' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '2', position: { x: 100, y: 100 }, data: { label: 'Purchasing Behavior' }, style: { borderRadius: '50%', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '3', position: { x: 250, y: 100 }, data: { label: 'Cooking Habits' }, style: { borderRadius: '50%', width: 75, height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '4', position: { x: 200, y: 250 }, data: { label: 'Household Financial Management' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '5', position: { x: 325, y: 50 }, data: { label: 'Utilities Pricing Trends' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '6', position: { x: 375, y: 200 }, data: { label: 'Cookstove Usage Behaviour' }, style: { borderRadius: '50%', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '7', position: { x: 450, y: 400 }, data: { label: 'Distribution and Availability' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      { id: '8', position: { x: 500, y: 100 }, data: { label: 'Cookstove Satisfaction' }, style: { borderRadius: '50%', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
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
    return (<div style={{ width: '100vw', height: '100vh' }}> <ReactFlow nodes={initialNodes} edges={initialEdges} style={styles} zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      panOnScroll={false} // Optional: Allows panning
    /> </div>);
  };

  export default FlowDiagram;