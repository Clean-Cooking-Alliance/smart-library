// src/pages/ExplorePage.tsx
// import React from 'react';
// //import { Map, Users, Calendar, Lightbulb } from 'lucide-react';
// import MapChart from "@/components/ui/mapchart"
// import Diagram from '@/components/ui/customerlifecycleflow';
// import FlowDiagram from '@/components/ui/ecosystemmap';
// import LineCurve from '@/components/ui/productlifecycleline';

// import '@xyflow/react/dist/style.css';

// interface Framework {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }

// const frameworks: Framework[] = [
//   {
//     id: 'region',
//     title: 'By Region',
//     description: 'Explore research by geographic regions and countries',
//     icon: <Map className="w-6 h-6" />
//   },
//   {
//     id: 'customer-lifecycle',
//     title: 'By Customer Lifecycle',
//     description: 'Browse through different stages of customer journey',
//     icon: <Users className="w-6 h-6" />
//   },
//   {
//     id: 'product-lifecycle',
//     title: 'By Product Lifecycle',
//     description: 'Understand research across product development stages',
//     icon: <Calendar className="w-6 h-6" />
//   },
//   {
//     id: 'technology',
//     title: 'By Technology',
//     description: 'Explore different clean cooking technologies',
//     icon: <Lightbulb className="w-6 h-6" />
//   }
// ];

// export const ExplorePage: React.FC = () => {
//   return (
//     <div className="mt-4 text-center py-6 items-start ml-12 mr-6">
//     <h1 className="text-2xl font-bold text-left">Not sure where to start?</h1>
//     <hr className="max-w-xs mb-4"></hr>
//     <div className="flex flex-col md:flex-row justify-center md:justify-between">
//       <div className="flex-1">
//         <h2 className="text-lg font-bold text-left">Explore by region</h2>
//         <h3 className="text-left text-sm">Click on a region or country to explore relevant literature</h3>
//         <MapChart results={results} setSearchQuery={setSearchQuery} />
//       </div>
//       <div className="flex-1 mb-4">
//         <h2 className="text-lg font-bold text-left">Explore by customer lifecycle</h2>
//         <h3 className="text-left text-sm">Click the customer lifecycle step you'd like to explore</h3>
//         <Diagram />
//       </div>
//     </div>
//     <div className="flex flex-col md:flex-row justify-center md:justify-between">
//       <div className="flex-1 md:basis-1/2 md:max-w-1/2 w-1/2">
//         <h2 className="text-lg font-bold text-left">Explore by product lifecycle</h2>
//         <h3 className="text-left text-sm">Click on the step you'd like to explore</h3>
//         <LineCurve />
//       </div>
//       <div className="flex-1 md:basis-1/2 md:max-w-1/2 w-1/2 px-4">
//         <h2 className="text-lg font-bold text-left">Explore by ecosystem map</h2>
//         <h3 className="text-left text-sm mb-4">Click the ecosystem stage you'd like to explore</h3>
//         <FlowDiagram />
//       </div>
//     </div>
//   </div>
//   )
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
// };