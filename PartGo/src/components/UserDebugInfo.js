import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserDebugInfo = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px'
        }}>
            <h4>User Debug Info</h4>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p><strong>user:</strong> {user ? 'exists' : 'null'}</p>
            {user && (
                <>
                    <p><strong>user.role:</strong> {user.role}</p>
                    <p><strong>user.companyId:</strong> {user.companyId || 'null'}</p>
                    <p><strong>user.email:</strong> {user.email}</p>
                    <p><strong>user.fullName:</strong> {user.fullName}</p>
                </>
            )}
        </div>
    );
};

export default UserDebugInfo;

