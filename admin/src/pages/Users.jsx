import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(backendUrl + "/api/user/list", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch users");
        }
    };

    const updateRole = async (id, role) => {
        try {
            const res = await axios.post(
                backendUrl + "/api/user/update-role",
                { id, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Role updated");
                fetchUsers();
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to update role");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Users</h2>

            {/* Table Header */}
            <div className="grid grid-cols-4 font-semibold bg-gray-100 p-2 border">
                <p>Name</p>
                <p>Email</p>
                <p>Phone</p>
                <p>Role</p>
            </div>

            {/* Users List */}
            {users.map((user) => (
                <div
                    key={user._id}
                    className="grid grid-cols-4 items-center p-2 border text-sm"
                >
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{user.phone || "N/A"}</p>

                    <select
                        value={user.role}
                        onChange={(e) =>
                            updateRole(user._id, e.target.value)
                        }
                        className="border p-1"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default Users;