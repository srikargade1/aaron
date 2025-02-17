const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const Article = require("../models/articleModel");

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// =============================
// 📌 CREATE ARTICLE METADATA
// =============================
// @desc    Create metadata for an article
// @route   POST /api/articles/metadata
// @access  Private
router.post(
    "/metadata",
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("difficultyLevel")
            .isIn(["Beginner", "Intermediate", "Advanced"])
            .withMessage("Difficulty level must be Beginner, Intermediate, or Advanced"),
        body("type").isIn(["sample", "custom"]).withMessage("Type must be sample or custom"),
        body("uploadedBy").notEmpty().withMessage("uploadedBy field is required"),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { title, difficultyLevel, type, uploadedBy } = req.body;

            const article = new Article({
                title,
                difficultyLevel,
                type,
                uploadedBy, // Can be 'curator' or a userId
            });

            await article.save();
            res.status(201).json({ message: "Article metadata created", articleId: article._id });
        } catch (error) {
            console.error("Error creating article metadata:", error);
            res.status(500).json({ message: "Failed to create article metadata", error: error.message });
        }
    }
);

// =============================
// 📌 UPLOAD USER-SUBMITTED ARTICLE CONTENT
// =============================
// @desc    Upload content for a user-submitted article
// @route   POST /api/articles/upload-user
// @access  Private
router.post(
    "/upload-user",
    [
        body("articleId").isMongoId().withMessage("Invalid article ID"),
        body("content").notEmpty().withMessage("Content is required"),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { articleId, content } = req.body;

            const article = await Article.findById(articleId);
            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }

            if (article.uploadedBy === "curator") {
                return res.status(403).json({ message: "Cannot modify curator-uploaded articles" });
            }

            article.content = content;
            await article.save();

            res.status(200).json({ message: "User article content uploaded successfully", article });
        } catch (error) {
            console.error("Error uploading article content:", error);
            res.status(500).json({ message: "Failed to upload article content", error: error.message });
        }
    }
);

// =============================
// 📌 UPLOAD CURATOR-SUBMITTED ARTICLE CONTENT
// =============================
// @desc    Upload content for a curator-submitted article
// @route   POST /api/articles/upload-curator
// @access  Private
router.post(
    "/upload-curator",
    [
        body("articleId").isMongoId().withMessage("Invalid article ID"),
        body("content").notEmpty().withMessage("Content is required"),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { articleId, content } = req.body;

            const article = await Article.findById(articleId);
            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }

            if (article.uploadedBy !== "curator") {
                return res.status(403).json({ message: "Only curator-uploaded articles can be modified here" });
            }

            article.content = content;
            await article.save();

            res.status(200).json({ message: "Curator article content uploaded successfully", article });
        } catch (error) {
            console.error("Error uploading curator article content:", error);
            res.status(500).json({ message: "Failed to upload article content", error: error.message });
        }
    }
);

// =============================
// 📌 FETCH ALL ARTICLES
// =============================
// @desc    Get all articles with optional filters
// @route   GET /api/articles
// @access  Public
router.get("/", async (req, res) => {
    try {
        const { difficultyLevel, tags } = req.query;
        let filter = {};

        if (difficultyLevel) {
            filter.difficultyLevel = difficultyLevel;
        }
        if (tags) {
            filter.tags = { $in: tags.split(",") };
        }

        const articles = await Article.find(filter);
        res.status(200).json({ articles });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ message: "Failed to fetch articles", error: error.message });
    }
});

// =============================
// 📌 FETCH A SINGLE ARTICLE
// =============================
// @desc    Get a single article by ID
// @route   GET /api/articles/:id
// @access  Public
router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid article ID")],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const article = await Article.findById(id);

            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }

            res.status(200).json(article);
        } catch (error) {
            console.error("Error fetching article:", error);
            res.status(500).json({ message: "Failed to fetch article", error: error.message });
        }
    }
);

// =============================
// 📌 DELETE AN ARTICLE
// =============================
// @desc    Delete an article by ID
// @route   DELETE /api/articles/:id
// @access  Private (Only uploader or curator)
router.delete(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid article ID")],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const deletedArticle = await Article.findByIdAndDelete(id);

            if (!deletedArticle) {
                return res.status(404).json({ message: "Article not found" });
            }

            res.status(200).json({ message: "Article deleted successfully" });
        } catch (error) {
            console.error("Error deleting article:", error);
            res.status(500).json({ message: "Failed to delete article", error: error.message });
        }
    }
);

module.exports = router;
