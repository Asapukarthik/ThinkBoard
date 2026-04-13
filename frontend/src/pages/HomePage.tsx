import { FC, useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Star } from "lucide-react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NotesNotFound from "../components/NotesNotFound";
import { useSearchStore } from "../store/useSearchStore";
import { useAuthStore } from "../store/useAuthStore";
import KanbanColumn from "../components/KanbanColumn";
import NoteCard from "../components/NoteCard";
import { Note, User } from "../types";

const HomePage: FC = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  
  const isAdmin = user?.email === 'user@example.com';

  const getNoteUserId = (n: Note) => typeof n.userId === 'object' ? (n.userId as User)._id : n.userId;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        // Ensure all notes have a status, default to backlog
        const processedNotes = res.data.map((n: Note) => ({ ...n, status: n.status || 'backlog' }));
        setNotes(processedNotes);
        setIsRateLimited(false);
      } catch (error: any) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const note = notes.find((n) => n._id === active.id);
    // Extra security check: Don't let users drag notes they don't own if they managed to trigger it.
    if (!isAdmin && user?._id !== (note ? getNoteUserId(note) : null)) return;
    setActiveNote(note || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;
    
    // Check if dropping on a column
    const noteId = active.id as string;
    const newStatus = over.id as string; // Either 'backlog', 'in-progress', 'completed'

    const note = notes.find((n) => n._id === noteId);
    if (!note || note.status === newStatus) return;
    
    if (!isAdmin && user?._id !== getNoteUserId(note)) return;

    // Optimistic UI update
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === noteId ? { ...n, status: newStatus as any } : n))
    );

    try {
      await api.put(`/notes/${noteId}`, { ...note, status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch (error) {
      console.error(error);
      // Revert if failed
      toast.error("Failed to move note");
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === noteId ? { ...n, status: note.status } : n))
      );
    }
  };

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(searchLower);
    const contentMatch = note.content?.toLowerCase().includes(searchLower);
    const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    const searchMatches = titleMatch || contentMatch || tagMatch;
    
    const favoriteMatches = !showFavoritesOnly || note.isFavorite;
    
    return searchMatches && favoriteMatches;
  });

  return (
    <div className="min-h-screen bg-transparent z-10 relative flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 md:p-12 mt-6 overflow-hidden flex flex-col">
        {!loading && notes.length > 0 && !isRateLimited && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`btn btn-sm rounded-lg font-semibold transition-all duration-300 ${showFavoritesOnly ? 'btn-warning text-warning' : 'btn-ghost hover:bg-warning/10'}`}
            >
              <Star className={`size-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'}</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-lg font-semibold text-base-content/60">Loading your notes...</p>
          </div>
        )}

        {!loading && notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {!loading && filteredNotes.length === 0 && notes.length > 0 && !isRateLimited && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-base-content/50 mb-2">No results</p>
              <p className="text-base-content/40 text-lg">
                {showFavoritesOnly ? "You haven't marked any notes as favorites yet" : "No notes match your search"}
              </p>
            </div>
          </div>
        )}

        {!loading && filteredNotes.length > 0 && !isRateLimited && (
          <DndContext 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-full min-h-[700px]">
              <KanbanColumn 
                id="backlog" 
                title="Backlog" 
                status="backlog"
                notes={filteredNotes.filter(n => n.status === 'backlog')}
                setNotes={setNotes}
                user={user}
                isAdmin={isAdmin}
              />
              <KanbanColumn 
                id="in-progress" 
                title="In Progress" 
                status="in-progress"
                notes={filteredNotes.filter(n => n.status === 'in-progress')}
                setNotes={setNotes}
                user={user}
                isAdmin={isAdmin}
              />
              <KanbanColumn 
                id="completed" 
                title="Completed" 
                status="completed"
                notes={filteredNotes.filter(n => n.status === 'completed')}
                setNotes={setNotes}
                user={user}
                isAdmin={isAdmin}
              />
            </div>
            
            <DragOverlay dropAnimation={{
              duration: 500,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeNote ? (
                <div className="rotate-3 scale-110 opacity-40 cursor-grabbing filter grayscale brightness-125 transition-all">
                  <NoteCard note={activeNote} setNotes={setNotes} user={user} isAdmin={isAdmin} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default HomePage;
