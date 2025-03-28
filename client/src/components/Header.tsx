import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  currentTranslation: string;
  onTranslationChange: (translation: string) => void;
}

const Header = ({
  currentTranslation,
  onTranslationChange,
}: HeaderProps) => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-medium bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">Pneuma Lumina</h1>
        </div>
        <div>
          <Select
            value={currentTranslation}
            onValueChange={onTranslationChange}
          >
            <SelectTrigger className="bg-primary-dark text-white border-primary-light w-[220px] focus:ring-white">
              <SelectValue placeholder="Select translation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRA">Douay-Rheims (DRA)</SelectItem>
              <SelectItem value="NRSVCE">NRSV Catholic Edition</SelectItem>
              <SelectItem value="NABRE">New American Bible Revised Ed.</SelectItem>
              <SelectItem value="GNT">Good News Translation (GNT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Header;