import { FC } from "react";
import { HiChevronDown } from "react-icons/hi";
import Typography from "./Typography";

const flags: { [name: string]: string } = {
  usa: "🇺🇸",
};

interface LanguageSelectorProps {
  language?: string;
  className?: string;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({
  language = "usa",
  className,
}) => (
  <button
    type="button"
    className={`flex items-center border rounded-xl px-2 py-1 border-light-blue hover:border-indigo-500 transition ease-in-out delay-150 duration-300 ${
      className ?? ""
    }`}
  >
    <Typography size="flag">{flags[language]}</Typography>
    <HiChevronDown />
  </button>
);

export default LanguageSelector;
