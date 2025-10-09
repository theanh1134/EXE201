import React, { useState } from 'react';
import api from '../../services/authAPI';

const Debug = () => {
    const [debugData, setDebugData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testFile, setTestFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);

    const fetchDebugData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/applications/debug');
            setDebugData(response.data);
        } catch (error) {
            console.error('Debug error:', error);
            setDebugData({ error: error.response?.data?.message || error.message });
        } finally {
            setLoading(false);
        }
    };

    const createSampleCompany = async () => {
        try {
            setLoading(true);
            const response = await api.post('/auth/create-sample-company');
            console.log('Company created:', response.data);
            await fetchDebugData();
        } catch (error) {
            console.error('Company creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const createSampleJob = async () => {
        try {
            setLoading(true);
            const response = await api.post('/jobs/create-sample');
            console.log('Job created:', response.data);
            await fetchDebugData();
        } catch (error) {
            console.error('Job creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const createSampleApplications = async () => {
        if (!debugData?.jobsList?.length) {
            alert('Cần tạo job trước');
            return;
        }

        try {
            setLoading(true);
            const jobId = debugData.jobsList[0]._id;
            const response = await api.post('/applications/create-sample', { jobId });
            console.log('Applications created:', response.data);
            await fetchDebugData();
        } catch (error) {
            console.error('Applications creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        setTestFile(e.target.files[0]);
    };

    const testFileUpload = async () => {
        if (!testFile) {
            alert('Chọn file trước');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', testFile);

            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUploadResult(response.data);
            console.log('Upload result:', response.data);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadResult({ error: error.response?.data?.message || error.message });
        } finally {
            setLoading(false);
        }
    };

    const testStatusUpdate = async () => {
        if (!debugData?.applicationsList?.length) {
            alert('Cần tạo applications trước');
            return;
        }

        try {
            setLoading(true);
            const applicationId = debugData.applicationsList[0]._id;
            const response = await api.post('/applications/test-status-update', {
                applicationId,
                status: 'reviewed'
            });
            console.log('Status update result:', response.data);
            await fetchDebugData();
        } catch (error) {
            console.error('Status update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>Debug Panel</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={fetchDebugData} disabled={loading}>
                    🔍 Fetch Debug Data
                </button>
                <button onClick={createSampleCompany} disabled={loading} style={{ marginLeft: '10px' }}>
                    🏢 Create Sample Company
                </button>
                <button onClick={createSampleJob} disabled={loading} style={{ marginLeft: '10px' }}>
                    💼 Create Sample Job
                </button>
                <button onClick={createSampleApplications} disabled={loading} style={{ marginLeft: '10px' }}>
                    📝 Create Sample Applications
                </button>
                <button onClick={testStatusUpdate} disabled={loading} style={{ marginLeft: '10px' }}>
                    🔄 Test Status Update
                </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>Test File Upload</h3>
                <input type="file" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt" />
                <button onClick={testFileUpload} disabled={!testFile || loading} style={{ marginLeft: '10px' }}>
                    📤 Test Upload
                </button>
                {uploadResult && (
                    <div style={{ marginTop: '10px' }}>
                        <h4>Upload Result:</h4>
                        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '3px' }}>
                            {JSON.stringify(uploadResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {loading && <p>Loading...</p>}

            {debugData && (
                <div>
                    <h3>Debug Data:</h3>
                    <pre style={{
                        background: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '5px',
                        overflow: 'auto',
                        maxHeight: '500px'
                    }}>
                        {JSON.stringify(debugData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Debug;
