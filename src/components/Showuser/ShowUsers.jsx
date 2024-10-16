import React, { useEffect, useState } from "react";
import "./ShowUsers.css";


export default function ShowUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://luckywheelbackend.onrender.com/users/get")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

document.getElementById("root").style.backgroundImage="none";
  return (
    <div className="userlist">
      <h2 className="usertitle">Registered Users</h2>
      <table border={"2px grove white"}  className="userdata">
        <tr className="datatitle">
            <th>Serial Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone Number</th>
        </tr>
        {users.map((u,i) => (
          i>=96? <>
            <tr className="datalist">
                <td>{((((i+1-users.length)))*-1)+1}</td>
              <td> {u.name}</td>
              <td> {u.last_name}</td>
              <td> {u.email}</td>
              <td> {u.phone}</td>
            </tr>
          </>:
          <></>
        )).reverse()}
      </table>
    </div>
  );
}
