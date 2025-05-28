import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";



interface Groups {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}


const Dashboard = () => {
  
  const[groups,setGroups]=useState<Groups[]>([])
const[groupName,setGroupName]=useState<string>('')
const[message,setMessage]=useState<string>('')  
const navigate=useNavigate()

useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/group/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
 e.preventDefault();
  try {
    const res = await api.post("/group", { name: groupName });
    if (res.status === 201) {
      setMessage(res.data.message);
      setGroupName("");
fetchGroups();
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  } catch (error) {
    console.log(error);
    setMessage("Failed to create group.");
    setTimeout(() => {
      setMessage('');
    }, 2000);
  }
  }

  const handleLogout=async()=>{
    try {
    await api.post("/auth/logout"); 
    navigate("/"); 
  } catch (err) {
    console.error("Logout failed", err);
  }
  }

  const handleDelete=async(groupId:string)=>{
    await api.delete(`/group/${groupId}`)
  fetchGroups()
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#1f2937] rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
            Expense Management
          </h1>

          {/* Sidebar Icons */}
          <div className="flex gap-4">
            
              <button
                
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium capitalize transition"
              >
                Logout
              </button>
            
          </div>

        </div>

<div className="flex flex-col gap-5 items-center justify-center ">
<form onSubmit={handleSubmit}>
    <div className="flex gap-5 items-center justify-center">
      <label className="text-2xl">Create Group</label>
  <input className="px-3 py-2 focus:outline-none" type="text" placeholder="group name" value={groupName} 
  onChange={(e)=>setGroupName(e.target.value)}
  />
    </div>
  <button type="submit" className="bg-blue-700 mt-10 w-full py-2 rounded-2xl">Create group</button>
</form>
{message && <p className="text-red-500">{message}</p>

}
</div>
      </div>
      <div className="mt-10">
  <h2 className="text-2xl font-semibold mb-4 text-blue-400">Your Groups</h2>

  {groups.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {groups.map((grp) => (
        <div
          key={grp._id}
          className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition duration-300 cursor-pointer hover:bg-gray-700"
          onClick={() => navigate(`/group/${grp._id}`)}
        >
         <div className="flex justify-between">
           <h3 className="text-xl font-medium capitalize text-white mb-2">{grp.name}</h3>
           <button onClick={(e)=>{
            e.stopPropagation()
            handleDelete(grp._id)
           }} className="z-50 bg-blue-700 w-10 rounded-2xl hover:opacity-80">x</button>
         </div>
          <p className="text-sm text-gray-400">
            Created by: <span className="text-blue-400">{grp.createdBy?.email || "Unknown"}</span>
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">No groups available.</p>
  )}
</div>
    </div>
  );
};

export default Dashboard;
