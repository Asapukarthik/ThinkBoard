// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  about?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Note & Attachment Types
export interface Attachment {
  _id?: string;
  filename?: string;
  originalName: string;
  mimetype?: string;
  size: number;
  url: string;
  cloudinaryId?: string;
  uploadedAt?: string;
}

export interface Note {
  _id: string;
  userId: User | string;
  title: string;
  content: string;
  tags: string[];
  status: "backlog" | "in-progress" | "completed";
  isFavorite: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

// Media Library Types
export interface MediaItem extends Attachment {
  noteId: string;
  noteTitle: string;
  uploadedBy: string;
  noteCreatedAt: string;
}

export interface MediaResponse {
  totalMedia: number;
  media: MediaItem[];
}

// Store Types
export interface UserState {
  user: User | null;
  isCheckingAuth: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ThemeState {
  theme: "light" | "dark" | "noir";
  toggleTheme: () => void;
  initTheme: () => void;
}

export interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}

// Component Props
export interface NavbarProps {}

export interface NoteCardProps {
  note: Note;
  setNotes: (updater: (prev: Note[]) => Note[]) => void;
  user: User | null;
  isAdmin: boolean;
}

export interface DraggableNoteCardProps extends NoteCardProps {}

export interface KanbanColumnProps {
  id: string;
  title: string;
  status: "backlog" | "in-progress" | "completed";
  notes: Note[];
  setNotes: (updater: (prev: Note[]) => Note[]) => void;
  user: User | null;
  isAdmin: boolean;
}

export interface AttachmentGalleryProps {
  attachments: Attachment[];
  onRemove?: (index: number) => void;
  canEdit?: boolean;
}

export interface RateLimitedUIProps {
  message?: string;
}

export interface NotesNotFoundProps {
  message?: string;
}
