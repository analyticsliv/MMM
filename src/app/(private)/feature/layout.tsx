// /feature/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const menuItems = [
        { imgUrl: "/assets/nav1.png", label: "Home", path: "/feature" },
        { imgUrl: "/assets/nav2.png", label: "Custom Connectors", path: "/feature/connectors", arrow: "/assets/triangle.png" },
        { imgUrl: "/assets/nav3.png", label: "MMM", path: "/feature/mmm", arrow: "/assets/triangle.png" },
        { imgUrl: "/assets/nav4.png", label: "Reports", path: "/feature/reports", arrow: "/assets/triangle.png" },
        { imgUrl: "/assets/nav5.png", label: "Admin", path: "/feature/admin" },
    ];
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState("Connectors");

    const handleSignOut = async () => {
        setLoading(true);
        localStorage.removeItem('userSession');
        await signOut({ redirect: false });
        router.push("/login");
    };
    useEffect(() => {
        // Set the current label based on the current path
        const currentItem = menuItems.find((item) => item.path === pathname);
        if (currentItem) {
            setCurrentLabel(currentItem.label);
        } else {
            setCurrentLabel("Connectors");
        }
    }, [pathname, menuItems]);

    return (
        <div className="flex">
            <aside className="lg:w-[270px] h-screen bg-gray-800 text-white">
                <div className="p-4 py-10 text-xl mx-auto font-semibold border-gray-700">
                    <img src="/assets/AnalyticsLiv_white.png" width={170} className="mx-auto" alt="logo" />
                </div>
                <nav className="flex text-xl flex-col">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/feature");
                        return (
                            <Link key={item.path} href={item.path} className="w-full">
                                <div className={`w-full border-b border-b-[#3F5D88] py-5 px-4 flex items-center justify-between text-start gap-3 text-xl font-bold
                                    ${isActive ? " text-white bg-custom-gradient"
                                        : "text-white hover:bg-gray-900"
                                    }`}>
                                    <div className="flex items-center justify-between text-start gap-6"
                                    ><img src={item.imgUrl} className="h-8 w-8" />
                                        {item.label}
                                    </div>
                                    <img src={`${item.arrow ? item.arrow : ''}`} className="mr-5" />
                                </div>
                            </Link>
                        );
                    })}
                    <div
                        onClick={handleSignOut}
                        className="p-2 w-full mt-2 text-xl text-gray-300 rounded-[5px] hover:bg-gray-900 
                        border-b border-b-[#3F5D88] py-5 flex items-center justify-between text-start gap-3 font-bold"
                    >Sign Out
                        {/* <img src="/assets/logout1.jpg" className="h-8 w-8" /> */}
                    </div>
                </nav>
            </aside>
            <main className="bg-white w-full">
                {/* <header className="p-4 text-2xl font-semibold border-b border-gray-200">
                    {currentLabel}
                </header> */}
                <div className="">{children}</div>
            </main>
        </div>
    );
}
