import { FC } from "react";
import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";
import { NotesNotFoundProps } from "../types";

const NotesNotFound: FC<NotesNotFoundProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 max-w-md mx-auto text-center">
      <div className="bg-primary/15 rounded-3xl p-10">
        <NotebookIcon className="size-16 text-primary mx-auto" />
      </div>
      <div className="space-y-3">
        <h3 className="text-3xl font-bold text-base-content">No Notes Yet 📚</h3>
        <p className="text-lg text-base-content/70 leading-relaxed">
          Your note collection is empty. Create your first note to start organizing your study materials!
        </p>
      </div>
      <Link to="/create" className="btn btn-primary btn-lg rounded-lg font-bold shadow-md hover:shadow-lg">
        ✏️ Create Your First Note
      </Link>
    </div>
  );
};

export default NotesNotFound;
