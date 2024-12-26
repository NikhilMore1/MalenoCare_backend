const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const fileExtension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    },
});

// Initialize Multer with limits and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2024 * 2024 * 5, // Allow 5 MB
    },
    fileFilter: (req, file, cb) => {
        // Optional: Restrict file types if necessary
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

// Export Multer instance
module.exports = upload;
