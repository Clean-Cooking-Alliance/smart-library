// src/pages/ExplorePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Users, Calendar, Lightbulb } from 'lucide-react';

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

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (frameworkId: string) => {
    navigate(`/explore/${frameworkId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Explore Clean Cooking Research</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <Card 
            key={framework.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(framework.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {framework.icon}
                {framework.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{framework.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};