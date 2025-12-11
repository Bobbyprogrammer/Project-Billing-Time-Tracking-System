import TimeLog from "../models/timelog.model.js";
import Project from "../models/project.model.js";
export const createTimeLog = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { hours, notes, log_date } = req.body;

    if (!project_id)
      return res.status(400).json({ message: "Project is required" });
    if (!hours || hours <= 0)
      return res.status(400).json({ message: "Hours must be positive" });
    if (!log_date)
      return res.status(400).json({ message: "Log date is required" });

    const project = await Project.findById(project_id);
    if (!project || project.archived) {
      return res.status(400).json({ message: "Invalid or archived project" });
    }

    const totalHoursToday = await TimeLog.aggregate([
      { $match: { user_id: req.user._id, log_date: new Date(log_date) } },
      { $group: { _id: null, total: { $sum: "$hours" } } },
    ]);

    const currentTotal = totalHoursToday[0]?.total || 0;
    if (currentTotal + hours > 12) {
      return res
        .status(400)
        .json({ message: "Cannot log more than 12 hours per day" });
    }

    const timeLog = await TimeLog.create({
      project_id,
      user_id: req.user._id,
      hours,
      notes,
      log_date,
    });

    res
      .status(201)
      .json({ success: true, message: "Time log created", timeLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { hours, notes, log_date, status } = req.body;

    const timeLog = await TimeLog.findById(id);
    if (!timeLog)
      return res.status(404).json({ message: "Time log not found" });

    if (!req.user.role === "admin" && !timeLog.user_id.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (hours && hours <= 0)
      return res.status(400).json({ message: "Hours must be positive" });

    const logDate = log_date ? new Date(log_date) : timeLog.log_date;
    const totalHoursToday = await TimeLog.aggregate([
      {
        $match: {
          user_id: timeLog.user_id,
          log_date: logDate,
          _id: { $ne: timeLog._id },
        },
      },
      { $group: { _id: null, total: { $sum: "$hours" } } },
    ]);
    const currentTotal = totalHoursToday[0]?.total || 0;
    const newHours = hours || timeLog.hours;
    if (currentTotal + newHours > 12) {
      return res
        .status(400)
        .json({ message: "Cannot log more than 12 hours per day" });
    }

    timeLog.hours = newHours;
    timeLog.notes = notes ?? timeLog.notes;
    timeLog.log_date = logDate;
    if (status) timeLog.status = status;

    await timeLog.save();

    res.json({ message: "Time log updated", timeLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const timeLog = await TimeLog.findById(id);
    if (!timeLog)
      return res.status(404).json({ message: "Time log not found" });

    if (!req.user.role === "admin" && !timeLog.user_id.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await timeLog.remove();

    res.json({ success: true, message: "Time log deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTimeLogsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const logs = await TimeLog.find({ project_id: projectId })
      .populate("user_id", "name email role")
      .sort({ log_date: -1 });

    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const log = await TimeLog.findById(id);
    if (!log) return res.status(404).json({ message: "Time log not found" });

    if (!req.user.role === "admin" && !log.user_id.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    log.status = status;
    await log.save();

    res.json({ success: true, message: "Status updated", log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
