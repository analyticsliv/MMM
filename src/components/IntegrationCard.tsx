"use client";
import { motion } from "framer-motion";
import React from "react";

interface IntegrationCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    primaryColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    buttonText: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
    icon,
    title,
    description,
    onClick,
    primaryColor,
    textColor,
    bgColor,
    borderColor,
    glowColor,
    buttonText,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`relative p-10 flex flex-col gap-4 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.2)] ${bgColor} ${borderColor} max-w-xl w-full text-center overflow-hidden group`}
        >
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative  flex justify-center"
            >
                <div className={`w-16 h-16 ${textColor} drop-shadow-md`}>
                    {icon}
                </div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`text-3xl sm:text-4xl font-extrabold ${textColor} relative `}
            >
                {title}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`${textColor} mt-2 relative `}
            >
                {description}
            </motion.p>

            <motion.button
                whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 20px ${glowColor}`,
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative mt-3 max-w-fit mx-auto inline-flex items-center justify-center px-8 py-4 ${primaryColor} text-white text-lg font-semibold rounded-xl shadow-xl  overflow-hidden transition-all duration-300 ease-in-out`}
                onClick={onClick}
            >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-in-out blur-sm" />
                <span className="relative ">{buttonText}</span>
            </motion.button>
        </motion.div>
    );
};

export default IntegrationCard;
