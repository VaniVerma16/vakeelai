import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Scale, FileText, MessageSquare, Users, ChevronRight } from 'lucide-react';

function HomePage() {
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('user1');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const startNegotiation = useMutation(
    async (data) => {
      const response = await axios.post('https://convo-legal-mistral.onrender.com/negotiate', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        navigate(`/negotiation/${data.negotiation_id}`);
      },
      onError: (error) => {
        setError('Failed to start negotiation. Please try again.');
        console.error('Negotiation error:', error);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message to start the negotiation.');
      return;
    }
    setError('');
    startNegotiation.mutate({ speaker, message });
  };

  return (
    <div className="min-h-screen mt-10 w-full bg-gray-900 flex flex-col text-gray-200">
      {/* Header */}
      <div className="w-full py-8 bg-gray-800 shadow-md border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Scale className="text-brown-theme mr-3" size={36} />
            <h1 className="text-4xl font-bold text-white">VakeelAi</h1>
          </div>
          
          {/* Tagline */}
          <p className="text-center text-lg text-gray-300 mt-2">
            AI-powered legal negotiation assistance for fair and efficient resolutions
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center w-full px-4 py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="w-full max-w-6xl mx-auto">
          {/* Main Card */}
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full border border-gray-700">
            {/* Header Bar */}
            <div className="bg-brown-theme px-8 py-5">
              <h2 className="text-2xl font-semibold text-white">Start a New Negotiation</h2>
            </div>
            
            <div className="p-8">
              {/* Description */}
              <p className="text-gray-300 mb-8">
                Begin a new legal negotiation session. Our AI will help find a fair middle ground after both parties have exchanged their positions.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-brown-theme p-3 rounded-lg mr-3">
                    <MessageSquare className="text-white-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Intelligent Mediation</h3>
                    <p className="text-sm text-gray-400">AI-powered negotiation analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brown-theme p-3 rounded-lg mr-3">
                    <Users className="text-white-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Multiple Parties</h3>
                    <p className="text-sm text-gray-400">Support for two-party negotiations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brown-theme p-3 rounded-lg mr-3">
                    <FileText className="text-white-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Document Analysis</h3>
                    <p className="text-sm text-gray-400">Context-aware legal understanding</p>
                  </div>
                </div>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <label htmlFor="speaker" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role in the Negotiation
                  </label>
                  <select
                    id="speaker"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-theme bg-gray-800 text-white shadow-sm"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                  >
                    <option value="user1">Party One</option>
                    <option value="user2">Party Two</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Position Statement
                  </label>
                  <textarea
                    id="message"
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-theme bg-gray-800 text-white shadow-sm"
                    placeholder="Describe your position, terms, or the offer you'd like to propose..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <p className="mt-2 text-sm text-gray-400">
                    Be clear and specific about your requirements and concerns.
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-900 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-brown-theme text-white py-3 px-6 rounded-lg hover:bg-brown-theme focus:outline-none focus:ring-2 focus:ring-brown-theme focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md flex items-center justify-center transition duration-150"
                  disabled={startNegotiation.isLoading}
                >
                  {startNegotiation.isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Start Negotiation
                      <ChevronRight className="ml-2" size={20} />
                    </span>
                  )}
                </button>
              </form>
              
              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400">
                  By starting a negotiation, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
