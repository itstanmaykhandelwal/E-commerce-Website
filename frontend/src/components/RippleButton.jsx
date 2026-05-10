import React from "react";

const RippleButton = ({ children, onClick }) => {
    const handleClick = (e) => {
        const button = e.currentTarget;

        // Create span
        const ripple = document.createElement("span");

        const size = button.offsetWidth;

        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left - size / 2;

        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;

        ripple.style.left = `${x}px`;

        ripple.style.top = `${y}px`;

        ripple.className = "ripple-span";

        // Append ripple
        button.appendChild(ripple);

        // Remove after animation
        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });

        // Run your actual onClick
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className="flex justify-center items-center relative overflow-hidden px-8 py-4 bg-black hover:bg-neutral-800 text-white rounded-full font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
            {children}
        </button>
    );
};

export default RippleButton;
