import { createContext, useContext } from "react";
import Pages from "./Pages.js";

export const PageContext = createContext<{ currentPage: Pages | null, setCurrentPage: React.Dispatch<React.SetStateAction<Pages | null>> }>({currentPage: Pages.CONNECTION, setCurrentPage: () => {}});
export const usePageContext = () => useContext(PageContext);