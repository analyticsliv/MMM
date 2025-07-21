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
        { imgUrl: "/assets/nav2.png", label: "Previous Connector", path: "/feature/connectors/previousConnector" },
    ];

    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState("Connectors");

    const handleSignOut = async () => {
        setLoading(true);
        localStorage.removeItem('userSession');
        await signOut({ redirect: false });
        router.push("/login");
    };

    const toggleMenu = () => {
        setToggle(!toggle);
    }

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
        <div className="flex min-h-screen">
            <aside className={`${toggle ? "w-[50px]" : "lg:w-[220px] 2xl:w-[240px]"} fixed top-0 left-0 z-40 select-none h-screen bg-[#30486A] transition-all duration-200 text-white`}>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="p-4 py-10 text-xl mx-auto font-semibold border-gray-700">
                            <img src={`/assets/${toggle ? "AnalyticsLiv_Minimized_Space 1 (1).png" : "AnalyticsLiv_white.png"}`} className={`${toggle ? "h-10" : "mx-auto h-12 px-8"}`} alt="logo" />
                        </div>
                        <nav className="flex text-xl flex-col justify-between">
                            {menuItems?.map((item) => {
                                const isActive = (() => {
                                    if (item?.path === "/feature/connectors") {
                                        return pathname.startsWith("/feature/connectors") && !pathname.startsWith("/feature/connectors/previousConnector");
                                    }
                                    if (item?.path === "/feature/mmm") {
                                        return pathname.startsWith("/feature/mmm");
                                    }
                                    if (item?.path === "/feature/reports") {
                                        return pathname.startsWith("/feature/reports");
                                    }
                                    if (item?.path === "/feature/admin") {
                                        return pathname.startsWith("/feature/admin");
                                    }
                                    if (item?.path === "/feature/connectors/previousConnector") {
                                        return pathname === item?.path;
                                    }
                                    return pathname === item?.path;
                                })();

                                return (
                                    <Link key={item?.path} href={item?.path} className="w-full">
                                        <div title={item?.label} className={`w-full border-b border-b-[#3F5D88] py-5 px-4 flex items-center justify-between text-start gap-3 text-xl font-bold
                                    ${isActive ? " text-white bg-custom-gradient"
                                                : "text-white hover:bg-gray-800"
                                            }`}>
                                            <div className="flex items-center justify-between text-start gap-6"
                                            ><img src={item?.imgUrl} className="h-8 w-8" />
                                                {!toggle && (
                                                    <div
                                                        id="label-id"
                                                        className="truncate overflow-hidden whitespace-nowrap"
                                                    >
                                                        {item?.label}
                                                    </div>
                                                )}
                                            </div>
                                            {!toggle && item?.arrow && <img src={item?.arrow} className="mr-5" />}
                                        </div>
                                    </Link>
                                );
                            })}
                            <div id="label-id"
                                title="Sign Out"
                                onClick={handleSignOut}
                                className="px-[11px] w-full text-xl text-gray-300 rounded-[5px] hover:bg-gray-900
                                border-b border-b-[#3F5D88] py-5 flex items-center justify-start text-start gap-3 font-bold cursor-pointer"
                            ><img src="/assets/icons8-logout-16.png" alt="logout" className="h-7 w-7 mr-3" />
                                {!toggle && (
                                    <div
                                        id="label-id"
                                        className="truncate overflow-hidden whitespace-nowrap"
                                    >
                                        Sign Out
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                    <div className="flex flex-col">
                        <div className={`${toggle ? "" : "px-10"}`}>
                            <div title="Invite Teammates" className="bg-white cursor-pointer rounded-md flex justify-center items-center py-3 px-3 gap-3 mb-3">
                                <img src="/assets/email.png" alt="email" />
                                {!toggle && (
                                    <div
                                        id="label-id"
                                        className="text-primary text-xl font-normal truncate overflow-hidden whitespace-nowrap"
                                    >
                                        Invite teammates
                                    </div>
                                )}
                            </div>
                            <div title="Help with MMM" className="flex cursor-pointer justify-center items-center py-3 gap-3">
                                <img src="/assets/Help.png" alt="Help" className="h-9" />
                                {!toggle && (
                                    <div
                                        id="label-id"
                                        className="text-white text-xl font-normal truncate overflow-hidden whitespace-nowrap"
                                    >
                                        Help with MMM
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className="bg-[#1D385D] hover:bg-gray-900 py-3 mt-4 cursor-pointer flex justify-center items-center"
                            onClick={toggleMenu}
                        >
                            <img src={`${toggle ? "/assets/arrow_for_max.png" : "/assets/arrow_for_min.png"}`} alt="arrow_left" className="h-8" />
                        </div>
                    </div>
                </div>
            </aside>
            <main
                className={`${!toggle && "ml-[224px] lg:ml-[220px] 2xl:ml-[240px]"} w-full min-h-screen overflow-y-auto bg-white`}
            >
                {/* <header className="p-4 text-2xl font-semibold border-b border-gray-200">
                    {currentLabel}
                </header> */}
                <div className="">{children}</div>
            </main>
        </div>
    );
}
