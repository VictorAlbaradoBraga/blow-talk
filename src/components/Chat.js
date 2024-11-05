import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { encryptMessage, decryptMessage } from "../utils/crypto";

// Conexão com o socket privado
const socket = io("http://localhost:3000/users");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Recupera a chave simétrica do `localStorage`
  const sharedSecret = localStorage.getItem("symmetricKey");

  useEffect(() => {
    if (sharedSecret) {
      socket.on("receive message", (data) => {
        const decryptedMessage = decryptMessage(data.msg, sharedSecret); // Usando sharedSecret
        setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
      });
    } else {
      console.error("Chave simétrica não encontrada.");
    }
  }, [sharedSecret]);

  const sendMessage = () => {
    if (sharedSecret) {
      const encryptedMessage = encryptMessage(message, sharedSecret); // Usando sharedSecret
      socket.emit("send message", { msg: encryptedMessage });
      setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
      setMessage("");
    } else {
      console.error("Chave simétrica não encontrada.");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Privado</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default Chat;
