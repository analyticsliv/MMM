// /feature/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const menuItems = [
        { label: "Connectors", path: "/feature/connectors" },
        { label: "Subpage 2", path: "/feature/subpage2" },
        // Add more subpages here
    ];

    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState("Feature Section");

    useEffect(() => {
        // Set the current label based on the current path
        const currentItem = menuItems.find((item) => item.path === pathname);
        if (currentItem) {
            setCurrentLabel(currentItem.label);
        } else {
            setCurrentLabel("Feature Section");
        }
    }, [pathname, menuItems]);

    return (
        <div className="flex bg-gray-600">
            <aside className="w-64 h-screen bg-gray-800 text-white">
                <div className="p-4 text-lg font-semibold border-b border-gray-700">
                    Feature Menu
                </div>
                <nav className="flex flex-col p-4">
                    {menuItems.map((item) => (
                        <Link key={item.path} href={item.path}>
                            <span className="p-2 mt-2 text-gray-300 rounded hover:bg-gray-700">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <header className="p-4 text-2xl font-semibold border-b border-gray-200">
                    {currentLabel}
                </header>
                <div className="mt-4">{children}</div>
            </main>
        </div>
    );
}
