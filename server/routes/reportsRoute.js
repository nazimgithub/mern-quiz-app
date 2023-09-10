const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");

//add report
router.post("/add-report", authMiddleware, async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.send({
            message: "Report add successfully!",
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        });
    }
});

// get all report
router.post("/get-all-reports", authMiddleware, async (req, res) => {
    try {
        const { examName, userName } = req.body;
        const exams = await Exam.find({
            name : {
                $regex: examName,
            },
        });
        const matchedExamIds = exams.map((exam) => exam._id);

        const users = await User.find({
            name : {
                $regex: userName,
            },
        });
        const matchedUserIds = users.map((user) => user._id);
        const reports = await Report.find({
            exam: {
                $in: matchedExamIds,
            },
            user: {
                $in: matchedUserIds,
            },
        })
        .populate("exam")
        .populate("user")
        .sort({createdAt:-1});
        res.send({
            message: "Attempts fetched successfully!",
            data: reports,
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

// get report by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
    try {
        const reports = await Report.find({user:req.body.userId}).populate("exam").populate("user").sort({createdAt: -1});
        res.send({
            message: "Reports fetched successfully!",
            data: reports,
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

module.exports = router;