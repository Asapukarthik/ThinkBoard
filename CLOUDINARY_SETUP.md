# Cloudinary Setup Guide for ThinkBoard

## Step 1: Install Required Packages

Run this command in the backend directory:

```bash
cd backend
npm install cloudinary multer streamifier
```

### Package Details:

- **cloudinary** - Cloudinary SDK for file uploads
- **multer** - Express middleware for file handling
- **streamifier** - Convert buffers to streams for Cloudinary

## Step 2: Get Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up for a free account (if you haven't already)
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Update Environment Variables

Add these to your `.env` file in the backend directory:

```
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace with your actual Cloudinary credentials.

## Step 4: Backend Structure

The following new files have been created:

```
backend/src/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── middleware/
│   └── uploadMiddleware.js    # Multer upload configuration
├── controllers/
│   └── uploadController.js    # File upload handler
├── utils/
│   └── cloudinaryHelper.js    # Cloudinary upload utility
└── routes/
    └── notesRoutes.js         # Updated with upload endpoint
```

## Step 5: Database Schema

The Note model already has the correct attachment structure:

```javascript
attachments: [
  {
    filename: String, // Cloudinary public_id
    originalName: String, // Original filename
    mimetype: String, // File type
    size: Number, // File size in bytes
    url: String, // Cloudinary secure URL
    cloudinaryId: String, // For deletion later
    uploadedAt: Date,
  },
];
```

## Step 6: API Endpoints

### Upload Files (NEW)

```
POST /api/notes/upload
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body:
  - files: [File, File, ...]  (up to 10 files)

Response:
{
  "files": [
    {
      "filename": "thinkboard/1618234567890-document.pdf",
      "originalName": "document.pdf",
      "mimetype": "application/pdf",
      "size": 2048000,
      "url": "https://res.cloudinary.com/...",
      "cloudinaryId": "thinkboard/1618234567890-document.pdf"
    }
  ]
}
```

### Create/Update Notes (UPDATED)

Now attachments are sent as already-uploaded file data:

```javascript
{
  "title": "My Note",
  "content": "<p>Content</p>",
  "tags": ["tag1", "tag2"],
  "status": "backlog",
  "attachments": [
    {
      "filename": "thinkboard/1618234567890-image.jpg",
      "originalName": "image.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "url": "https://res.cloudinary.com/...",
      "cloudinaryId": "thinkboard/1618234567890-image.jpg"
    }
  ]
}
```

## Supported File Types

- **Images**: jpg, jpeg, png, gif, webp
- **Documents**: pdf
- **Office**: doc, docx, txt, xls, xlsx, ppt, pptx

Maximum file size: **10 MB per file**

## Frontend Changes Required

The frontend has been updated to:

1. **Upload files to backend** before saving note
2. **Receive Cloudinary URLs** from the upload endpoint
3. **Store URLs** in the note attachments
4. **Display files** as links with download capability

## Testing

1. Start the backend server:

   ```bash
   npm run dev
   ```

2. Create a new note with attachments:
   - Go to "Create New Note"
   - Upload a file
   - See the file preview
   - Save the note
   - Verify the attachment is stored on Cloudinary

3. Edit an existing note:
   - Add new attachments
   - Remove existing attachments
   - Save changes

## Troubleshooting

### Error: "Cannot find module 'cloudinary'"

```bash
npm install cloudinary
```

### Error: "Missing CLOUDINARY credentials"

Check that .env file has:

- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### Error: "File size too large"

Maximum file size is 10MB. Reduce file size or update `limits` in uploadMiddleware.js

### Files not uploading

1. Check network tab in browser DevTools
2. Verify Cloudinary credentials are correct
3. Check backend logs for errors
4. Ensure multer package is installed

## Production Considerations

1. **Cloudinary Folder Organization**: Files are stored in `thinkboard/attachments/` folder
2. **Storage Limits**: Cloudinary free tier has 25GB storage
3. **Bandwidth**: Monitor bandwidth usage for large files
4. **Transformations**: Can add image optimization/transformations later
5. **Cleanup**: Consider implementing automatic cleanup of old files

## Future Enhancements

- [ ] Image optimization (compression, resizing)
- [ ] Image previews/thumbnails
- [ ] Delete files from Cloudinary when note is deleted
- [ ] Virus scanning integration
- [ ] S3 as fallback option
