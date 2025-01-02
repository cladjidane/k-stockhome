import React, { useState, useRef, useEffect } from "react";

interface AutocompleteInputProps {
  suggestions: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
  placeholder?: string;
  label: string;
  helpText?: string;
  name: string;
}

export default function AutocompleteInput({
  suggestions,
  selectedItem,
  onItemChange,
  placeholder,
  label,
  helpText,
  name,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = suggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()),
      )
      .slice(0, 5);
    setFilteredSuggestions(filtered);
  }, [inputValue, suggestions]);

  useEffect(() => {
    setInputValue(selectedItem || "");
  }, [selectedItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    if (!value) {
      onItemChange("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onItemChange(inputValue.trim());
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      const suggestions =
        suggestionsRef.current?.querySelectorAll('[role="option"]');
      if (suggestions?.length) {
        (suggestions[0] as HTMLElement).focus();
      }
    }
  };

  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    suggestion: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onItemChange(suggestion);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = e.currentTarget.nextElementSibling as HTMLElement;
      if (next) next.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = e.currentTarget.previousElementSibling as HTMLElement;
      if (prev) {
        prev.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <div
          className="w-full p-4 shadow-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600  bg-white"
          onClick={() => {
            inputRef.current?.focus();
            setInputValue("");
            onItemChange("");
          }}
        >
          <input
            ref={inputRef}
            type="text"
            id={name}
            className="text-black flex-1 outline-none w-full"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={`${name}-suggestions`}
            aria-autocomplete="list"
          />
        </div>
      </div>
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">
          {helpText} • Échap pour fermer les suggestions
        </p>
      )}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id={`${name}-suggestions`}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none"
              onClick={() => {
                onItemChange(suggestion);
                setShowSuggestions(false);
              }}
              onKeyDown={(e) => handleSuggestionKeyDown(e, suggestion)}
              role="option"
              tabIndex={0}
            >
              <span className="text-black block truncate">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
