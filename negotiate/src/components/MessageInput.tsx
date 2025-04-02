function MessageInput({ message, setMessage, handleSendMessage, isLoading, disabled }) {
    return (
      <form onSubmit={handleSendMessage} className="flex">
        <textarea
          className="flex-grow px-4 py-2 border text-black border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled || isLoading}
          rows="2"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={disabled || isLoading || !message.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    );
  }
  
  export default MessageInput;