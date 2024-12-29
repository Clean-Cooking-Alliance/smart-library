// frontend/src/pages/ProfilePage.tsx
import React from 'react';
import { useSavedDocuments } from '../context/SavedDocumentsContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ExternalLink } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';


export const ProfilePage: React.FC = () => {
  const { savedDocuments } = useSavedDocuments();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets['Table for literature references'];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const createJson = (row: any) => {
        if (row) {
          const tags: any[] = [];

          if (row['Region']) {
            const regions = row['Region'].split('\n');
            regions.forEach((region: string) => {
              tags.push({ name: region.replace("- ", "").trim(), category: "region" });
            });
          }

          if (row['Country'] && !row['Country'].toLowerCase().includes('not specific')) {
            const countries = row['Country'].split('\n');
            countries.forEach((country: string) => {
              tags.push({ name: country.replace("- ", "").trim(), category: "country" });
            });
          }

          if (row['Topic']) {
            const topics = row['Topic'].split('\n').map((topic: string) => topic.trim().replace("- ", ""));
            topics.forEach((topic: string) => {
              tags.push({ name: topic, category: "topic" });
            });
          }

          return {
            title: row['Title'],
            summary: row['Summary'],
            source_url: row['Link'],
            year_published: parseInt(row['Year Published'], 10),
            tags: tags
          };
        }
      };

      const jsonPayloads = jsonData.map(createJson);

      const url = 'http://localhost:8000/api/v1/documents/';
      const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      };

      for (const payload of jsonPayloads) {
        const response = await axios.post(url, payload, { headers });
        console.log(`Status: ${response.status}, Response: ${response.data}`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto py-6 px-4 flex-col max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="mb-6">
        {/* <img src="/path/to/profile-picture.jpg" alt="Profile" className="w-24 h-24 rounded-full mb-4" /> */}
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>
      <hr></hr>
      <h1 className="text-2xl font-bold mt-6 mb-6">Import data from an Excel file</h1>
      <div className="mb-6">
        <input type="file" accept=".xlsx" onChange={handleFileChange} className="ml-auto" />
      </div>
      {/* <hr></hr>
      <div className="mt-6">
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
      </div> */}
      {/* <div> */}
        {/* <h2 className="text-xl font-bold mb-4">Settings</h2> */}
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button> */}
      {/* </div> */}
    </div>
  );
};