import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, X, Upload, Star } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuthStore } from "../store/useAuthStore";
import AttachmentGallery from "../components/AttachmentGallery";
import { Note, User } from "../types";

const NoteDetailPage = () => {
  const [note, setNote] = useState<Note>({ 
    _id: "", 
    title: "", 
    content: "", 
    tags: [], 
    status: "backlog", 
    attachments: [], 
    isFavorite: false,
    userId: "",
    createdAt: "",
    updatedAt: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();

  const isOwner = user?._id === (typeof note.userId === 'object' ? (note.userId as User)._id : note.userId);
  const isAdmin = user?.email === 'user@example.com';
  const canEdit = isOwner || isAdmin;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote({ ...res.data, tags: res.data.tags || [], status: res.data.status || "backlog", attachments: res.data.attachments || [], isFavorite: res.data.isFavorite || false });
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!canEdit) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await api.put(`/notes/${id}/favorite`);
      setNote(res.data);
      toast.success(res.data.isFavorite ? "⭐ Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.log("Error toggling favorite", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!note.tags.includes(tagInput.trim())) {
        setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!canEdit) return;
    setNote({ ...note, tags: note.tags.filter((tag) => tag !== tagToRemove) });
  };

  const uploadFilesToCloudinary = async (files: File[]) => {
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNote((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...response.data.files],
      }));
      toast.success("Files uploaded to Cloudinary ☁️");
    } catch (error) {
      console.log("Error uploading files", error);
      toast.error("Failed to upload files");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    // Client-side validation
    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      await uploadFilesToCloudinary(validFiles);
    }

    // Reset input
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setNote((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!canEdit) return;
    if (!note.title.trim() || !note.content.trim() || note.content === "<p><br></p>") {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, {
        ...note,
        attachments: note.attachments || [],
      });
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="animate-spin size-10 text-primary" />
          <p className="text-base-content/60 font-medium">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent z-10 relative py-8 md:py-12 selection:bg-primary selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div>
          <div className="flex items-center justify-between mb-8 gap-4">
            <Link to="/" className="btn btn-ghost btn-sm hover:bg-base-200 rounded-lg group transition-all duration-500 font-semibold">
              <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Notes</span>
            </Link>
            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={handleToggleFavorite}
                  className={`btn btn-ghost btn-sm rounded-lg transition-all duration-300 ${note.isFavorite ? 'btn-warning text-warning' : 'hover:bg-warning/10'}`}
                  title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm">{note.isFavorite ? "Favorite" : "Add Star"}</span>
                </button>
              )}
              {canEdit && (
                <button
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm hover:bg-error/10 hover:text-error rounded-lg transition-all duration-300 text-error"
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span className="text-sm">Delete</span>
                </button>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden">
            <div className="card-body p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-8">
                {canEdit ? "Edit Note ✏️" : "Note Details 👀"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="form-control">
                  <label className="label py-3 px-0">
                    <span className="label-text font-bold text-base text-base-content">Note Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title..."
                    className={`input w-full bg-base-200 border border-base-300 focus:border-primary text-base-content transition-all duration-700 rounded-lg text-lg font-semibold placeholder:text-base-content/40 ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                    disabled={!canEdit}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-3 px-0">
                    <span className="label-text font-bold text-base text-base-content">Status</span>
                  </label>
                  <select
                    className={`select w-full bg-base-200 border border-base-300 focus:border-primary text-base-content font-medium rounded-lg ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                    value={note.status}
                    onChange={(e) => setNote({ ...note, status: e.target.value as "backlog" | "in-progress" | "completed" })}
                    disabled={!canEdit}
                  >
                    <option value="backlog">📋 To Study</option>
                    <option value="in-progress">🔄 Currently Learning</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-control mb-8">
                <label className="label py-3 px-0">
                  <span className="label-text font-bold text-base text-base-content">Tags {canEdit && "(Press Enter to add)"}</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-4 bg-base-200 p-4 rounded-lg min-h-[50px]">
                  {note.tags.length === 0 ? (
                    <p className="text-base-content/40 text-sm font-medium w-full">No tags</p>
                  ) : (
                    note.tags.map((tag) => (
                      <span key={tag} className="badge badge-primary badge-lg gap-2 px-3 py-3 text-sm font-semibold">
                        {tag}
                        {canEdit && (
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-error">
                            <X className="size-4" />
                          </button>
                        )}
                      </span>
                    ))
                  )}
                </div>
                {canEdit && (
                  <input
                    type="text"
                    placeholder="e.g., important, review-later"
                    className="input w-full bg-base-200 border border-base-300 focus:border-primary text-base-content font-medium rounded-lg placeholder:text-base-content/40"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                )}
              </div>

              {canEdit && (
                <div className="form-control mb-8">
                  <label className="label py-3 px-0">
                    <span className="label-text font-bold text-base text-base-content">Attachments (Images, PDFs, Documents)</span>
                  </label>

                  {note.attachments && note.attachments.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-base-300">
                      <AttachmentGallery
                        attachments={note.attachments}
                        onRemove={removeAttachment}
                        canEdit={canEdit}
                      />
                    </div>
                  )}

                  <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-all duration-300 cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
                      disabled={uploadingFiles}
                    />
                    <div className="pointer-events-none">
                      {uploadingFiles ? (
                        <>
                          <LoaderIcon className="animate-spin size-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-semibold text-primary">Uploading to Cloudinary...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="size-8 text-base-content/40 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-base-content/60">Click to add new files</p>
                          <p className="text-xs text-base-content/40 mt-1">Supported: Images, PDF, Word, Excel (Max 10MB each)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-control mb-8">
                <div className={`bg-base-200 border border-base-300 rounded-lg overflow-hidden ${!canEdit ? 'opacity-70' : ''}`}>
                  <ReactQuill
                    theme="snow"
                    value={note.content}
                    onChange={(val: string) => setNote({ ...note, content: val })}
                    className="bg-white rounded-none"
                    readOnly={!canEdit}
                    modules={canEdit ? {
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link', 'blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ],
                    } : { toolbar: false }}
                  />
                </div>
              </div>

              {note.attachments && note.attachments.length > 0 && (
                <div className="form-control mb-8 bg-base-200 p-6 rounded-lg border border-base-300">
                  <label className="label py-3 px-0 mb-4">
                    <span className="label-text font-bold text-base text-base-content">📎 Attached Files & Images</span>
                  </label>
                  <AttachmentGallery
                    attachments={note.attachments}
                    canEdit={false}
                  />
                </div>
              )}

              {canEdit && (
                <div className="form-control mb-8 flex flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary rounded-lg font-semibold flex-1"
                  >
                    {saving ? (
                      <>
                        <LoaderIcon className="animate-spin h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "✅ Save Changes"
                    )}
                  </button>
                  <Link
                    to="/"
                    className="btn btn-ghost rounded-lg font-semibold flex-1"
                  >
                    Cancel
                  </Link>
                </div>
              )}

              {!canEdit && (
                <div className="mt-8 p-4 bg-warning/10 text-warning border border-warning/30 rounded-lg font-medium">
                  You don't have permission to edit this note.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
