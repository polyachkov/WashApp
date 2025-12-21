import { createContext, useContext, useState } from "react";

type MenuContextType = {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);

    return (
        <MenuContext.Provider value={{ isOpen, toggle, close }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const ctx = useContext(MenuContext);
    if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
    return ctx;
};
