import { FC } from "react";
import { PenSquareIcon, Trash2Icon, Star } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { NoteCardProps, User, Note } from "../types";

const NoteCard: FC<NoteCardProps> = ({ note, setNotes, user, isAdmin }) => {
  const getNoteUserId = (n: Note) => typeof n.userId === 'object' ? (n.userId as User)._id : n.userId;
  const getNoteUsername = (n: Note) => typeof n.userId === 'object' ? (n.userId as User).username : "Author";

  const isOwner = user?._id === getNoteUserId(note);
  const canEdit = isOwner || isAdmin;

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (!canEdit) return;

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!canEdit) return;

    try {
      const res = await api.put(`/notes/${note._id}/favorite`);
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? res.data : n))
      );
      toast.success(res.data.isFavorite ? "⭐ Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.log("Error toggling favorite", error);
      toast.error("Failed to update favorite status");
    }
  };

  const stripHtml = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className={`group card bg-base-100 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 border border-base-300 hover:border-primary shadow-sm rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="card-title text-base-content font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {note.title}
              </h3>
              {note.isFavorite && (
                <Star className="size-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {canEdit && (
              <button
                className="btn btn-ghost btn-circle btn-xs text-warning/60 hover:text-warning hover:bg-warning/10 z-10 relative transition-all duration-300"
                onClick={handleToggleFavorite}
                title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`size-4 ${note.isFavorite ? 'fill-yellow-400' : ''}`} />
              </button>
            )}
            {canEdit && (
              <button
                className="btn btn-ghost btn-circle btn-xs text-error/40 hover:text-error hover:bg-error/10 z-10 relative transition-all duration-300"
                onClick={(e) => handleDelete(e, note._id)}
                title="Delete note"
              >
                <Trash2Icon className="size-4" />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-base-content/70 line-clamp-3 text-sm mb-4 leading-relaxed font-medium">
          {stripHtml(note.content)}
        </p>

        {note.attachments && note.attachments.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-xs text-base-content/60 bg-base-200 px-3 py-2 rounded-lg">
            <span>📎</span>
            <span>{note.attachments.length} file{note.attachments.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="badge badge-primary badge-outline badge-sm text-xs font-bold">
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && <span className="text-xs text-base-content/50 font-medium">+{note.tags.length - 3}</span>}
          </div>
        )}

        <div className="card-actions justify-between items-center mt-auto pt-3 border-t border-base-300">
          <div className="flex flex-col text-xs">
            <span className="text-base-content/40 font-semibold">
              {formatDate(new Date(note.createdAt))}
            </span>
            <span className="text-base-content/60 font-medium">
              {getNoteUsername(note)}
            </span>
          </div>
          {canEdit && <PenSquareIcon className="size-4 text-base-content/40 group-hover:text-primary transition-colors" />}
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
