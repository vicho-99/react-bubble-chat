import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000/", {
  extraHeaders: {
    type: 'client'
  }
});

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isChatAvailable, setIsChatAvailable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatAvailable(value) {
      setIsChatAvailable(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chatAvailable', onChatAvailable);

    return () => {

      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chatAvailable', onChatAvailable);

    };

  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };


  return (

    <div
      className={`
      fixed 
      bottom-0
      right-0
      bg-white 
      border 
      border-gray-300 
      rounded 
      overflow-hidden 
      ${isOpen ? 'w-80' : 'w-30'}`}>

      <div
        onClick={!isOpen ? toggleChat : undefined}
        className={`
        bg-blue-500 
        text-white 
        py-2 
        px-2 
        flex
        ${!isOpen && 'cursor-pointer'}
        `}>

        <div className='flex w-full justify-between' >

          <span>{isChatAvailable ? 'En linea' : 'Enviame mensaje'}</span>

          {isOpen &&

            <span className='cursor-pointer' onClick={toggleChat} >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className='w-6 h-6'

                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.414 6.586a2 2 0 0 0-2.828 0L12 9.172L9.414 6.586a2 2 0 1 0-2.828 2.828L9.171 12l-2.585 2.586a2 2 0 1 0 2.828 2.828L12 14.828l2.586 2.586c.39.391.902.586 1.414.586s1.024-.195 1.414-.586a2 2 0 0 0 0-2.828L14.829 12l2.585-2.586a2 2 0 0 0 0-2.828z" />
              </svg>

            </span>}


        </div>

      </div>

      {isOpen && (


        isChatAvailable ? (

          <div className='w-full' >
            <div className="h-96 overflow-y-auto p-2">

              {messages.map((message, index) => (

                <div key={index} className={`mb-2 p-2 rounded ${message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-green-500 text-white self-start'}`}>
                  {message.text}
                </div>

              ))}

            </div>

            <div className="flex p-2">

              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 mr-2 border border-gray-300 rounded"
              />

              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
                Enviar
              </button>

            </div>

          </div>

        ) : (

          <div className='w-full p-3' >

            <div className='flex gap-4 flex-col ' >

              <span className='text-sm' >Completa el formulario a continuación y te contestaremos lo antes posible.</span>

              <div>

                <label
                  for="name"
                  className="block mb-2 text-sm font-medium text-gray-900 ">
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John"
                  required
                />

              </div>

              <div>

                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 ">
                  Email
                </label>

                <input
                  type="email"
                  id='email'
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John"
                  required
                />

              </div>

              <div>

                <label
                  for="message"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Message
                </label>

                <input
                  type="text"
                  id="message"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John"
                  required
                />

              </div>

              <button
                type="button"
                class="
                text-white 
                bg-blue-500  
                hover:bg-blue-600 
                focus:ring-4 
                focus:ring-blue-300 
                font-medium 
                rounded-lg 
                text-sm 
                px-5 
                py-1.5 
                me-2 
                mb-2 
                focus:outline-none
                w-full
                "
              >
                Enviar
              </button>

            </div>

          </div>

        )

      )}

    </div>

  );

}

export default App;
