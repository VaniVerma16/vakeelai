function MessageList({ messages }) {
    if (!messages || messages.length === 0) {
      return <p className="text-gray-500 text-center py-4">No messages yet.</p>;
    }
  
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };
  
    return (
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.speaker === 'user1' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                msg.speaker === 'user1' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-xs">
                  {msg.speaker === 'user1' ? 'Party One' : 'Party Two'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default MessageList;