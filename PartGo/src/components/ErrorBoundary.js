import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        // Clear error state and reload the page
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        // Clear error state and navigate to home
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="error-boundary">
                    <div className="error-boundary-container">
                        <div className="error-icon">⚠️</div>
                        <h1>Oops! Có lỗi xảy ra</h1>
                        <p className="error-message">
                            Ứng dụng đã gặp lỗi không mong muốn. Chúng tôi xin lỗi vì sự bất tiện này.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-details">
                                <summary>Chi tiết lỗi (Development Mode)</summary>
                                <pre className="error-stack">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        
                        <div className="error-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={this.handleReload}
                            >
                                🔄 Tải lại trang
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={this.handleGoHome}
                            >
                                🏠 Về trang chủ
                            </button>
                        </div>
                    </div>
                    
                    <style jsx>{`
                        .error-boundary {
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                            padding: 20px;
                        }
                        
                        .error-boundary-container {
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            text-align: center;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                            width: 100%;
                        }
                        
                        .error-icon {
                            font-size: 64px;
                            margin-bottom: 20px;
                        }
                        
                        .error-boundary h1 {
                            color: #1f2937;
                            font-size: 28px;
                            font-weight: 700;
                            margin-bottom: 16px;
                        }
                        
                        .error-message {
                            color: #6b7280;
                            font-size: 16px;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        
                        .error-details {
                            text-align: left;
                            margin: 20px 0;
                            padding: 16px;
                            background: #f9fafb;
                            border-radius: 8px;
                            border: 1px solid #e5e7eb;
                        }
                        
                        .error-details summary {
                            cursor: pointer;
                            font-weight: 600;
                            color: #374151;
                            margin-bottom: 10px;
                        }
                        
                        .error-stack {
                            background: #1f2937;
                            color: #f9fafb;
                            padding: 16px;
                            border-radius: 6px;
                            font-size: 12px;
                            overflow-x: auto;
                            white-space: pre-wrap;
                        }
                        
                        .error-actions {
                            display: flex;
                            gap: 12px;
                            justify-content: center;
                            flex-wrap: wrap;
                        }
                        
                        .btn {
                            padding: 12px 24px;
                            border: none;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            text-decoration: none;
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                        }
                        
                        .btn-primary {
                            background: #3b82f6;
                            color: white;
                        }
                        
                        .btn-primary:hover {
                            background: #2563eb;
                            transform: translateY(-1px);
                        }
                        
                        .btn-secondary {
                            background: #f3f4f6;
                            color: #374151;
                            border: 1px solid #d1d5db;
                        }
                        
                        .btn-secondary:hover {
                            background: #e5e7eb;
                            transform: translateY(-1px);
                        }
                        
                        @media (max-width: 640px) {
                            .error-boundary-container {
                                padding: 24px;
                            }
                            
                            .error-boundary h1 {
                                font-size: 24px;
                            }
                            
                            .error-actions {
                                flex-direction: column;
                            }
                            
                            .btn {
                                width: 100%;
                                justify-content: center;
                            }
                        }
                    `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
