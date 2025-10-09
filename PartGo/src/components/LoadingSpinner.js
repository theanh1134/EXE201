import React from 'react';

/**
 * Reusable loading spinner component with different sizes and variants
 */
const LoadingSpinner = ({ 
    size = 'medium', 
    variant = 'primary', 
    text = '', 
    fullScreen = false,
    className = '' 
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
        xlarge: 'w-16 h-16'
    };

    const variantClasses = {
        primary: 'border-blue-500',
        secondary: 'border-gray-500',
        success: 'border-green-500',
        warning: 'border-yellow-500',
        danger: 'border-red-500',
        white: 'border-white'
    };

    const spinnerClasses = `
        inline-block
        ${sizeClasses[size]}
        border-2
        border-solid
        border-current
        border-r-transparent
        rounded-full
        animate-spin
        ${variantClasses[variant]}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const containerClasses = fullScreen 
        ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
        : 'flex items-center justify-center';

    const textClasses = `
        ml-3 text-sm font-medium
        ${variant === 'white' ? 'text-white' : 'text-gray-700'}
    `;

    return (
        <div className={containerClasses}>
            <div className="flex items-center">
                <div className={spinnerClasses} role="status" aria-label="Loading">
                    <span className="sr-only">Loading...</span>
                </div>
                {text && <span className={textClasses}>{text}</span>}
            </div>
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                
                .w-4 { width: 1rem; }
                .h-4 { height: 1rem; }
                .w-8 { width: 2rem; }
                .h-8 { height: 2rem; }
                .w-12 { width: 3rem; }
                .h-12 { height: 3rem; }
                .w-16 { width: 4rem; }
                .h-16 { height: 4rem; }
                
                .border-2 { border-width: 2px; }
                .border-solid { border-style: solid; }
                .border-current { border-color: currentColor; }
                .border-r-transparent { border-right-color: transparent; }
                .rounded-full { border-radius: 9999px; }
                
                .border-blue-500 { border-color: #3b82f6; }
                .border-gray-500 { border-color: #6b7280; }
                .border-green-500 { border-color: #10b981; }
                .border-yellow-500 { border-color: #f59e0b; }
                .border-red-500 { border-color: #ef4444; }
                .border-white { border-color: #ffffff; }
                
                .inline-block { display: inline-block; }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                
                .fixed { position: fixed; }
                .inset-0 { 
                    top: 0; 
                    right: 0; 
                    bottom: 0; 
                    left: 0; 
                }
                .bg-white { background-color: #ffffff; }
                .bg-opacity-75 { background-color: rgba(255, 255, 255, 0.75); }
                .z-50 { z-index: 50; }
                
                .ml-3 { margin-left: 0.75rem; }
                .text-sm { font-size: 0.875rem; }
                .font-medium { font-weight: 500; }
                .text-gray-700 { color: #374151; }
                .text-white { color: #ffffff; }
                
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `}</style>
        </div>
    );
};

/**
 * Full screen loading overlay
 */
export const FullScreenLoader = ({ text = 'Đang tải...', variant = 'primary' }) => (
    <LoadingSpinner 
        size="large" 
        variant={variant} 
        text={text} 
        fullScreen={true} 
    />
);

/**
 * Inline loading spinner for buttons
 */
export const ButtonLoader = ({ size = 'small', variant = 'white' }) => (
    <LoadingSpinner 
        size={size} 
        variant={variant} 
        className="mr-2" 
    />
);

/**
 * Card loading placeholder
 */
export const CardLoader = ({ text = 'Đang tải dữ liệu...' }) => (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <LoadingSpinner 
            size="medium" 
            variant="primary" 
            text={text} 
        />
        <style jsx>{`
            .p-8 { padding: 2rem; }
            .bg-gray-50 { background-color: #f9fafb; }
            .rounded-lg { border-radius: 0.5rem; }
        `}</style>
    </div>
);

/**
 * Table loading placeholder
 */
export const TableLoader = ({ rows = 5 }) => (
    <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex space-x-4 p-4 border-b">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        ))}
        
        <style jsx>{`
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            
            .space-x-4 > * + * { margin-left: 1rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .p-4 { padding: 1rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .border-b { border-bottom-width: 1px; border-color: #e5e7eb; }
            .rounded-full { border-radius: 9999px; }
            .bg-gray-300 { background-color: #d1d5db; }
            .h-4 { height: 1rem; }
            .h-10 { height: 2.5rem; }
            .w-10 { width: 2.5rem; }
            .w-1/2 { width: 50%; }
            .w-3/4 { width: 75%; }
            .flex-1 { flex: 1 1 0%; }
            .rounded { border-radius: 0.25rem; }
        `}</style>
    </div>
);

export default LoadingSpinner;
