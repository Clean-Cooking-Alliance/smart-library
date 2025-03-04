import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const resourceTypes = [
  "Academic Article",
  "News",
  "Video",
  "Podcast",
  "Journey Map",
  "Discussion Brief",
  "Stories",
  "Webinar",
  "Case Study",
  "Factsheet",
  "Country Action Plan",
  "Research Report",
  "Tool/ Toolkit",
  "Journal Article",
  "Field Research",
  "Market Assessments",
  "Progress Report",
  "Persona",
  "Strategy Document",
  "Policy Brief",
  "Blog"
];

export const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || '';

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const token = Cookies.get('sessionToken');
    const savedUsername = Cookies.get('username');
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/users/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.session_id) {
        Cookies.set('sessionToken', response.data.session_id, {
          expires: 1,
          secure: true,
          sameSite: 'Strict',
        });
        Cookies.set('username', username, { expires: 1 });
        setIsAuthenticated(true);
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      alert("Incorrect username or password");
    }
  };

  const handleLogout = () => {
    Cookies.remove('sessionToken');
    Cookies.remove('username');
    setIsAuthenticated(false);
    setUsername("");
  };

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    source_url: '',
    year_published: '',
    tags: '',
    resource_type: 'Academic Article',
  });

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [documentUploadStatus, setDocumentUploadStatus] = useState<string | null>(null);
  const [userUploadStatus, setUserUploadStatus] = useState<string | null>(null);
  const [uploadStatusFile, setUploadStatusFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentUploadStatus(null);

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
      const response = await api.post('/api/v1/documents/', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setDocumentUploadStatus(`Document added successfully: ${response.data.id}`);
      setFormData({
        title: '',
        summary: '',
        source_url: '',
        year_published: '',
        tags: '',
        resource_type: 'Academic Article',
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Axios error:',
        axiosError.response ? axiosError.response.data : axiosError.message
      );
      setDocumentUploadStatus('Failed to add document. Please try again.');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserUploadStatus(null);

    const payload = {
      ...userData,
    };

    try {
      const response = await api.post('/api/v1/users/', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setUserUploadStatus(`User added successfully: ${response.data.id}`);

      console.log(userData);

      if (!isAuthenticated) {
        setUserData({
          email: '',
          password: '',
        });
      }

      setIsAuthenticated(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        'Axios error:',
        axiosError.response ? axiosError.response.data : axiosError.message
      )
      setUserUploadStatus('User already exists. Please try again.');
    }
  };

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
          let resourceType = null;

          if (row['Region']) {
            const regions = row['Region'].split('\n');
            regions.forEach((region: string) => {
              const trimmedRegion = region.replace("- ", "").trim();
              if (trimmedRegion) {
                tags.push({ name: trimmedRegion, category: "region" });
              }
            });
          }
          
          if (row['Country'] && !row['Country'].toLowerCase().includes('not specific')) {
            const countries = row['Country'].split('\n');
            countries.forEach((country: string) => {
              const trimmedCountry = country.replace("- ", "").trim();
              if (trimmedCountry) {
                tags.push({ name: trimmedCountry, category: "country" });
              }
            });
          }
          
          if (row['Topic']) {
            const topics = row['Topic'].split('\n').map((topic: string) => topic.trim().replace("- ", ""));
            topics.forEach((topic: string) => {
              if (topic) {
                tags.push({ name: topic, category: "topic" });
              }
            });
          }
          
          if (row['Technology']) {
            const technologies = row['Technology'].split('\n').map((technology: string) => technology.trim().replace("- ", ""));
            technologies.forEach((technology: string) => {
              if (technology) {
                tags.push({ name: technology, category: "technology" });
              }
            });
          }
          
          if (row['Product lifecycle']) {
            const productLifecycles = row['Product lifecycle'].split('\n').map((lifecycle: string) => lifecycle.trim().replace("- ", ""));
            productLifecycles.forEach((lifecycle: string) => {
              if (lifecycle) {
                tags.push({ name: lifecycle, category: "product_lifecycle" });
              }
            });
          }
          
          if (row['Customer Journey']) {
            const customerJourneys = row['Customer Journey'].split('\n').map((journey: string) => journey.trim().replace("- ", ""));
            customerJourneys.forEach((journey: string) => {
              if (journey) {
                tags.push({ name: journey, category: "customer_journey" });
              }
            });
          }

          if (row['Type of Resource']) {
            resourceType = row['Type of Resource'].split('\n')[0]
              .trim()
              .replace("- ", "")
              .toLowerCase()
              .split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }

          return {
            title: row['Title'],
            summary: row['Summary'],
            source_url: row['Link'],
            year_published: parseInt(row['Year Published'], 10),
            tags: tags,
            resource_type: resourceTypes.includes(resourceType) ? resourceType : null
          };
        }
      };

      const jsonPayloads = jsonData.map(createJson);

      const url = '/api/v1/documents/';
      const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      };

      try {
        const validPayloads = jsonPayloads.filter(payload => payload !== null);
        let successCount = 0;
        let errorCount = 0;
      
        for (const payload of validPayloads) {
          try {
            await api.post(url, payload, { headers });
            successCount++;
          } catch (error) {
            const axiosError = error as AxiosError;
            errorCount++;
            console.error('Error uploading document:', axiosError.response?.data || axiosError.message);
            console.error('Problematic payload:', payload);
          }
        }
      
        if (errorCount === 0) {
          setUploadStatusFile(`${file.name}: All ${successCount} documents imported successfully.`);
        } else {
          setUploadStatusFile(`${file.name}: ${successCount} documents imported successfully, ${errorCount} failed. Check console for details.`);
        }
      } catch (error) {
        console.error('Upload process error:', error);
        setUploadStatusFile(`Failed to import file. Please check the console for details.`);
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
          <h1 className="text-2xl font-bold mb-3">Log In to Access This Page</h1>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#042449] text-white px-4 py-2 rounded shadow cursor-pointer w-full"
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
        <p className="text-gray-600">{username}</p>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mb-4 rounded shadow">
        Logout
      </button>
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
        {isLoading && <div className="mt-4 text-sm text-blue-600">Please stay on this page while the document is loading...</div>}
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
      {documentUploadStatus && (
        <div className={`mt-4 text-sm ${documentUploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {documentUploadStatus}
        </div>
      )}
      <h1 className="text-2xl font-bold mt-6 mb-6">Add New User</h1>
      <form onSubmit={handleUserSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleUserInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleUserInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#042449] text-white px-4 py-2 rounded shadow"
        >
          Add User
        </button>
      </form>
      {userUploadStatus && (
        <div className={`mt-4 text-sm ${userUploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {userUploadStatus}
        </div>
      )}
    </div>
  );
};