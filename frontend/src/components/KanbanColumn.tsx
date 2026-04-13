import { FC, CSSProperties } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import NoteCard from "./NoteCard";
import { KanbanColumnProps, DraggableNoteCardProps, User } from "../types";

export const DraggableNoteCard: FC<DraggableNoteCardProps> = ({ note, setNotes, user, isAdmin }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note._id,
    data: { note },
  });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none mb-4 group">
      <NoteCard note={note} setNotes={setNotes} user={user} isAdmin={isAdmin} />
    </div>
  );
};

const KanbanColumn: FC<KanbanColumnProps> = ({ id, title, notes, setNotes, user, isAdmin }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 px-3">
        <div>
          <h3 className="font-bold text-lg text-base-content mb-1">{title}</h3>
          <span className="badge badge-primary badge-outline">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 rounded-2xl p-5 min-h-[600px] transition-all duration-300 ${isOver ? 'bg-primary/20 scale-[1.01] border-2 border-primary' : 'bg-base-200 border border-base-300'} backdrop-blur-3xl shadow-md flex flex-col gap-4`}
      >
        {notes.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-base-content/30 font-semibold uppercase tracking-wide text-sm border-2 border-dashed border-base-300 rounded-xl h-full min-h-[200px]">
            📝 Drag notes here
          </div>
        )}
        
        {notes.map((note) => {
          const noteUserId = typeof note.userId === 'object' ? (note.userId as User)._id : note.userId;
          const isOwner = user?._id === noteUserId;
          const canEdit = isOwner || isAdmin;
          
          if (canEdit) {
            return <DraggableNoteCard key={note._id} note={note} setNotes={setNotes} user={user} isAdmin={isAdmin} />;
          } else {
            return <div key={note._id} className="mb-4"><NoteCard note={note} setNotes={setNotes} user={user} isAdmin={isAdmin} /></div>;
          }
        })}
      </div>
    </div>
  );
};

export default KanbanColumn;
