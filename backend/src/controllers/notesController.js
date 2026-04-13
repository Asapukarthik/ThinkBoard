import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const isAdmin = req.user.email === 'user@example.com';
    const query = isAdmin ? {} : { userId: req.user._id };

    const notes = await Note.find(query)
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const isAdmin = req.user.email === 'user@example.com';
    const query = isAdmin ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };

    const note = await Note.findOne(query)
      .populate("userId", "username email avatar");

    if (!note) return res.status(404).json({ message: "Note not found or unauthorized!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, tags, status } = req.body;
    const note = new Note({ 
      title, 
      content,
      tags: tags || [],
      status: status || "backlog",
      userId: req.user._id 
    });

    const savedNote = await note.save();
    await savedNote.populate("userId", "username email avatar");
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, tags, status, attachments } = req.body;
    
    // Admin Override Logic
    const query = req.user.email === 'user@example.com' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userId: req.user._id };

    const updateData = { title, content, tags, status };
    if (attachments !== undefined) {
      updateData.attachments = attachments;
    }

    const updatedNote = await Note.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).populate("userId", "username email avatar");

    if (!updatedNote) return res.status(404).json({ message: "Note not found or unauthorized to edit" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleFavorite(req, res) {
  try {
    const query = req.user.email === 'user@example.com' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userId: req.user._id };

    const note = await Note.findOne(query);
    if (!note) return res.status(404).json({ message: "Note not found or unauthorized" });

    note.isFavorite = !note.isFavorite;
    const updatedNote = await note.save();
    await updatedNote.populate("userId", "username email avatar");

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in toggleFavorite controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    // Admin Override Logic
    const query = req.user.email === 'user@example.com' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userId: req.user._id };

    const deletedNote = await Note.findOneAndDelete(query);
    if (!deletedNote) return res.status(404).json({ message: "Note not found or unauthorized to delete" });
    
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllMedia(req, res) {
  try {
    const isAdmin = req.user.email === 'user@example.com';
    const query = isAdmin ? {} : { userId: req.user._id };

    // Get all notes with attachments
    const notes = await Note.find(query)
      .populate("userId", "username email")
      .select("_id title attachments createdAt")
      .lean();

    // Transform data to get all attachments with note info
    const allMedia = [];
    notes.forEach(note => {
      if (note.attachments && note.attachments.length > 0) {
        note.attachments.forEach(attachment => {
          allMedia.push({
            _id: attachment._id || `${note._id}-${attachment.url}`,
            noteId: note._id,
            noteTitle: note.title,
            ...attachment,
            uploadedBy: note.userId.username,
            noteCreatedAt: note.createdAt,
          });
        });
      }
    });

    res.status(200).json({
      totalMedia: allMedia.length,
      media: allMedia.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)),
    });
  } catch (error) {
    console.error("Error in getAllMedia controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
