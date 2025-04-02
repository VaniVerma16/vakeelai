import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HistoryPage() {
  const [negotiations, setNegotiations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch from a real endpoint that returns all negotiations
    // For demo purposes, we'll simulate by fetching a few specific IDs or using local storage
    const fetchNegotiations = async () => {
      setIsLoading(true);
      try {
        // This is a placeholder - in a real app, you would have an endpoint to list all negotiations
        // For demonstration, we're showing how you'd store and retrieve past negotiation IDs
        const savedNegotiationIds = JSON.parse(localStorage.getItem('negotiationIds') || '[]');
        
        if (savedNegotiationIds.length === 0) {
          setNegotiations([]);
          setIsLoading(false);
          return;
        }
        
        const negotiationsData = await Promise.all(
          savedNegotiationIds.map(async (id) => {
            try {
              const response = await axios.get(`https://convo-legal-mistral.onrender.com/negotiation/${id}`);
              return response.data;
            } catch (err) {
              console.error(`Failed to fetch negotiation ${id}:`, err);
              return null;
            }
          })
        );
        
        setNegotiations(negotiationsData.filter(Boolean));
      } catch (err) {
        setError('Failed to load negotiation history.');
        console.error('Error fetching history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNegotiations();
  }, []);
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleString();
  };

  // Helper to get a summary of the first message
  const getInitialTopic = (negotiation) => {
    if (!negotiation.messages || negotiation.messages.length === 0) {
      return 'No messages';
    }
    
    const firstMessage = negotiation.messages[0].text;
    if (firstMessage.length > 50) {
      return firstMessage.substring(0, 50) + '...';
    }
    return firstMessage;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-purple-500 border-t-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 border border-gray-700 rounded-lg max-w-4xl mx-auto">
      <div className="bg--800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-200">Negotiation History</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-brown-theme text-white py-2 px-4 rounded-md hover:bg-brown-theme transition duration-200"
          >
            Start New Negotiation
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-red-300 p-4 rounded-md mb-6 border border-red-700">
            {error}
          </div>
        )}

        {negotiations.length === 0 ? (
          <div className="text-center py-12 bg-gray-750 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-4">You haven't started any negotiations yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-brown-theme text-white py-2 px-4 rounded-md hover:bg-brown-theme transition duration-200"
            >
              Start Your First Negotiation
            </button>
          </div>
        ) : (
          <div className="border border-gray-700 rounded-md divide-y divide-gray-700">
            {negotiations.map((negotiation) => (
              <div 
                key={negotiation.negotiation_id} 
                className="p-4 hover:bg-gray-750 cursor-pointer transition duration-200"
                onClick={() => 
                  navigate(
                    negotiation.status === 'completed' 
                      ? `/verdict/${negotiation.negotiation_id}` 
                      : `/negotiation/${negotiation.negotiation_id}`
                  )
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-200">
                      Negotiation #{negotiation.negotiation_id}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {getInitialTopic(negotiation)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      negotiation.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'
                    }`}>
                      {negotiation.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {negotiation.messages ? `${negotiation.messages.length} messages` : '0 messages'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {negotiation.created_at ? formatDate(negotiation.created_at) : 'Unknown date'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
