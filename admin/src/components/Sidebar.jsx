import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiPlusSquare,
    FiList,
    FiShoppingBag,
    FiUsers
} from "react-icons/fi";

const Sidebar = () => {

    const linkClass =
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

    const activeClass = "bg-emerald-100 text-emerald-700 font-semibold";
    const normalClass = "text-gray-600 hover:bg-gray-100";

    return (
        <div className="w-[18%] min-h-screen border-r bg-white">
            <div className="flex flex-col gap-3 p-5 text-[15px]">

                {/* Dashboard */}
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${linkClass} ${isActive ? activeClass : normalClass}`
                    }
                >
                    <FiHome className="text-lg" />
                    <p className="hidden md:block">Dashboard</p>
                </NavLink>

                {/* Add Items */}
                <NavLink
                    to="/add"
                    className={({ isActive }) =>
                        `${linkClass} ${isActive ? activeClass : normalClass}`
                    }
                >
                    <FiPlusSquare className="text-lg" />
                    <p className="hidden md:block">Add Items</p>
                </NavLink>

                {/* List Items */}
                <NavLink
                    to="/list"
                    className={({ isActive }) =>
                        `${linkClass} ${isActive ? activeClass : normalClass}`
                    }
                >
                    <FiList className="text-lg" />
                    <p className="hidden md:block">List Items</p>
                </NavLink>

                {/* Orders */}
                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        `${linkClass} ${isActive ? activeClass : normalClass}`
                    }
                >
                    <FiShoppingBag className="text-lg" />
                    <p className="hidden md:block">Orders</p>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `${linkClass} ${isActive ? activeClass : normalClass}`
                    }
                >
                    <FiUsers className="text-lg" />
                    <p className="hidden md:block">Users</p>
                </NavLink>

            </div>
        </div>
    );
};

export default Sidebar;