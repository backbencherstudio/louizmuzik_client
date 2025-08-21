"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  X,
  Search,
  Trash2,
  Mail,
  Save,
  UserPlus,
  UserMinus,
  Key,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ClientPagination } from "@/components/admin/ClientPagination";
import {
  useDeleteUserMutation,
  useFreeSubscriptionMutation,
  useGetUserDetailsQuery,
  useGetUsersQuery,
} from "@/app/store/api/adminApis/adminApis";
import { toast } from "sonner";
import DeleteModal from "@/components/Modals/DeleteModal";

interface UserStats {
  totalMelodies: number;
  totalDownloads: number;
  totalPlays: number;
  totalProducts: number;
  productsSold: number;
  totalRevenue: number;
  membershipMonths: number;
  platformCommission: number;
}

interface User {
  _id: string;
  name: string;
  producer_name: string;
  email: string;
  role: "user" | "pro";
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
  profile_image: string;
  followersCounter: number;
  melodiesCounter: number;
  subscribedAmount?: number;
  stats?: UserStats;
  paymentMethod?: "stripe" | "paypal"; 
  membershipDate?: string;
}

export default function UsersPage() {
  const [userId, setUserId] = useState<string>("");
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;
  const [pendingRoleChanges, setPendingRoleChanges] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [expandedUsers, setExpandedUsers] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // API call to get users
  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery(null);
  const users = usersData?.data || [];
  console.log(users);

  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
  } = useGetUserDetailsQuery(userId, { skip: !userId });
  const details = userDetails?.data;
  console.log(details);

  const [freeSubscription] = useFreeSubscriptionMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = (userId: string, checked: boolean) => {
    setPendingRoleChanges((prev) => ({
      ...prev,
      [userId]: checked,
    }));
  };

  const handleSaveRoleChange = async (userId: string) => {
    const newProStatus = pendingRoleChanges[userId];
    if (newProStatus === undefined) return;

    try {
      setLoading({ ...loading, [userId]: true });
      const response = await freeSubscription(userId).unwrap();
      if (response) {
        toast.success("User subscription changed successfully");
        refetch();
      } else {
        toast.error("Failed to change user subscription");
      }

      // Clear the pending change after successful save
      const newPendingChanges = { ...pendingRoleChanges };
      delete newPendingChanges[userId];
      setPendingRoleChanges(newPendingChanges);
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Failed to change user role. Please try again.");
    } finally {
      setLoading({ ...loading, [userId]: false });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading({ ...loading, [`delete-${userId}`]: true });
      const response = await deleteUser(userId).unwrap();
      if (response) {
        toast.success(response.message);
        refetch();
        setDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        toast.error("Failed to delete user");
      }

      // Clear any pending changes for the deleted user
      if (pendingRoleChanges[userId]) {
        const newPendingChanges = { ...pendingRoleChanges };
        delete newPendingChanges[userId];
        setPendingRoleChanges(newPendingChanges);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading({ ...loading, [`delete-${userId}`]: false });
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete._id);
    }
  };

  const toggleUserExpanded = (userId: string) => {
    setUserId(userId);
    setExpandedUsers((prev) => {

      if (prev[userId]) {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      }
      return { [userId]: true };
    });
  };

  const filteredUsers = users.filter(
    (user: User) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.producer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Function to calculate user stats (you might get these from the API in a real scenario)
  const getUserStats = (user: User): UserStats => {
    return {
      totalMelodies: user.melodiesCounter || 0,
      totalDownloads: Math.floor(user.melodiesCounter * 3.8) || 0, // Example calculation
      totalPlays: Math.floor(user.melodiesCounter * 12.5) || 0, // Example calculation
      totalProducts: Math.floor((user.melodiesCounter || 0) / 4) || 0,
      productsSold: Math.floor((user.melodiesCounter || 0) / 6) || 0,
      totalRevenue: (user.subscribedAmount || 0) * (user.isPro ? 10 : 0),
      membershipMonths: user.isPro ? 3 : 0, // Example value
      platformCommission:
        (user.subscribedAmount || 0) * (user.isPro ? 10 : 0) * 0.03,
    };
  };

  // Helper function to calculate months from membership date
  const calculateMembershipMonths = (membershipDate: string | undefined): number => {
    if (!membershipDate) return 0;
    
    const membershipStart = new Date(membershipDate);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - membershipStart.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); 
    
    return diffMonths;
  };

  if (isLoading) return <div className="p-6 text-white">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading users</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">User Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 text-zinc-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Name
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Email
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Pro Member
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Join Date
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Last Active
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-zinc-400">
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: User) => {
                  const userStats = getUserStats(user);
                  return (
                    <>
                      <tr
                        key={user._id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                      >
                        <td className="p-4 text-white">
                          {user.name || user.producer_name}
                        </td>
                        <td className="p-4 text-white">{user.email}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={
                                pendingRoleChanges[user._id] !== undefined
                                  ? pendingRoleChanges[user._id]
                                  : user.isPro
                              }
                              onCheckedChange={(checked) =>
                                handleRoleChange(user._id, checked)
                              }
                              disabled={
                                user.paymentMethod === "stripe" ||
                                user.paymentMethod === "paypal"
                              }
                            />
                            <span className="text-zinc-200">
                              {pendingRoleChanges[user._id] !== undefined
                                ? pendingRoleChanges[user._id]
                                  ? "Pro"
                                  : "Free"
                                : user.isPro
                                ? "Pro"
                                : "Free"}{" "}
                              {pendingRoleChanges[user._id] !== undefined && (
                                <span className="text-zinc-400">(Pending)</span>
                              )}
                              {(user.paymentMethod === "stripe" ||
                                user.paymentMethod === "paypal") && (
                                <span>
                                  ({" "}
                                  <span
                                    className={`capitalize font-semibold ${
                                      user.paymentMethod === "stripe"
                                        ? "text-violet-800"
                                        : "text-blue-800"
                                    }`}
                                  >
                                    {user.paymentMethod}
                                  </span>{" "}
                                  )
                                </span>
                              )}
                            </span>
                            {pendingRoleChanges[user._id] !== undefined && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveRoleChange(user._id);
                                }}
                                className="ml-2 px-3 py-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
                                disabled={loading[user._id]}
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-white">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-white">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user);
                                setDeleteModalOpen(true);
                              }}
                              className="text-zinc-400 hover:text-red-500"
                              disabled={loading[`delete-${user._id}`]}
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUserExpanded(user._id);
                              }}
                              className="text-zinc-400 hover:text-zinc-200"
                            >
                              {expandedUsers[user._id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedUsers[user._id] && (
                        <tr className="bg-zinc-800/30 border-b border-zinc-800">
                          <td colSpan={6} className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-zinc-800/50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                  Melodies
                                </h3>
                                <div className="space-y-2">
                                  <p className="text-white">
                                    Total: {details?.melodyStatus.totalPlays}
                                  </p>
                                  <p className="text-white">
                                    Downloads: {details?.melodyStatus.totalDownloads}
                                  </p>
                                  <p className="text-white">
                                    Plays: {details?.melodyStatus.totalPlays}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-zinc-800/50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                  Products
                                </h3>
                                <div className="space-y-2">
                                  <p className="text-white">
                                    Total: {details?.totalPack}
                                  </p>
                                  <p className="text-white">
                                    Sold: {details?.packSoldStatus.totalSalesAmount}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-zinc-800/50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                  Revenue
                                </h3>
                                <div className="space-y-2">
                                  <p className="text-white">
                                    Total: ${details?.packSoldStatus.totalSalesAmount?.toFixed(2) || '0.00'}
                                  </p>
                                  <p className="text-zinc-400 text-sm">
                                    Platform Fee (3%): $
                                    {((details?.packSoldStatus.totalSalesAmount || 0) * 0.03).toFixed(2)}
                                  </p>
                                  <p className="text-emerald-500">
                                    Net: $
                                    {((details?.packSoldStatus.totalSalesAmount || 0) * 0.97).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-zinc-800/50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                  Membership
                                </h3>
                                <p className="text-white">
                                  {user.membershipDate ? (
                                    `${calculateMembershipMonths(user.membershipDate)} months`
                                  ) : (
                                    "No membership date"
                                  )}
                                </p>
                                {user.isPro && user.subscribedAmount && (
                                  <p className="text-white mt-1">
                                    ${user.subscribedAmount || 0}/month
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <ClientPagination total={totalUsers} limit={limit} />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        itemToDelete={userToDelete ? { title: userToDelete.name || userToDelete.producer_name || userToDelete.email } : null}
        isDeleting={loading[`delete-${userToDelete?._id}`] || false}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
