// src/pages/ExplorePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Users, Calendar, Lightbulb } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

interface Framework {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const frameworks: Framework[] = [
  {
    id: 'region',
    title: 'By Region',
    description: 'Explore research by geographic regions and countries',
    icon: <Map className="w-6 h-6" />
  },
  {
    id: 'customer-lifecycle',
    title: 'By Customer Lifecycle',
    description: 'Browse through different stages of customer journey',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'product-lifecycle',
    title: 'By Product Lifecycle',
    description: 'Understand research across product development stages',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 'technology',
    title: 'By Technology',
    description: 'Explore different clean cooking technologies',
    icon: <Lightbulb className="w-6 h-6" />
  }
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const MapChart = () => {
  return (
    <div style={{ width: "100%", height: "auto" }}> {/* Use CSS to control the size */}
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography style={{
                default: {
                  fill: "#EEE",
                },
                hover: {
                  fill: "#91BAD6",
                },
                pressed: {
                  fill: "#1E3f66",
                },
              }}
                key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

const Diagram = () => {
  const steps = [
    { title: "Awareness", description: "Create awareness through marketing" },
    { title: "Engagement", description: "Nurture leads through targeted contact" },
    { title: "Consideration", description: "Focus on communicating value-add" },
    { title: "Conversion", description: "Convert users to clean stoves" },
    { title: "Retention", description: "Turn new users into dedicated power users" },
    { title: "Loyalty", description: "Incentivize power users to refer new users" },
  ];

  return (
    <div className="flex items-center overflow-auto" style={{ width: "100%", height: "auto" }}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-900 text-white rounded-full flex flex-col items-center justify-center shadow-md">
              <h3 className="text-center text-[9px] font-semibold">{step.title}</h3>
              <p className="text-center text-[8px]">{step.description}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="text-blue-900 text-md font-bold">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

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

export const ExplorePage: React.FC = () => {
  return (
    <div className="mt-4 text-center py-6 items-start ml-12 mr-6">
      {/* <h1 className="text-2xl font-bold text-left">Not sure where to start?</h1> */}
      {/* <hr className="max-w-xs mb-4"></hr> */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-left">Explore by region</h2>
          <h3 className="text-left text-sm">Click on a region or country to explore relevant literature</h3>
          <MapChart />
        </div>
        <div className="flex-1 mb-4">
          <h2 className="text-lg font-bold text-left">Explore by customer lifecycle</h2>
          <h3 className="text-left text-sm mb-4">Click the customer lifecycle step you'd like to explore</h3>
          <Diagram />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-left">Explore by product lifecycle</h2>
          <h3 className="text-left text-sm mb-4">Click on the step you'd like to explore</h3>
          <LineCurve />
        </div>
        <div className="flex-1 px-4">
          <h2 className="text-lg font-bold text-left">Explore by ecosystem map</h2>
          <h3 className="text-left text-sm mb-4">Click the ecosystem stage you'd like to explore</h3>
          <FlowDiagram />
        </div>
      </div>
    </div>
  )
  // const navigate = useNavigate();

  // const handleCardClick = (frameworkId: string) => {
  //   navigate(`/explore/${frameworkId}`);
  // };

  // return (
  //   <div className="container mx-auto py-6">
  //     <h1 className="text-2xl font-bold mb-6">Explore Clean Cooking Research</h1>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       {frameworks.map((framework) => (
  //         <Card 
  //           key={framework.id}
  //           className="hover:shadow-lg transition-shadow cursor-pointer"
  //           onClick={() => handleCardClick(framework.id)}
  //         >
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               {framework.icon}
  //               {framework.title}
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <p className="text-gray-600">{framework.description}</p>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   </div>
  // );
};