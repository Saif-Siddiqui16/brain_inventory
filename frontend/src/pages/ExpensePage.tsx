import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

interface Expense {
  _id: string;
  amount: number;
  description: string;
  paidBy: {
    name: string;
    email: string;
  };
  sharedWith: string[];
}

const ExpensePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expense/${groupId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#1f2937] rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
            Expense Summary
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium capitalize transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Expenses */}
        <section className="mt-6 space-y-4">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400">No expenses found.</p>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-gray-800 p-5 rounded-xl shadow-md"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {exp.description}
                </h3>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Amount:</span>{" "}
                  ₹{exp.amount}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Paid By:</span>{" "}
                  {exp.paidBy.name} ({exp.paidBy.email})
                </p>
                <div className="text-sm text-gray-300">
                  <span className="font-medium text-white">Shared With:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {exp.sharedWith.map((email) => (
                      <li key={email} className="text-gray-400">
                        {email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default ExpensePage;
