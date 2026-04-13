import { FC } from "react";
import { Link } from "react-router";
import { PlusIcon, Sun, Moon, LogOut, User as UserIcon, Search, Image } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";
import { NavbarProps } from "../types";

const Navbar: FC<NavbarProps> = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-4 sm:pt-6 mb-4 select-none">
      <div className="mx-auto max-w-7xl bg-glass backdrop-blur-3xl border border-white/10 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-16 sm:h-20 px-4 sm:px-6 md:px-8">
          <Link to="/" className="group flex items-center gap-2 hover:scale-105 transition-transform duration-500 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Think<span className="text-accent">Board</span>
            </h1>
          </Link>
          
          {user && (
            <div className="hidden md:flex flex-1 max-w-lg relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="size-5 text-base-content/30 group-focus-within:text-primary transition-all duration-300" />
              </div>
              <input
                type="text"
                placeholder="🔍 Search your notes..."
                className="input h-11 w-full pl-12 bg-white/5 border border-base-300 focus:border-primary focus:bg-white/10 text-base-content transition-all duration-700 rounded-xl placeholder:text-base-content/40 font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm sm:btn-md btn-circle hover:bg-primary/10 hover:text-primary group transition-all duration-300"
              title="Toggle theme"
            >
              {theme === "dark" || theme === "noir" ? (
                <Sun className="size-5 group-hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="size-5 group-hover:rotate-90 transition-transform" />
              )}
            </button>
            
            {user ? (
              <>
                <Link to={"/create"} className="btn btn-primary btn-sm sm:btn-md h-10 sm:h-11 rounded-lg font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border-none hidden sm:flex">
                  <PlusIcon className="size-4" />
                  <span>New Note</span>
                </Link>
                <Link to={"/media"} className="btn btn-ghost btn-sm sm:btn-md h-10 sm:h-11 rounded-lg font-bold uppercase tracking-wide text-xs hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-base-300 hover:border-primary hidden sm:flex">
                  <Image className="size-4" />
                  <span>Media</span>
                </Link>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm sm:btn-md btn-circle avatar border border-base-300 hover:border-primary transition-all duration-300 overflow-hidden" title="Profile menu">
                    <div className="w-9 sm:w-10 rounded-full flex items-center justify-center bg-primary/20 text-primary font-bold text-sm">
                      {user.avatar ? (
                        <img alt="User avatar" src={user.avatar} className="object-cover" />
                      ) : (
                        <span>{user.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-0 shadow-xl dropdown-content bg-base-100 border border-base-300 rounded-2xl w-64 backdrop-blur-3xl overflow-hidden">
                    <li className="p-4 sm:p-6 border-b border-base-300 bg-base-200/50">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="text-xs font-bold uppercase tracking-wide text-base-content/50">Your Profile</span>
                        <span className="font-bold text-lg text-base-content tracking-tight">{user.username}</span>
                        <span className="text-sm text-base-content/60 font-medium">{user.email}</span>
                      </div>
                    </li>
                    <li className="p-2">
                      <Link to={"/create"} className="btn btn-ghost w-full justify-start hover:bg-primary/10 hover:text-primary text-base-content rounded-lg font-bold uppercase tracking-wide text-xs transition-all duration-300 sm:hidden">
                        <PlusIcon className="size-4" /> New Note
                      </Link>
                    </li>
                    <li className="p-2">
                      <Link to={"/media"} className="btn btn-ghost w-full justify-start hover:bg-primary/10 hover:text-primary text-base-content rounded-lg font-bold uppercase tracking-wide text-xs transition-all duration-300 sm:hidden">
                        <Image className="size-4" /> Media Library
                      </Link>
                    </li>
                    <li className="p-2">
                      <button onClick={logout} className="btn btn-ghost w-full justify-start hover:bg-error/10 hover:text-error text-error rounded-lg font-bold uppercase tracking-wide text-xs transition-all duration-300">
                        <LogOut className="size-4" /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to={"/login"} className="btn btn-primary btn-sm sm:btn-md h-10 sm:h-11 rounded-lg font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg border-none">
                <UserIcon className="size-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
