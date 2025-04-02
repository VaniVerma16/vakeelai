import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { FaPaperPlane, FaGavel, FaBalanceScale } from 'react-icons/fa';

function NegotiationPage() {
    const { negotiationId } = useParams();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef(null);

    const { data: negotiation, isLoading, isError, error } = useQuery(
        ['negotiation', negotiationId],
        async () => {
            const response = await axios.get(`https://convo-legal-mistral.onrender.com/negotiation/${negotiationId}`);
            return response.data;
        },
        { refetchInterval: 3000 }
    );

    const getNextSpeaker = () => {
        if (!negotiation?.messages || negotiation.messages.length === 0) {
            return 'user1';
        }
        return negotiation.messages[negotiation.messages.length - 1].speaker === 'user1' ? 'user2' : 'user1';
    };

    const sendMessage = useMutation(
        async (messageData) => {
            const response = await axios.post('https://convo-legal-mistral.onrender.com/negotiate', {
                negotiation_id: negotiationId,
                ...messageData,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                setMessage('');
                queryClient.invalidateQueries(['negotiation', negotiationId]);
                if (data.status === 'completed') {
                    navigate(`/verdict/${negotiationId}`);
                }
            },
        }
    );

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        sendMessage.mutate({ speaker: getNextSpeaker(), message });
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [negotiation?.messages]);

    useEffect(() => {
        if (negotiation?.status === 'completed') {
            navigate(`/verdict/${negotiationId}`);
        }
    }, [negotiation, negotiationId, navigate]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brown-theme"></div>
        </div>;
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
                    <div className="text-red-400 text-center">
                        <FaGavel className="mx-auto text-5xl mb-4" />
                        <p className="text-xl font-semibold mb-4">Error loading negotiation</p>
                        <p className="mb-6 text-gray-300">{error.message}</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="bg-brown-theme text-white py-2 px-6 rounded-full hover:bg-brown-theme transition duration-300"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 py-8">
            <div className="max-w-4xl w-full mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="bg-brown-theme text-white p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">LegalGPT Negotiation</h1>
                        <FaBalanceScale className="text-3xl text-brown-theme-300" />
                    </div>
                    <p className="text-sm mt-2 text-black-200">Case #{negotiationId}</p>
                    <div className="mt-4">
                        <span className="text-sm">
                            Status: <span className={`font-medium ${negotiation?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {negotiation?.status === 'active' ? 'In Progress' : 'Completed'}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="h-96 overflow-y-auto p-6 bg-gray-850 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {negotiation?.messages && (
                        <div className="space-y-4">
                            {negotiation.messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.speaker === 'user1' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        msg.speaker === 'user1' 
                                            ? 'bg-brown-theme text-purple-100 border border-black' 
                                            : 'bg-gray-700 text-gray-100 border border-gray-600'
                                    }`}>
                                        <p className="font-semibold mb-1 text-sm">{msg.speaker === 'user1' ? 'You' : 'Opponent'}</p>
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-gray-800 border-t border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow mr-4 p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brown-theme placeholder-gray-400"
                            disabled={negotiation?.status === 'completed'}
                        />
                        <button
                            type="submit"
                            className="bg-brown-theme text-white p-3 rounded-md hover:bg-brown-theme transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={sendMessage.isLoading || negotiation?.status === 'completed'}
                        >
                            <FaPaperPlane className="w-5 h-5" />
                        </button>
                    </form>

                    {negotiation?.status === 'completed' && (
                        <div className="mt-6 text-center">
                            <span className="text-gray-400">This negotiation has concluded. </span>
                            <button
                                onClick={() => navigate(`/verdict/${negotiationId}`)}
                                className="text- hover:text-purple-300 underline font-medium"
                            >
                                View Verdict
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NegotiationPage;