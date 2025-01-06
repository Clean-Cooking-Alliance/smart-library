import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

export const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Predefined username and password (for demonstration purposes)
  const correctCredentials = {
    username: "admin",
    password: "secret123",
  };

  // Handle login form submission
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === correctCredentials.username && password === correctCredentials.password) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect username or password");
    }
  };

  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    source_url: '',
    year_published: '',
    tags: '',
    resource_type: 'Academic Article',
  });

  
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadStatusFile, setUploadStatusFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus(null);

    const tags = formData.tags.split(',').map((tag) => {
      const [name, category] = tag.split(':').map((str) => str.trim());
      return { name, category };
    });

    const payload = {
      ...formData,
      year_published: parseInt(formData.year_published, 10),
      tags,
    };

    console.log('Payload:', payload);
    
    interface AxiosError {
      response?: {
        data: any;
      };
      message: string;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/documents/', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setUploadStatus(`Document added successfully: ${response.data.id}`);
      setFormData({
        title: '',
        summary: '',
        source_url: '',
        year_published: '',
        tags: '',
        resource_type: 'Academic Article', // Reset to default value
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Axios error:', 
        axiosError.response ? axiosError.response.data : axiosError.message
      );
      setUploadStatus('Failed to add document. Please try again.');
    }
  }


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets['Table for literature references'];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const createJson = (row: any) => {
        if (row) {
          const tags: any[] = [];

          // const resource_types: any[] = [];

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

          if (row['Technology']) {
            const technologies = row['Technology'].split('\n').map((technology: string) => technology.trim().replace("- ", ""));
            technologies.forEach((technology: string) => {
              tags.push({ name: technology, category: "technology" });
            });
          }
          
          if (row['Product lifecycle']) {
            const productLifecycles = row['Product lifecycle'].split('\n').map((lifecycle: string) => lifecycle.trim().replace("- ", ""));
            productLifecycles.forEach((lifecycle: string) => {
              tags.push({ name: lifecycle, category: "product_lifecycle" });
            });
          }
          
          if (row['Customer Journey']) {
            const customerJourneys = row['Customer Journey'].split('\n').map((journey: string) => journey.trim().replace("- ", ""));
            customerJourneys.forEach((journey: string) => {
              tags.push({ name: journey, category: "customer_journey" });
            });
          }

          // if (row['Type of Resource']) {
          //   const resourceTypes = row['Type of Resource'].split('\n').map((resourceType: string) => resourceType.trim().replace("- ", ""));
          //   resourceTypes.forEach((resourceType: string) => {
          //     resource_types.push({ name: resourceType, category: "resource_type" });
          //   });
          // }

          // console.log(row);

          return {
            title: row['Title'],
            summary: row['Summary'],
            source_url: row['Link'],
            year_published: parseInt(row['Year Published'], 10),
            tags: tags,
            resource_type: null,
            // resource_type: row['Type of Resource'],
          };
        }
      };

      const jsonPayloads = jsonData.map(createJson);

      const url = 'http://localhost:8000/api/v1/documents/';
      const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      };

      try {
        for (const payload of jsonPayloads) {
          await axios.post(url, payload, { headers });
        }
        setUploadStatusFile(`${file.name} imported successfully.`);
      } catch (error) {
        console.error(error);
        setUploadStatusFile(`Failed to import file. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Render the login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          // backgroundColor: "#f0f4f8",
          // fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: "300px",
            textAlign: "center",
          }}
        >
          {/* <h2
            style={{
              margin: "0 0 20px",
              fontSize: "20px",
              color: "#333",
            }}
          >
            Login to Access This Page
          </h2> */}
          <h1 className="text-2xl font-bold mb-3">Log In to Access This Page</h1>

          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              // style={{backgroundColor: "#007bff",
              //   color: "#fff",
              //   border: "none",
              //   padding: "10px 15px",
              //   borderRadius: "4px",
              //   cursor: "pointer",
              //   width: "100%",}}
              className="bg-[#042449] text-white px-4 py-2 rounded shadow cursor-pointer w-full"
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#0056b3";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#007bff";
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 px-4 flex-col max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="mb-6">
        {/* <img src="/path/to/profile-picture.jpg" alt="Profile" className="w-24 h-24 rounded-full mb-4" /> */}
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>
      <hr></hr>
      <h1 className="text-2xl font-bold mt-6 mb-6">Add New Document(s)</h1>
      <h2 className="text-xl font-bold mt-6 mb-4">Import From an Excel File</h2>
      <div className="mb-6">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          id="file-input"
          className="hidden"
        />
        <label htmlFor="file-input" className="ml-auto bg-[#042449] text-white px-4 py-2 rounded shadow cursor-pointer">
          Choose File
        </label>
        {isLoading && <div className="mt-4 text-sm text-blue-600">Loading...</div>}
      </div>
      {uploadStatusFile && (
        <div className={`mt-4 text-sm ${uploadStatusFile.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {uploadStatusFile}
        </div>
      )}
      <h2 className="text-xl font-bold mt-6 mb-4">Add a New Document Manually</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="source_url" className="block text-sm font-medium">
            Source URL
          </label>
          <input
            type="url"
            id="source_url"
            name="source_url"
            value={formData.source_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="year_published" className="block text-sm font-medium">
            Year Published
          </label>
          <input
            type="number"
            id="year_published"
            name="year_published"
            value={formData.year_published}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags (Format: name:category, separate multiple tags with commas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="resource_type" className="block text-sm font-medium">
            Resource Type
          </label>
          <select
            id="resource_type"
            name="resource_type"
            value={formData.resource_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="Academic Article">Academic Article</option>
            <option value="News">News</option>
            <option value="Video">Video</option>
            <option value="Podcast">Podcast</option>
            <option value="Journey Map">Journey Map</option>
            <option value="Discussion Brief">Discussion Brief</option>
            <option value="Stories">Stories</option>
            <option value="Webinar">Webinar</option>
            <option value="Case Study">Case Study</option>
            <option value="Factsheet">Factsheet</option>
            <option value="Country Action Plan">Country Action Plan</option>
            <option value="Research Report">Research Report</option>
            <option value="Tool/ Toolkit">Tool/ Toolkit</option>
            <option value="Journal Article">Journal Article</option>
            <option value="Field Research">Field Research</option>
            <option value="Market Assessments">Market Assessments</option>
            <option value="Progress Report">Progress Report</option>
            <option value="Persona">Persona</option>
            <option value="Strategy Document">Strategy Document</option>
            <option value="Policy Brief">Policy Brief</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#042449] text-white px-4 py-2 rounded shadow"
        >
          Add Document
        </button>
      </form>
      {uploadStatus && (
        <div className={`mt-4 text-sm ${uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};