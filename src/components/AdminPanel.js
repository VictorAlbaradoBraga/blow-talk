import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get("/admin/users");
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    await axios.delete(`/admin/users/${userId}`);
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div>
      <h2>Painel Administrativo</h2>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.username} - {user.loggedIn ? "Online" : "Offline"}</span>
          <button onClick={() => deleteUser(user.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
