import React, { useEffect, useState } from "react";
import axios from "axios";

function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/friends/${userId}`);
        setFriends(response.data);
      } catch (error) {
        console.error("Erro ao buscar amigos:", error);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div>
      <h2>Lista de Amigos</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
