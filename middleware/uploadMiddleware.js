const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;

        if (!userId) {
            return cb(new Error('userId is required'), false);
        }

        // Create a folder for the user if it doesn't already exist
        const userFolder = path.join(__dirname, '../uploads', userId);

        fs.mkdir(userFolder, { recursive: true }, (err) => {
            if (err) {
                return cb(err, false);
            }
            cb(null, userFolder); // Set the destination to the user's folder
        });
    },
    filename: (req, file, cb) => {
        // Add a timestamp to the file name for uniqueness
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only specific file types
    const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
});

module.exports = upload;

