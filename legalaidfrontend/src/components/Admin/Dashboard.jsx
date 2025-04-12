import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Dashboard.module.css';
import LawyersList from './LawyersList';
import ClientsList from './ClientsList';
import CasesList from './CasesList';
import AppointmentsList from './AppointmentsList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lawyers');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch templates when switching to Documents tab
  useEffect(() => {
    if (activeTab === 'documents') {
      const fetchTemplates = async () => {
        setLoadingTemplates(true);
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/document-templates');
          setTemplates(response.data.templates);
        } catch (error) {
          console.error('Error fetching templates:', error);
          setUploadError('Failed to load templates');
        } finally {
          setLoadingTemplates(false);
        }
      };
      fetchTemplates();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage('');
    setUploadError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/admin/upload-template',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadMessage(response.data.message);
      setUploadError('');
      setFile(null);
      document.getElementById('fileInput').value = '';
      // Refresh templates list
      const templatesResponse = await axios.get('http://127.0.0.1:5000/api/document-templates');
      setTemplates(templatesResponse.data.templates);
    } catch (error) {
      setUploadMessage('');
      setUploadError(error.response?.data?.error || 'Failed to upload template');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      <nav className={styles.nav}>
        <button
          className={activeTab === 'lawyers' ? styles.active : ''}
          onClick={() => setActiveTab('lawyers')}
        >
          Lawyers
        </button>
        <button
          className={activeTab === 'clients' ? styles.active : ''}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
        <button
          className={activeTab === 'cases' ? styles.active : ''}
          onClick={() => setActiveTab('cases')}
        >
          Cases
        </button>
        <button
          className={activeTab === 'appointments' ? styles.active : ''}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={activeTab === 'documents' ? styles.active : ''}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </nav>
      <main className={styles.main}>
        {activeTab === 'lawyers' && <LawyersList />}
        {activeTab === 'clients' && <ClientsList />}
        {activeTab === 'cases' && <CasesList />}
        {activeTab === 'appointments' && <AppointmentsList />}
        {activeTab === 'documents' && (
          <div className={styles.uploadSection}>
            <h2>Upload Document Template</h2>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <button type="submit" className={styles.uploadButton}>
                Upload
              </button>
            </form>
            {uploadMessage && <p className={styles.successMessage}>{uploadMessage}</p>}
            {uploadError && <p className={styles.errorMessage}>{uploadError}</p>}
            <h2>Uploaded Templates</h2>
            {loadingTemplates ? (
              <p>Loading templates...</p>
            ) : templates.length === 0 ? (
              <p>No templates uploaded yet.</p>
            ) : (
              <div className={styles.templatesList}>
                {templates.map((template) => (
                  <div key={template.download_url} className={styles.templateItem}>
                    <span>{template.filename}</span>
                    <a
                      href={`http://127.0.0.1:5000${template.download_url}`}
                      download
                      className={styles.downloadButton}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;