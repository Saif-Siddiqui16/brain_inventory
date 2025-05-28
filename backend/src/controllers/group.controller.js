import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "../utils/email.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newGroup = await Group.create({
      name,
      createdBy: userId,
      members: [{ user: userId, uniqueId: uuidv4() }],
    });

    res.status(201).json({ message: "Group created", group: newGroup });
  } catch (err) {
    res.status(500).json({ message: "Error creating group" });
  }
};

export const editGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { name },
      { new: true }
    );
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json({ message: "Group updated", group });
  } catch (err) {
    res.status(500).json({ message: "Error updating group" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting group" });
  }
};

export const inviteMember = async (req, res) => {
  try {
const groupId = req.params.id;
    const { email } = req.body;
    const inviterId = req.user.id; 

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.createdBy.toString() !== inviterId) {
      return res.status(403).json({ message: "Only group creator can invite" });
    }
    const alreadyMember=group.members.find(m=>m.email===email)
    if (alreadyMember) {
      return res.status(400).json({ message: "User already invited" });
    }

    const user = await User.findOne({ email });

    const uniqueId = generateUniqueId(email, group.name);

    group.members.push({
      user: user ? user._id : null,
      email,
      uniqueId,
    })

    let mailOptions;

    if (user) {

      mailOptions = {
        from: '"Group Expense App" <no-reply@example.com>',
        to: email,
        subject: `Invitation to join group "${group.name}"`,
        text: `Hi ${user.name},\n\nYou've been invited to join the group "${group.name}". Please log in to your account to view the group and share expenses.\n\nThanks!`,
      };
    } else {
      mailOptions = {
        from: '"Group Expense App" <no-reply@example.com>',
        to: email,
        subject: `Invitation to join group "${group.name}"`,
        text: `Hi,\n\nYou've been invited to join the group "${group.name}" on Group Expense App.\nPlease register here: http://yourfrontend.com/auth/signup\n\nThanks!`,
      };
    }

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Invitation sent successfully" });
  } catch (error) {
console.error("Invite member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members.user", "name email")
      .populate("createdBy", "name email");

    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error fetching group" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
console.log("userd",userId)
    // Find all groups where user is a member
    const groups = await Group.find({ "members.user": userId })
      .select("name createdBy") // select only necessary fields to optimize
      .populate("createdBy", "name email");

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user groups" });
  }
};