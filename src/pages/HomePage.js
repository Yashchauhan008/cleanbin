import React, { useState } from "react";
import DustbinList from "../components/DustbinList";
import DustbinRequests from "../components/DustbinRequests";
import UserList from "../components/UserList";

const HomePage = () => {
  // const [list, setList] = useState("dustbinList"); // Corrected setter function

  return (
    <>
      {/* <div>HomePage</div> */}
      {/* <button onClick={() => setList("dustbinList")}>Dustbin List</button>
      <button onClick={() => setList("userList")}>User List</button>
      <button onClick={() => setList("dustbinRequests")}>Dustbin Requests</button> */}

      {/* Conditional rendering */}
      <DustbinList/>
      {/* {list === "dustbinRequests" && <DustbinRequests/>} */}
      {/* {list === "userList" && <UserList/>} */}
    </>
  );
};

export default HomePage;
