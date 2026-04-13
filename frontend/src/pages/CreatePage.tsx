import { FC, useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { ArrowLeftIcon, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import AttachmentGallery from "../components/AttachmentGallery";
import { Attachment } from "../types";

const CreatePage: FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState("backlog");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const navigate = useNavigate();

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    // Validate files
    for (const file of files) {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return;
      }
    }

    if (files.length > 0) {
      await uploadFilesToCloudinary(files);
    }
  };

  const uploadFilesToCloudinary = async (files: File[]) => {
    try {
      setUploadingFiles(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post("/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAttachments((prev) => [...prev, ...response.data.files]);
      toast.success(`${response.data.files.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files to Cloudinary");
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isContentEmpty = (html: string): boolean => {
      const div = document.createElement("div");
      div.innerHTML = html;
      const text = div.textContent || div.innerText || "";
      return text.trim().length === 0;
    };

    if (!title.trim() || isContentEmpty(content)) {
      toast.error("Title and Content are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
        tags,
        status,
        attachments,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error: any) {
      console.log("Error creating note", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent z-10 relative py-8 md:py-12 selection:bg-primary selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div>
          <Link to="/" className="btn btn-ghost btn-sm hover:bg-base-200 rounded-lg group transition-all duration-500 mb-8 font-semibold">
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Notes</span>
          </Link>

          <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden">
            <div className="card-body p-6 sm:p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-2">Create New Note 📝</h2>
              <p className="text-base-content/60 mb-8 font-medium">Organize your ideas and track your progress</p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="form-control">
                    <label className="label py-3 px-0">
                      <span className="label-text font-bold text-base text-base-content">Note Title *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Advanced Calculus - Chapter 5 Notes"
                      className="input w-full bg-base-200 border border-base-300 focus:border-primary focus:bg-white text-base-content transition-all duration-700 rounded-lg text-lg font-semibold placeholder:text-base-content/40"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-3 px-0">
                      <span className="label-text font-bold text-base text-base-content">Status</span>
                    </label>
                    <select
                      className="select w-full bg-base-200 border border-base-300 focus:border-primary text-base-content font-medium rounded-lg"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="backlog">📋 To Study</option>
                      <option value="in-progress">🔄 Currently Learning</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-control mb-8">
                  <label className="label py-3 px-0">
                    <span className="label-text font-bold text-base text-base-content">Tags (Press Enter to add)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4 bg-base-200 p-4 rounded-lg min-h-[50px]">
                    {tags.length === 0 ? (
                      <p className="text-base-content/40 text-sm font-medium w-full">No tags yet</p>
                    ) : (
                      tags.map((tag) => (
                        <span key={tag} className="badge badge-primary badge-lg gap-2 px-3 py-3 text-sm font-semibold">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-error">
                            <X className="size-4" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., math, chapter-5, important"
                    className="input w-full bg-base-200 border border-base-300 focus:border-primary text-base-content font-medium rounded-lg placeholder:text-base-content/40"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>

                <div className="form-control mb-8">
                  <label className="label py-3 px-0">
                    <span className="label-text font-bold text-base text-base-content">Attachments (Upload to Cloudinary)</span>
                  </label>
                  <div className={`bg-base-200 border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-all duration-300 cursor-pointer relative ${uploadingFiles ? 'opacity-50 pointer-events-none' : ''}`}>
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
                          <div className="loading loading-spinner loading-lg text-primary mx-auto mb-2" />
                          <p className="text-sm font-semibold text-base-content">Uploading to Cloudinary...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="size-8 text-base-content/40 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-base-content/60">Click or drag files here</p>
                          <p className="text-xs text-base-content/40 mt-1">Supported: Images, PDF, Word, Excel, PowerPoint (Max 10MB each)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-6 p-4 bg-base-200 border border-base-300 rounded-lg">
                      <AttachmentGallery
                        attachments={attachments}
                        onRemove={removeAttachment}
                        canEdit={true}
                      />
                    </div>
                  )}
                </div>

                <div className="form-control mb-8">
                  <div className="bg-base-200 border border-base-300 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      className="bg-white rounded-none"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, false] }],
                          ['bold', 'italic', 'underline'],
                          ['link', 'blockquote', 'code-block'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-4 mt-10 pt-8 border-t border-base-300">
                  <Link to="/" className="btn btn-ghost btn-md rounded-lg font-semibold">Cancel</Link>
                  <button type="submit" className="btn btn-primary btn-md rounded-lg font-bold shadow-md hover:shadow-lg" disabled={loading}>
                    {loading ? <span className="loading loading-spinner loading-sm" /> : "💾 Save Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
