// src/pages/VerdictPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import MessageList from '../components/MessageList';

function VerdictPage() {
  const { negotiationId } = useParams();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  const [apiResponses, setApiResponses] = useState([]);
  const [loadingText, setLoadingText] = useState("Initializing analysis...");

  // Configure React Query with longer timeout and retry logic
  const { 
    data: negotiation, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery(
    ['negotiation', negotiationId],
    async () => {
      console.log(`[DEBUG] Fetching negotiation data for ID: ${negotiationId} (Attempt: ${retryCount + 1})`);
      try {
        const response = await axios.get(`https://convo-legal-mistral.onrender.com/negotiation/${negotiationId}`);
        
        // Log the full response to console
        console.log(`[DEBUG] API Response (${new Date().toISOString()}):`, response.data);
        
        // Store responses in state for debugging
        setApiResponses(prev => [...prev, {
          timestamp: new Date().toISOString(),
          data: response.data
        }]);
        
        // Check specific properties and log them
        console.log(`[DEBUG] Status: ${response.data?.status}`);
        console.log(`[DEBUG] Has verdict: ${Boolean(response.data?.verdict)}`);
        if (response.data?.verdict) {
          console.log(`[DEBUG] Verdict content:`, response.data.verdict);
        }
        
        return response.data;
      } catch (err) {
        console.error(`[DEBUG] API Error:`, err);
        console.error(`[DEBUG] Error details:`, {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          responseData: err.response?.data
        });
        throw err;
      }
    },
    {
      refetchInterval: isPolling ? 5000 : false, // Poll every 5 seconds if isPolling is true
      retry: 3,
      retryDelay: 2000,
      onSuccess: (data) => {
        console.log(`[DEBUG] Query onSuccess handler. Status: ${data.status}, Has verdict: ${Boolean(data.verdict)}`);
        // If verdict is available, stop polling
        if (data.status === 'completed' && data.verdict) {
          console.log(`[DEBUG] Verdict found, stopping polling`);
          setIsPolling(false);
        } else if (retryCount >= 12) { // 60 seconds (12 * 5s)
          console.log(`[DEBUG] Max retry count reached, stopping polling`);
          setIsPolling(false);
        }
      },
      onError: (err) => {
        console.error(`[DEBUG] Query onError handler:`, err);
      }
    }
  );

  // Add debug button to console
  useEffect(() => {
    console.log("[DEBUG] VerdictPage mounted for negotiation ID:", negotiationId);
    
    return () => {
      console.log("[DEBUG] VerdictPage unmounted");
    };
  }, [negotiationId]);

  // Increment retry counter when polling and update loading text
  useEffect(() => {
    if (isPolling) {
      const loadingTexts = [
        "Initializing analysis...",
        "Processing negotiation data...",
        "Applying AI models...",
        "Evaluating negotiation strategies...",
        "Identifying key points...",
        "Generating verdict..."
      ];
      
      const timer = setTimeout(() => {
        setRetryCount(prev => {
          const newCount = prev + 1;
          console.log(`[DEBUG] Incrementing retry count to ${newCount}`);
          
          // Update loading text based on progress
          const textIndex = Math.min(Math.floor(newCount / 2), loadingTexts.length - 1);
          setLoadingText(loadingTexts[textIndex]);
          
          // Auto-stop polling after 60 seconds (12 * 5s)
          if (newCount >= 12) {
            console.log(`[DEBUG] Max retry count reached in timer, stopping polling`);
            setIsPolling(false);
          }
          return newCount;
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isPolling, retryCount]);

  // Helper function to log all collected API responses to console
  const logAllResponses = () => {
    console.log("========== ALL API RESPONSES ==========");
    apiResponses.forEach((response, index) => {
      console.log(`Response #${index + 1} (${response.timestamp}):`);
      console.log(response.data);
      console.log("--------------------------------------");
    });
    console.log("=======================================");
  };

  // Main loading state with enhanced progress indicator
  if (isLoading || (isPolling && (!negotiation || !negotiation.verdict))) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <div className="flex flex-col items-center justify-center py-8">
          {/* Animated spinner with percentage */}
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-900"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
              style={{ animationDuration: '1.5s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-purple-400 font-bold text-lg">{Math.min(Math.round((retryCount / 12) * 100), 100)}%</span>
            </div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-2xl font-semibold text-gray-200 mb-3">AI Verdict Processing</h2>
          <p className="text-gray-300 text-center mb-5">
            {loadingText}
          </p>
          
          {/* Progress bar */}
          <div className="w-full max-w-md bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min((retryCount / 12) * 100, 100)}%` }}
            ></div>
          </div>
          
          {/* Did you know section */}
          <div className="mt-6 bg-gray-700 p-4 rounded-lg border border-gray-600 max-w-md">
            <h3 className="text-purple-300 font-medium mb-2 text-sm">Did you know?</h3>
            <p className="text-gray-300 text-sm">
              Our AI evaluates over 50 negotiation parameters to provide you with the most accurate and helpful feedback on your negotiation strategy.
            </p>
          </div>
          
          {/* Debug info (collapsible) */}
          <details className="mt-8 mb-6 p-4 bg-gray-700 rounded w-full max-w-md">
            <summary className="font-medium text-gray-300 cursor-pointer">Debug Info</summary>
            <div className="mt-2 pt-2 border-t border-gray-600">
              <p className="text-sm text-gray-300 mb-1">Negotiation ID: {negotiationId}</p>
              <p className="text-sm text-gray-300 mb-1">Retry Count: {retryCount}/12</p>
              <p className="text-sm text-gray-300 mb-1">API Responses: {apiResponses.length}</p>
              <p className="text-sm text-gray-300 mb-1">
                Latest Status: {apiResponses[apiResponses.length - 1]?.data?.status || 'Unknown'}
              </p>
              <button
                onClick={logAllResponses}
                className="mt-2 text-xs bg-gray-900 text-white py-1 px-2 rounded"
              >
                Log All Responses to Console
              </button>
            </div>
          </details>
          
          {retryCount >= 12 && (
            <div className="mt-4 text-center">
              <p className="text-amber-400 mb-3">
                The verdict is taking longer than expected.
              </p>
              <button
                onClick={() => {
                  console.log("[DEBUG] Manual retry initiated");
                  setRetryCount(0);
                  setIsPolling(true);
                  refetch();
                }}
                className="bg-purple-600 text-white py-2 px-4 mr-3 rounded-md hover:bg-purple-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(`/negotiation/${negotiationId}`)}
                className="bg-gray-600 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Return to Negotiation
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isError || !negotiation) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="text-red-400">
          <p>Error loading negotiation: {error?.message || "Could not retrieve data"}</p>
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <h3 className="font-medium text-gray-300 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-300 mb-1">Error: {error?.message}</p>
            <p className="text-sm text-gray-300 mb-1">Status: {error?.response?.status}</p>
            <p className="text-sm text-gray-300 mb-1">API Responses: {apiResponses.length}</p>
            <button
              onClick={logAllResponses}
              className="mt-2 text-xs bg-gray-900 text-white py-1 px-2 rounded"
            >
              Log All Responses to Console
            </button>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Check if negotiation is completed but verdict is still missing
  if (negotiation.status === 'completed' && !negotiation.verdict) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="text-amber-400">
          <p>The negotiation is complete, but the verdict is still being processed.</p>
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <h3 className="font-medium text-gray-300 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-300 mb-1">Negotiation ID: {negotiationId}</p>
            <p className="text-sm text-gray-300 mb-1">Status: {negotiation.status}</p>
            <p className="text-sm text-gray-300 mb-1">Has Verdict: {String(Boolean(negotiation.verdict))}</p>
            <p className="text-sm text-gray-300 mb-1">API Responses: {apiResponses.length}</p>
            <pre className="mt-2 text-xs bg-gray-600 p-2 rounded overflow-auto max-h-36 text-gray-300">
              {JSON.stringify(negotiation, null, 2)}
            </pre>
            <button
              onClick={logAllResponses}
              className="mt-2 text-xs bg-gray-900 text-white py-1 px-2 rounded"
            >
              Log All Responses to Console
            </button>
          </div>
          <div className="mt-4 flex">
            <button 
              onClick={() => {
                console.log("[DEBUG] Manual check initiated");
                setRetryCount(0);
                setIsPolling(true);
                refetch();
              }}
              className="bg-brown-theme text-white py-2 px-4 mr-4 rounded-md hover:bg-brown-theme"
            >
              Check Again
            </button>
            <button 
              onClick={() => navigate(`/negotiation/${negotiationId}`)}
              className="bg-gray-600 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Return to Negotiation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if negotiation status is not completed yet
  if (negotiation.status !== 'completed') {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="text-amber-400">
          <p>This negotiation is not completed yet. The AI will generate a verdict after 10 messages.</p>
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <h3 className="font-medium text-gray-300 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-300 mb-1">Negotiation ID: {negotiationId}</p>
            <p className="text-sm text-gray-300 mb-1">Status: {negotiation.status}</p>
            <p className="text-sm text-gray-300 mb-1">Message Count: {negotiation.messages?.length || 0}</p>
            <pre className="mt-2 text-xs bg-gray-600 p-2 rounded overflow-auto max-h-36 text-gray-300">
              {JSON.stringify(negotiation, null, 2)}
            </pre>
            <button
              onClick={logAllResponses}
              className="mt-2 text-xs bg-gray-900 text-white py-1 px-2 rounded"
            >
              Log All Responses to Console
            </button>
          </div>
          <button 
            onClick={() => navigate(`/negotiation/${negotiationId}`)}
            className="mt-4 bg-brown-theme text-white py-2 px-4 rounded-md hover:bg-brown-theme"
          >
            Return to Negotiation
          </button>
        </div>
      </div>
    );
  }

  console.log("[DEBUG] Rendering final verdict view with data:", negotiation);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-[90%] lg:max-w-2xl bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-2xl font-semibold text-gray-200">AI Verdict</h1>
          <p className="text-gray-400 mt-2">
            Based on the negotiation, our AI has provided the following summary and compromise.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-200 mb-3">Summary</h2>
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
              <p className="text-gray-300 whitespace-pre-line">
                {negotiation.verdict?.summary || "No summary provided."}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-200 mb-3">Compromise Proposal</h2>
            <div className="bg-brown-theme p-4 rounded-md border border-white">
              <p className="text-gray-200 whitespace-pre-line">
                {negotiation.verdict?.compromise || "No compromise proposal provided."}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-brown-theme text-white py-2 px-4 rounded-md hover:bg-brown-theme"
          >
            Start New Negotiation
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerdictPage;
