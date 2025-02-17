const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to create user-specific storage directories
const createStorage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        let userId = req.params.userId || req.body.userId;

        if (!userId) {
            return cb(new Error('Missing userId in request'), false);
        }

        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return cb(new Error('Invalid userId format'), false);
        }

        const userFolder = path.join(__dirname, '../uploads', folderName, userId);

        fs.mkdir(userFolder, { recursive: true }, (err) => {
            if (err) {
                return cb(err, false);
            }
            cb(null, userFolder);
        });
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only specific formats
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Allowed types: .txt, .pdf, .doc, .docx'), false);
    }
};

// Configure upload settings
const userUpload = multer({
    storage: createStorage('users'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const curatorUpload = multer({
    storage: createStorage('curators'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { userUpload, curatorUpload };




