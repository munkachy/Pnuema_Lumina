import { Book } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
        <div className="flex justify-center items-center gap-2 mb-1">
          <Book className="h-4 w-4" />
          <p>Scripture Seeker uses the API.Bible for verse data. No web scraping involved.</p>
        </div>
        <p>Translations available: GNT, NRSV-CE, and Douay-Rheims</p>
      </div>
    </footer>
  );
};

export default Footer;
