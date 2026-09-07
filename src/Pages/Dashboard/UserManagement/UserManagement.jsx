import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hok/UseAxiosSecure";

const normalizeRole = (role) => {
  const r = String(role || "User").toLowerCase();
  if (r === "admin") return "Admin";
  if (r === "rider") return "Rider";
  return "User";
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-semibold text-gray-400 shrink-0">{label}</span>
    <span className="text-xs font-semibold text-[#0B252C] text-right">
      {value || "—"}
    </span>
  </div>
);

const UserManagement = () => {
  const axiosSecure = UseAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [activeTab, setActiveTab] = useState("Admin");
  const [riderDetails, setRiderDetails] = useState(null);
  const [riderDetailsLoading, setRiderDetailsLoading] = useState(false);
  const [riderDetailsError, setRiderDetailsError] = useState(false);
  const perPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosSecure.get("/users");
        if (Array.isArray(data)) setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  const tabs = ["Admin", "User", "Rider"];
  const counts = { Admin: 0, User: 0, Rider: 0 };
  users.forEach((u) => {
    counts[normalizeRole(u.role)] += 1;
  });

  const filteredUsers = users
    .filter((u) => normalizeRole(u.role) === activeTab)
    .filter((u) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return (
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;
    const id = editingUser._id || editingUser.email;
    if (!id) return;
    try {
      const { data } = await axiosSecure.patch(`/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.email) === (editingUser._id || editingUser.email)
            ? { ...u, role: data.role }
            : u
        )
      );
      setEditingUser(null);
      setNewRole("");
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDelete = async (user) => {
    const id = user._id || user.email;
    if (!id) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Remove User?",
      text: `Are you sure you want to remove ${user.name || user.email}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "No",
      confirmButtonColor: "#C0E75A",
      cancelButtonColor: "#d1d5db",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/users/${id}`);
      setUsers((prev) =>
        prev.filter((u) => (u._id || u.email) !== id)
      );
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "The user has been removed.",
        confirmButtonColor: "#C0E75A",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#C0E75A",
      });
    }
  };

  const handleViewRider = async (user) => {
    setRiderDetails({ user });
    setRiderDetailsLoading(true);
    setRiderDetailsError(false);
    try {
      const { data } = await axiosSecure.get("/riders");
      const list = Array.isArray(data) ? data : [];
      const match = list.find(
        (r) =>
          String(r.email || "").toLowerCase() ===
          String(user.email || "").toLowerCase()
      );
      setRiderDetails({ user, rider: match || null });
    } catch (error) {
      console.error("Failed to fetch rider details:", error);
      setRiderDetailsError(true);
    } finally {
      setRiderDetailsLoading(false);
    }
  };

  const routeBadge = (role) => {
    const r = String(role || "user").toLowerCase();
    if (r === "admin") return "bg-rose-100 text-rose-700";
    if (r === "rider") return "bg-sky-100 text-sky-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-black text-[#0B252C]">User Management</h2>
          <p className="text-xs text-gray-400">
            View, manage and control registered users.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
        />
      </div>

      {/* Role Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab
                ? "bg-[#C0E75A] text-[#0B252C]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No {activeTab.toLowerCase()} users found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {search
              ? "Try a different search term."
              : `Registered ${activeTab.toLowerCase()}s will appear here.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] text-gray-400">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {currentUsers.map((user) => {
                const isRiderRow = normalizeRole(user.role) === "Rider";
                return (
                <tr
                  key={user._id || user.email}
                  onClick={() => isRiderRow && handleViewRider(user)}
                  className={`hover:bg-gray-50/50 ${isRiderRow ? "cursor-pointer" : ""}`}
                >
                  <td className="py-3.5 font-semibold">
                    {isRiderRow ? (
                      <button
                        onClick={() => handleViewRider(user)}
                        title="View rider details"
                        className="text-[#0B252C] hover:text-[#71C5C7] hover:underline text-left"
                      >
                        {user.name || "—"}
                      </button>
                    ) : (
                      user.name || "—"
                    )}
                  </td>
                  <td className="py-3.5 text-gray-600">{user.email}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${routeBadge(user.role)}`}
                    >
                      {normalizeRole(user.role)}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isRiderRow && (
                        <button
                          onClick={() => handleViewRider(user)}
                          className="text-gray-500 border border-gray-200 font-bold text-[11px] px-3 py-1.5 rounded-lg hover:border-[#71C5C7] hover:text-[#0B252C]"
                        >
                          Details
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setNewRole(user.role || "user");
                        }}
                        className="text-gray-500 border border-gray-200 font-bold text-[11px] px-3 py-1.5 rounded-lg hover:border-[#71C5C7] hover:text-[#0B252C]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-white bg-rose-500 hover:bg-rose-600 font-bold text-[11px] px-3 py-1.5 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-400">
            Showing {(currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-7 h-7 rounded-lg ${
                  currentPage === page
                    ? "bg-[#C0E75A] font-bold text-[#0B252C]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-sm font-bold text-[#0B252C] mb-1">Edit User Role</h3>
            <p className="text-xs text-gray-400 mb-4">
              {editingUser.name || editingUser.email}
            </p>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0B252C] focus:outline-none focus:ring-2 focus:ring-[#C0E75A] mb-5"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                className="text-xs font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-4 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Details Modal */}
      {riderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-[#0B252C]">Rider Details</h3>
                  <p className="text-xs text-gray-400">
                    Full details of the rider application.
                  </p>
                </div>
                <button
                  onClick={() => setRiderDetails(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl"
                >
                  Close
                </button>
              </div>

              {riderDetailsLoading ? (
                <div className="text-center py-10 text-xs text-gray-400">
                  Loading rider details...
                </div>
              ) : riderDetailsError || !riderDetails.rider ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400 font-semibold">
                    No rider application found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    There is no rider application linked to this account.
                  </p>
                </div>
              ) : (() => {
                const r = riderDetails.rider;
                return (
                  <>
                    <div className="flex items-center gap-3 mb-5 p-4 bg-[#F5FAEE] rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-[#C0E75A] flex items-center justify-center font-black text-lg text-[#0B252C] uppercase">
                        {(r.name || "R").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#0B252C]">{r.name}</p>
                        <p className="text-xs text-gray-500 truncate">{r.email}</p>
                      </div>
                      <span className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {r.status || "Approved"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-4">
                      <DetailRow label="Name" value={r.name} />
                      <DetailRow label="Email" value={r.email} />
                      <DetailRow label="Phone Number" value={r.phone} />
                      <DetailRow label="Region" value={r.region} />
                      <DetailRow label="District" value={r.district} />
                      <DetailRow label="Driving License" value={r.drivingLicense} />
                      <DetailRow label="NID" value={r.nid} />
                      <DetailRow label="Bike Brand / Model" value={r.bike} />
                      <DetailRow label="Bike Registration Number" value={r.bikeRegistration} />
                      <DetailRow label="About" value={r.about} />
                      <DetailRow label="Applied" value={r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""} />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
