"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// දත්ත වල හැඩය (Type) Define කිරීම
interface SearchData {
  checkIn: string;
  checkOut: string;
  guests: string;
}

interface SearchContextType {
  searchData: SearchData | null;
  setSearchData: (data: SearchData) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  return (
    <SearchContext.Provider value={{ searchData, setSearchData }}>
      {children}
    </SearchContext.Provider>
  );
};

// පහසුවෙන් පාවිච්චි කරන්න Custom Hook එකක්
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};