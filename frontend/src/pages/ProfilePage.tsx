// frontend/src/pages/ProfilePage.tsx
import React from 'react';
import { useSavedDocuments } from '../context/SavedDocumentsContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ExternalLink } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { savedDocuments } = useSavedDocuments();

  return (
    <div className="container mx-auto py-6 px-4 flex-col max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="mb-6">
        {/* <img src="/path/to/profile-picture.jpg" alt="Profile" className="w-24 h-24 rounded-full mb-4" /> */}
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Saved Documents</h2>
        {savedDocuments.length === 0 ? (
          <p>No saved documents.</p>
        ) : (
          <div className="space-y-4">
            {savedDocuments.map((document) => (
              <Card key={document.document_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{document.title}</span>
                    <a 
                      href={document.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{document.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <Badge key={tag.id} variant={tag.category}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* <div> */}
        {/* <h2 className="text-xl font-bold mb-4">Settings</h2> */}
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button> */}
      {/* </div> */}
    </div>
  );
};