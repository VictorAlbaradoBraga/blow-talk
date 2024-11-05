import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { encryptMessage, decryptMessage } from "../utils/crypto";

// Conexão com o socket de grupo
const socket = io("http://localhost:3000/groups");

function GroupChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Recupera a chave simétrica do `localStorage`
  const sharedSecret = localStorage.getItem("symmetricKey");

  useEffect(() => {
    if (sharedSecret) {
      socket.on("group message", (data) => {
        const decryptedMessage = decryptMessage(data.msg, sharedSecret); // Usando sharedSecret
        setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
      });
    } else {
      console.error("Chave simétrica não encontrada.");
    }
  }, [sharedSecret]);

  const sendGroupMessage = () => {
    if (sharedSecret) {
      const encryptedMessage = encryptMessage(message, sharedSecret); // Usando sharedSecret
      socket.emit("send group message", { msg: encryptedMessage });
      setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
      setMessage("");
    } else {
      console.error("Chave simétrica não encontrada.");
    }
  };

  return (
    <div className="group-chat-container">
      <h2>Chat em Grupo</h2>
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
      <button onClick={sendGroupMessage}>Enviar</button>
    </div>
  );
}

export default GroupChat;
