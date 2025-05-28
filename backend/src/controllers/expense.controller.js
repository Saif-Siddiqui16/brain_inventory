import { Expense } from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { amount, description, sharedWith } = req.body;
    const { groupId } = req.params;
    const userId = req.user.id;
const expense = await Expense.create({
      group: groupId,
      amount,
      description,
      paidBy: userId,
      sharedWith,
    });

    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    res.status(500).json({ message: "Error adding expense" });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    console.log(req.params.groupId)
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("sharedWith", "name email");

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};
