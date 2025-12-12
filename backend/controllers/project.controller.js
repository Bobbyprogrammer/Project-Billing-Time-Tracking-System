import Project from "../models/project.model.js";
import TimeLog from "../models/timelog.model.js";
import mongoose from "mongoose";
export const createProject = async (req, res) => {
  try {
    const { name, description, billing_rate, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }
    if (!billing_rate || billing_rate <= 0) {
      return res
        .status(400)
        .json({ message: "Billing rate must be a positive number." });
    }

    const project = await Project.create({
      name,
      description,
      billing_rate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { name, description, billing_rate, status } = req.body;

    if (billing_rate && billing_rate <= 0) {
      return res
        .status(400)
        .json({ message: "Billing rate must be a positive number." });
    }

    project.name = name ?? project.name;
    project.description = description ?? project.description;
    project.billing_rate = billing_rate ?? project.billing_rate;
    project.status = status ?? project.status;

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archiveProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = "archived";
    project.archived = true;

    await project.save();

    res.json({
      success: true,
      message: "Project archived successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBillingSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const logs = await TimeLog.aggregate([
      {
        $match: {
          project_id: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: null,
          total_hours: { $sum: "$hours" },
        },
      },
    ]);

    const total_hours = logs[0]?.total_hours || 0;
    const total_amount = total_hours * project.billing_rate;

    const hoursByUser = await TimeLog.aggregate([
      {
        $match: {
          project_id: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$user_id",
          hours: { $sum: "$hours" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user_id: "$user._id",
          name: "$user.name",
          hours: 1,
        },
      },
    ]);

    const hoursByDate = await TimeLog.aggregate([
      {
        $match: {
          project_id: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$log_date",
          hours: { $sum: "$hours" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          hours: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      project_id: project._id,
      project_name: project.name,
      billing_rate: project.billing_rate,
      total_hours,
      total_amount,
      hours_by_user: hoursByUser,
      hours_by_date: hoursByDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
