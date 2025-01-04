import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Bookmark, User } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode;
  resetSearch: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, resetSearch }) => {
  const navigate = useNavigate();
  // const location = useLocation();

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheet = workbook.Sheets['Table for literature references'];
  //     const jsonData = XLSX.utils.sheet_to_json(sheet);

  //     const createJson = (row: any) => {
  //       if (row) {
  //         const tags: any[] = [];

  //         if (row['Region']) {
  //           const regions = row['Region'].split('\n');
  //           regions.forEach((region: string) => {
  //             tags.push({ name: region.replace("- ", "").trim(), category: "region" });
  //           });
  //         }

  //         if (row['Country'] && !row['Country'].toLowerCase().includes('not specific')) {
  //           const countries = row['Country'].split('\n');
  //           countries.forEach((country: string) => {
  //             tags.push({ name: country.replace("- ", "").trim(), category: "country" });
  //           });
  //         }

  //         if (row['Topic']) {
  //           const topics = row['Topic'].split('\n').map((topic: string) => topic.trim().replace("- ", ""));
  //           topics.forEach((topic: string) => {
  //             tags.push({ name: topic, category: "topic" });
  //           });
  //         }

  //         return {
  //           title: row['Title'],
  //           summary: row['Summary'],
  //           source_url: row['Link'],
  //           year_published: parseInt(row['Year Published'], 10),
  //           tags: tags
  //         };
  //       }
  //     };

  //     const jsonPayloads = jsonData.map(createJson);

  //     const url = 'http://localhost:8000/api/v1/documents/';
  //     const headers = {
  //       'accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     };

  //     for (const payload of jsonPayloads) {
  //       const response = await axios.post(url, payload, { headers });
  //       console.log(`Status: ${response.status}, Response: ${response.data}`);
  //     }
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-6 flex items-center justify-between">
        <a className="text-3xl font-bold text-gray-900" href="/" onClick={resetSearch}>
          Clean Cooking Smart Library
        </a>          
        {/* <input type="file" accept=".xlsx" onChange={handleFileChange} className="ml-auto" /> */}
          {/* <Tabs defaultValue={location.pathname === '/' ? 'search' : 'explore'} className="w-half max-w-md">
            <TabsList className="flex">
              <TabsTrigger
                value="search"
                onClick={() => navigate('/')}
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="explore"
                onClick={() => navigate('/explore')}
              >
                Explore
              </TabsTrigger>
            </TabsList>
          </Tabs> */}
          <div className="flex space-x-4 items-center">
            <User className="w-6 h-6 text-#042449 fill-current cursor-pointer" onClick={() => navigate('/profile')} />
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500">
            Clean Cooking Smart Library © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};