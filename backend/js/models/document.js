const documentSchema = {
    userId: String,         // ID of logged in user
    fileName: String,       // Original file name
    fileUrl: String,       // Storage URL
    fileType: String,      // PDF/Image etc
    uploadDate: Timestamp, // Upload timestamp
    category: String,      // Business/Market/Pitch
    content: String       // Extracted text content
  }