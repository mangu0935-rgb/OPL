import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-brand-blue/90 animate-fade-in"
    >
      <ChevronUp className="h-4 w-4" />
      Back to Top
    </button>
  );
};

export default BackToTop;
