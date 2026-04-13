import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";

export async function uploadFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.buffer, file.originalname);
        uploadedFiles.push({
          filename: result.public_id,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: result.secure_url,
          cloudinaryId: result.public_id,
        });
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
        return res.status(500).json({ message: `Failed to upload ${file.originalname}` });
      }
    }

    res.status(200).json({ files: uploadedFiles });
  } catch (error) {
    console.error("Error in uploadFiles controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
