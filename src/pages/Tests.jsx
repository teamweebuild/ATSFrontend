import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function TestPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="p-6 overflow-hidden max-h-screen">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Page</h1>
        <div className="w-16 h-1 bg-blue-500 rounded"></div>
      </div>

      {/* User Details Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            User Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{user?.name || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium">{user?.role || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email || 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Options Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Test Type</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visual Test */}
          <div 
            onClick={() => navigate("/visualtest")}
            className="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 group-hover:bg-blue-600 rounded-lg flex items-center justify-center mr-4 transition-colors duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                Visual Test
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive visual inspection of vehicle components and documentation
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
              <span className="mr-2">Start Test</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Functional Test */}
          <div 
            onClick={() => navigate("/functionaltest")}
            className="group cursor-pointer bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 group-hover:bg-green-600 rounded-lg flex items-center justify-center mr-4 transition-colors duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-800 transition-colors duration-300">
                Functional Test
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Complete functional testing of vehicle systems and performance metrics
            </p>
            <div className="flex items-center text-green-600 group-hover:text-green-700 font-medium">
              <span className="mr-2">Start Test</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
