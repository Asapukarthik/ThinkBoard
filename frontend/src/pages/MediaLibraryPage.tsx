import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeftIcon, LoaderIcon, Download, Eye, ExternalLink, FileText, Music, Video } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import { MediaItem } from "../types";

const MediaLibraryPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, images, documents, videos
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const fetchAllMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes/media/all");
      setMedia(response.data.media || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoExts = ["mp4", "webm", "avi", "mov"];
    const audioExts = ["mp3", "wav", "ogg", "m4a"];
    const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];

    if (imageExts.includes(ext)) return "image";
    if (videoExts.includes(ext)) return "video";
    if (audioExts.includes(ext)) return "audio";
    if (docExts.includes(ext)) return "document";
    return "file";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="size-5 text-primary" />;
      case "video":
        return <Video className="size-5 text-accent" />;
      case "audio":
        return <Music className="size-5 text-secondary" />;
      default:
        return <FileText className="size-5 text-base-content/40" />;
    }
  };

  const filteredMedia = media.filter((item) => {
    const fileType = getFileType(item.originalName);
    const matchesFilter = filter === "all" || fileType === filter;
    const matchesSearch =
      item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noteTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const imageMedia = filteredMedia.filter((m) => getFileType(m.originalName) === "image");
  const documentMedia = filteredMedia.filter((m) => getFileType(m.originalName) === "document");
  const otherMedia = filteredMedia.filter(
    (m) => ["video", "audio", "file"].includes(getFileType(m.originalName))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="animate-spin size-10 text-primary" />
          <p className="text-base-content/60 font-medium">Loading media library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent z-10 relative py-8 md:py-12 selection:bg-primary selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="btn btn-ghost btn-sm hover:bg-base-200 rounded-lg group transition-all duration-500 mb-6 font-semibold">
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">📁 Media Library</h1>
          <p className="text-base-content/60 font-medium">
            {filteredMedia.length} file{filteredMedia.length !== 1 ? "s" : ""} • View all your images and files
          </p>
        </div>

        {/* Search & Filter */}
        <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden mb-8">
          <div className="card-body p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="🔍 Search by filename or note name..."
                  className="input w-full bg-base-200 border border-base-300 focus:border-primary focus:bg-white text-base-content transition-all duration-700 rounded-lg placeholder:text-base-content/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="select w-full bg-base-200 border border-base-300 focus:border-primary text-base-content font-medium rounded-lg"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">📂 All Files ({media.length})</option>
                  <option value="image">🖼️ Images ({imageMedia.length})</option>
                  <option value="document">📄 Documents ({documentMedia.length})</option>
                  <option value="video">🎬 Videos ({otherMedia.filter(m => getFileType(m.originalName) === "video").length})</option>
                </select>
              </div>
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center py-12">
                <p className="text-base-content/60 font-medium mb-4">No files found matching your search</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="btn btn-primary btn-sm rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {imageMedia.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
              🖼️ Images ({imageMedia.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageMedia.map((item) => (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-lg border border-base-300 hover:border-primary hover:shadow-lg transition-all duration-300 bg-base-200"
                >
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedImage(item)}
                        className="btn btn-ghost btn-sm btn-circle text-white hover:bg-primary/80"
                        title="View full size"
                      >
                        <Eye className="size-4" />
                      </button>
                      <a
                        href={item.url}
                        download
                        className="btn btn-ghost btn-sm btn-circle text-white hover:bg-success/80"
                        title="Download"
                      >
                        <Download className="size-4" />
                      </a>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-semibold text-white line-clamp-1">{item.originalName}</p>
                    <Link
                      to={`/note/${item.noteId}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {item.noteTitle}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {documentMedia.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
              📄 Documents ({documentMedia.length})
            </h2>
            <div className="space-y-2">
              {documentMedia.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 p-4 bg-base-100 border border-base-300 rounded-lg hover:border-primary hover:bg-base-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-3 bg-base-200 rounded-lg group-hover:bg-primary/10 transition-colors">
                      {getFileIcon(getFileType(item.originalName))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">{item.originalName}</p>
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <Link to={`/note/${item.noteId}`} className="hover:text-primary hover:underline">
                          {item.noteTitle}
                        </Link>
                        <span>•</span>
                        <span>{(item.size / 1024).toFixed(2)} KB</span>
                        <span>•</span>
                        <span>{formatDate(new Date(item.uploadedAt || ""))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10"
                      title="View"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <a
                      href={item.url}
                      download
                      className="btn btn-ghost btn-xs btn-circle text-success hover:bg-success/10"
                      title="Download"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Media */}
        {otherMedia.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
              🎵 Media & Files ({otherMedia.length})
            </h2>
            <div className="space-y-2">
              {otherMedia.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 p-4 bg-base-100 border border-base-300 rounded-lg hover:border-primary hover:bg-base-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-3 bg-base-200 rounded-lg group-hover:bg-primary/10 transition-colors">
                      {getFileIcon(getFileType(item.originalName))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">{item.originalName}</p>
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <Link to={`/note/${item.noteId}`} className="hover:text-primary hover:underline">
                          {item.noteTitle}
                        </Link>
                        <span>•</span>
                        <span>{(item.size / 1024).toFixed(2)} KB</span>
                        <span>•</span>
                        <span>{formatDate(new Date(item.uploadedAt || ""))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10"
                      title="View"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <a
                      href={item.url}
                      download
                      className="btn btn-ghost btn-xs btn-circle text-success hover:bg-success/10"
                      title="Download"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-base-100 rounded-lg overflow-hidden max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedImage.url} alt={selectedImage.originalName} className="w-full h-auto" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 btn btn-ghost btn-circle text-white hover:bg-error/80"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="font-bold text-lg text-base-content mb-2">{selectedImage.originalName}</h3>
              <div className="space-y-2 text-sm text-base-content/60 mb-4">
                <p>
                  <span className="font-semibold text-base-content">Note:</span>{" "}
                  <Link to={`/note/${selectedImage.noteId}`} className="text-primary hover:underline">
                    {selectedImage.noteTitle}
                  </Link>
                </p>
                <p>
                  <span className="font-semibold text-base-content">Size:</span> {(selectedImage.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <span className="font-semibold text-base-content">Uploaded:</span> {formatDate(new Date(selectedImage.uploadedAt || ""))}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedImage.url}
                  download
                  className="btn btn-primary btn-sm rounded-lg flex-1"
                >
                  <Download className="size-4" /> Download
                </a>
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm rounded-lg flex-1"
                >
                  <ExternalLink className="size-4" /> Open
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
