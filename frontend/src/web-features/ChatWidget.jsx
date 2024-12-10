import React, { useState, useEffect, useRef } from 'react';
import '../ChatWidget.css';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';

const ChatWidget = ({ Click }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([{text :"Hi! I'm Votly Electoral Bot, How Can i Help You?" , isUser:false}]);
    const [loading, setLoading] = useState(false);
    const chatBodyRef = useRef(null);
  

    const handleSend = async () => {
        if (prompt.trim() !== "") {
            const userMessage = { text: prompt, isUser: true };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            setPrompt("");
            setLoading(true);

            try {
                const response = await axios.post("/api/chat", { prompt });
               // console.log(response.data);
                const botMessage = { text: response.data, isUser: false };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error("Error getting response ChatWidget :: handleSend", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, loading]);

    

    return (
        <div className="chat-widget fixed-bottom mb-20 mr-4 border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="chat-header d-flex justify-content-between align-items-center mb-2">
                <h3 className="text-white">Chat with us!</h3>
                <button className="close-btn text-white" onClick={Click}>✕</button>
            </div>
            <div className="chat-body flex-grow-1 mb-2 overflow-auto" ref={chatBodyRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'} mb-2`}>
                        {message.isUser ? (
                            <span>{message.text}</span>
                        ) : (
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="message bot-message mb-2">
                        <span>Typing...</span>
                    </div>
                )}
            </div>
            <div className="chat-input d-flex">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="form-control me-2 bg-black text-white"
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
};

export default ChatWidget;





// import React, { useState, useEffect, useRef } from 'react';
// import '../ChatWidget.css';
// import axios from '../axios';
// import ReactMarkdown from 'react-markdown';

// const ChatWidget = ({ Click }) => {
//     const [prompt, setPrompt] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const chatBodyRef = useRef(null);

//     const handleSend = async () => {
//         if (prompt.trim() !== "") {
//             const userMessage = { text: prompt, isUser: true };
//             setMessages((prevMessages) => [...prevMessages, userMessage]);

//             setPrompt("");
//             setLoading(true);

//             try {
//                 const response = await axios.post("/chat", { prompt });
//               //  console.log(response.data);
//                 const botMessage = { text: response.data, isUser: false };
//                 setMessages((prevMessages) => [...prevMessages, botMessage]);
//             } catch (error) {
//                 console.error("Error getting response ChatWidget :: handleSend", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     useEffect(() => {
//         if (chatBodyRef.current) {
//             chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//         }
//     }, [messages, loading]);

//     return (
//         <div className="chat-widget fixed-bottom mb-20 mr-4 border border-gray-300 rounded-lg shadow-lg p-4">
//             <div className="chat-header d-flex justify-content-between align-items-center mb-2">
//                 <h3 className="text-white">Chat with us!</h3>
//                 <button className="close-btn text-white" onClick={Click}>✕</button>
//             </div>
//             <div className="chat-body flex-grow-1 mb-2 overflow-auto" ref={chatBodyRef}>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'} mb-2`}>
//                         {message.isUser ? (
//                             <span>{message.text}</span>
//                         ) : (
//                             <ReactMarkdown>{message.text}</ReactMarkdown>
//                         )}
//                     </div>
//                 ))}
//                 {loading && (
//                     <div className="message bot-message mb-2">
//                         <span>Typing...</span>
//                     </div>
//                 )}
//             </div>
//             <div className="chat-input d-flex">
//                 <input
//                     type="text"
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     className="form-control me-2 bg-black text-white"
//                     placeholder="Type your message..."
//                 />
//                 <button onClick={handleSend} className="btn btn-primary">Send</button>
//             </div>
//         </div>
//     );
// };

// export default ChatWidget;
