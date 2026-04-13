import { FC } from "react";
import { ExternalLink, Download, FileText, Music, Video } from "lucide-react";
import { AttachmentGalleryProps } from "../types";

const AttachmentGallery: FC<AttachmentGalleryProps> = ({ attachments, onRemove = undefined, canEdit = false }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoExts = ["mp4", "webm", "avi", "mov"];
    const audioExts = ["mp3", "wav", "ogg", "m4a"];
    const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (imageExts.includes(ext)) return "image";
    if (videoExts.includes(ext)) return "video";
    if (audioExts.includes(ext)) return "audio";
    if (docExts.includes(ext)) return "document";
    return "file";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="size-6 text-primary" />;
      case "video":
        return <Video className="size-6 text-accent" />;
      case "audio":
        return <Music className="size-6 text-secondary" />;
      default:
        return <FileText className="size-6 text-base-content/40" />;
    }
  };

  const images = attachments.filter((a) => getFileType(a.originalName) === "image");
  const files = attachments.filter((a) => getFileType(a.originalName) !== "image");

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-base-content/80 uppercase tracking-wide">
            🖼️ Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((attachment, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-base-300 hover:border-primary hover:shadow-lg transition-all duration-300 bg-base-200"
              >
                <img
                  src={attachment.url}
                  alt={attachment.originalName}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm btn-circle text-white hover:bg-primary/80"
                      title="View full size"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    {canEdit && onRemove && (
                      <button
                        onClick={() => onRemove(index)}
                        className="btn btn-ghost btn-sm btn-circle text-white hover:bg-error/80"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-semibold text-base-content/70 line-clamp-1 group-hover:opacity-0 transition-opacity">
                    {attachment.originalName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-base-content/80 uppercase tracking-wide">
            📎 Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((attachment, index) => {
              const fileType = getFileType(attachment.originalName);
              const actualIndex = images.length + index;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 bg-base-200 border border-base-300 rounded-lg hover:border-primary hover:bg-base-300 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-2 bg-base-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                      {getFileIcon(fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline truncate block"
                        title={attachment.originalName}
                      >
                        {attachment.originalName}
                      </a>
                      <p className="text-xs text-base-content/50">
                        {(attachment.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={attachment.url}
                      download
                      className="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10"
                      title="Download file"
                    >
                      <Download className="size-4" />
                    </a>
                    {canEdit && onRemove && (
                      <button
                        onClick={() => onRemove(actualIndex)}
                        className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentGallery;
