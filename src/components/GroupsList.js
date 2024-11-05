import React, { useEffect, useState } from "react";
import axios from "axios";

function GroupsList() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user-groups/${userId}`);
        setGroups(response.data);
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div>
      <h2>Grupos de Chat</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.group_id}>{group.group_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsList;
