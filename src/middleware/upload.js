import multer from "multer";

// ============================================
// MEMORY STORAGE - Files stored in RAM temporarily
// Then uploaded to Supabase (no local disk usage)
// ============================================
const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  if (file.fieldname === "videoFile") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed for this field!"), false);
    }
  } else if (file.fieldname === "imageFiles") { 
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for this field!"), false);
    }
  } else if (file.fieldname === "certificateImage") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for this field!"), false);
    }
  } else if (file.fieldname === "resumeFile") { 
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word documents are allowed for resume!"), false);
    }
  } else if (file.fieldname === "coverImage") { 
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for this field!"), false);
    }
  } else {
    cb(new Error("Unexpected file field!"), false);
  }
};


const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: fileFilter,
});

export default upload;