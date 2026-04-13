import { FC } from "react";
import { ZapIcon } from "lucide-react";
import { RateLimitedUIProps } from "../types";

const RateLimitedUI: FC<RateLimitedUIProps> = ({ message }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-warning/20 border-2 border-warning/40 rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          <div className="flex-shrink-0 bg-warning/30 p-5 rounded-2xl">
            <ZapIcon className="size-12 text-warning" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-warning mb-2">Whoa there! ⚡ Rate Limit Hit</h3>
            <p className="text-base-content/80 mb-2 font-medium">
              {message || "You're creating or updating notes too quickly!"}
            </p>
            <p className="text-sm text-base-content/60">
              💡 Take a quick break and try again in a few moments. This helps keep the app running smoothly for everyone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
