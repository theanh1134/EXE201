import React, { useState } from 'react';
import EmailVerification from './EmailVerification';

const TestEmailVerification = () => {
    const [showModal, setShowModal] = useState(false);

    const handleVerificationSuccess = (response) => {
        console.log('Verification successful:', response);
        setShowModal(false);
        alert('Xác thực thành công!');
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Email Verification Modal</h1>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Test Email Verification Modal
            </button>

            {showModal && (
                <EmailVerification
                    userId="test-user-id"
                    email="test@example.com"
                    onVerificationSuccess={handleVerificationSuccess}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default TestEmailVerification;






