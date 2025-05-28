import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";



  interface Member {
  _id: string;
  uniqueId: string;
  email?: string; 
  user: {
    _id: string;
    name: string;
    email: string;
  } | null; 
}

export interface Group{
_id: string,
    name: string,
    createdBy: {
        _id: string,
        name: string,
        email: string
    },
    members: Member[],
  }

   

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [email, setEmail] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    sharedWith: [] as string[],
  });

  useEffect(() => {
    if (groupId) {
    fetchGroupDetails();
  }
  }, [groupId]);

  const navigate=useNavigate()
  const fetchGroupDetails = async () => {
    try {
      const res = await api.get(`/group/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/group/${groupId}/invite`, { email });
      alert("Invite sent!");
      setEmail("");
      fetchGroupDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to send invite");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/expense/${groupId}`, expenseForm);
      alert("Expense added");
      setExpenseForm({ amount: "", description: "", sharedWith: [] });
      
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  if (!group)
    return <div className="text-white p-4">Loading group details...</div>;

return (
<div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#1f2937] rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
            Expense Management
          </h1>

          {/* Top Icons */}
          <div className="flex gap-4">
            <button
            
                onClick={() => navigate(`/expense/${groupId}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium capitalize transition"
              >
                Expense
              </button>
            <button
            
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium capitalize transition"
              >
                Dashboard
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 p-6 bg-gray-800 rounded-xl text-center text-gray-300">
         <h1 className="text-3xl font-bold mb-4">{group?.name}</h1>
        {/*Members */}
        <section className="mb-8">
  <h2 className="text-xl font-semibold mb-4">Members</h2>
  <ul className="space-y-2">
    {group?.members.map((m) => (
      <li
        key={m.uniqueId}
        className="bg-gray-800 p-4 rounded flex justify-between items-center"
      >
        <div>
          <p className="font-medium">
            {m.user?.name || m.email || "Unknown"}
          </p>
          <p className="text-sm text-gray-400">
            {m.user?.email || m.email}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            m.user ? "bg-green-600 text-white" : "bg-yellow-500 text-black"
          }`}
        >
          {m.user ? "Registered" : "Pending Invitation"}
        </span>
      </li>
    ))}
  </ul>
</section>

{/*Invite */}

 <form onSubmit={handleInvite} className="mb-10 flex items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Invite by email"
            className="px-4 py-2 rounded text-white flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send Invite
          </button>
        </form>
 
        {/* Add Expense */}
        <form onSubmit={handleAddExpense} className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
          <input
            type="number"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, amount: e.target.value })
            }
            required
            className="w-full px-4 py-2 text-white rounded"
          />
          <input
            placeholder="Description"
            value={expenseForm.description}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, description: e.target.value })
            }
            required
            className="w-full px-4 py-2 text-white rounded"
          />

          {/* SharedWith: checkbox list of members */}
          <div>
            <p className="mb-2 font-medium">Shared With:</p>
            <div className="grid grid-cols-2 gap-2">
  {group.members.map((member) => {
  const memberId = member.user?._id || member.uniqueId; // can still be used as key
  const displayName = member.user?.name || member.email || "Pending User";
  const emailValue = member.user?.email || member.email; // the email to send

  return (
    <label key={memberId} className="flex items-center gap-2">
      <input
        type="checkbox"
        value={emailValue}
        checked={expenseForm.sharedWith.includes(emailValue!)}
        onChange={(e) => {
          const value = e.target.value;
          setExpenseForm((prev) => ({
            ...prev,
            sharedWith: prev.sharedWith.includes(value)
              ? prev.sharedWith.filter((id) => id !== value)
              : [...prev.sharedWith, value],
          }));
        }}
      />
      <span>{displayName}</span>
    </label>
  );
})}
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Expense
          </button>
        </form>


        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
