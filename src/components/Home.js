import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendsGroupsAndRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const friendsResponse = await axios.get(`http://localhost:3000/friends/${userId}`);
        const groupsResponse = await axios.get(`http://localhost:3000/user-groups/${userId}`);
        const requestsResponse = await axios.get(`http://localhost:3000/friend-requests/${userId}`);
        
        setFriends(friendsResponse.data);
        setGroups(groupsResponse.data);
        setFriendRequests(requestsResponse.data);
      } catch (error) {
        console.error("Erro ao carregar amigos, grupos e pedidos:", error);
      }
    };

    fetchFriendsGroupsAndRequests();
  }, []);

  // Função para enviar solicitação de amizade
  const addFriend = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3000/add-friend", {
        userId,
        friendUsername: newFriend
      });
      alert(response.data.message);
      setNewFriend("");
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      alert("Erro ao adicionar amigo.");
    }
  };

  // Função para criar um novo grupo
  const createGroup = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3000/create-group", {
        groupName: newGroupName,
        creatorId: userId
      });
      alert(response.data.message);
      setNewGroupName("");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      alert("Erro ao criar grupo.");
    }
  };

  // Função para aceitar um pedido de amizade
  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/accept-friend", { requestId });
      setFriendRequests(friendRequests.filter((request) => request.id !== requestId));
      alert("Amizade aceita!");
    } catch (error) {
      console.error("Erro ao aceitar pedido de amizade:", error);
      alert("Erro ao aceitar pedido de amizade.");
    }
  };

  // Função para recusar um pedido de amizade
  const declineFriendRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/decline-friend", { requestId });
      setFriendRequests(friendRequests.filter((request) => request.id !== requestId));
      alert("Pedido de amizade recusado.");
    } catch (error) {
      console.error("Erro ao recusar pedido de amizade:", error);
      alert("Erro ao recusar pedido de amizade.");
    }
  };

  // Funções para navegar para as conversas
  const startPrivateChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  const enterGroupChat = (groupId) => {
    navigate(`/group-chat/${groupId}`);
  };

  return (
    <div className="home-container">
      <h2>Bem-vindo ao Chat!</h2>

      {/* Adicionar amigo */}
      <div className="add-friend">
        <input
          type="text"
          placeholder="Nome de usuário do amigo"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
        />
        <button onClick={addFriend}>Adicionar Amigo</button>
      </div>

      {/* Criar grupo */}
      <div className="create-group">
        <input
          type="text"
          placeholder="Nome do grupo"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={createGroup}>Criar Grupo</button>
      </div>

      {/* Seção de pedidos de amizade */}
      <div className="friend-requests-section">
        <h3>Pedidos de Amizade</h3>
        {friendRequests.length > 0 ? (
          <ul>
            {friendRequests.map((request) => (
              <li key={request.id}>
                {request.username}
                <button onClick={() => acceptFriendRequest(request.id)}>Aceitar</button>
                <button onClick={() => declineFriendRequest(request.id)}>Recusar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há pedidos de amizade pendentes.</p>
        )}
      </div>

      <div className="friends-section">
        <h3>Amigos</h3>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} onClick={() => startPrivateChat(friend.id)}>
                {friend.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não tem amigos. Envie solicitações para começar a conversar!</p>
        )}
      </div>

      <div className="groups-section">
        <h3>Grupos</h3>
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li key={group.group_id} onClick={() => enterGroupChat(group.group_id)}>
                {group.group_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não participa de nenhum grupo.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
