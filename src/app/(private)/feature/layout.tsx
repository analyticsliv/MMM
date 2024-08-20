// /feature/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const menuItems = [
        { label: "Connectors", path: "/feature/connectors" },
        // { label: "Facebook Connectors", path: "/feature/facebookConnectors" },
        // Add more subpages here
    ];
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState("Feature Section");

    const handleSignOut = async () => {
        setLoading(true);
        await signOut({ redirect: false });
        router.push("/login");
    };
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
        <div className="flex bg-primary-400 ">
            <aside className="w-64 h-screen bg-gray-800 text-white">
                <div className="p-4 text-xl font-semibold border-b border-gray-700">
                    Feature Menu
                </div>
                <nav className="flex text-xl flex-col p-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div
                                    className={`p-2 px-4 w-full mt-2 text-sm rounded-[5px] ${isActive
                                            ? "bg-gray-500 text-white"
                                            : "text-white hover:bg-gray-900"
                                        }`}
                                >
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                    <div
                        onClick={handleSignOut}
                        className="p-2 px-4 w-full mt-2 bg-primary-500 text-sm text-gray-300 rounded-[5px] hover:bg-gray-900"
                    >
                        Sign Out
                    </div>
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <header className="p-4 text-2xl font-semibold border-b border-gray-200">
                    {currentLabel}
                </header>
                <div className="mt-4 p-4 text-sm">{children}</div>
            </main>
        </div>
    );
}
