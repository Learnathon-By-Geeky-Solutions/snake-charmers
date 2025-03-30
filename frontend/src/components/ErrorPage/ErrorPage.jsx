import React from 'react';

function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="mb-8">
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
      
      <p className="text-lg text-gray-600 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="space-x-4">
        <a 
          href="/" 
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go Home
        </a>
        <a 
          href="/contact" 
          className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;