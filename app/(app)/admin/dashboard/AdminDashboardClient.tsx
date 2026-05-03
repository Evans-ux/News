"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Mail, 
  User, 
  Calendar, 
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Trash2,
  Shield,
  ShieldCheck,
  Award
} from "lucide-react";

type PendingAuthor = {
  id: string;
  name: string;
  bio: string | null;
  urlToImage: string | null;
  social_media_links: any;
  user_Id: string;
  user: {
    email: string;
    name: string | null;
  } | null;
};

type Author = PendingAuthor & {
  approved: boolean;
};

type UserData = {
  id: string;
  email: string;
  name: string | null;
  user_roles: {
    role: { id: string; name: string }
  }[];
  authors: { id: string; approved: boolean } | null;
};

export default function AdminDashboardClient({ 
  initialPendingAuthors,
  allAuthors,
  allUsers
}: { 
  initialPendingAuthors: PendingAuthor[];
  allAuthors: Author[];
  allUsers: UserData[];
}) {
  const [activeTab, setActiveTab] = useState<"pending" | "authors" | "users">("pending");
  const [pending, setPending] = useState<PendingAuthor[]>(initialPendingAuthors);
  const [authors, setAuthors] = useState<Author[]>(allAuthors);
  const [users, setUsers] = useState<UserData[]>(allUsers);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPending = pending.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  async function handleApprove(id: string) {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/approve-author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: id }),
      });

      if (res.ok) {
        toast.success("Author approved successfully!");
        setPending(pending.filter(a => a.id !== id));
        setAuthors(authors.map(a => a.id === id ? { ...a, approved: true } : a));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve author");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDecline(id: string) {
    if (!confirm("Are you sure you want to decline this application? It will be permanently removed.")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/decline-author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: id }),
      });

      if (res.ok) {
        toast.success("Application declined");
        setPending(pending.filter(a => a.id !== id));
        setAuthors(authors.filter(a => a.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to decline author");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleToggleAdmin(userId: string, currentIsAdmin: boolean) {
    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/toggle-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: !currentIsAdmin }),
      });

      if (res.ok) {
        toast.success(`User updated successfully!`);
        setUsers(users.map(u => {
          if (u.id === userId) {
            const roles = !currentIsAdmin 
              ? [...u.user_roles, { role: { id: "temp", name: "ADMIN" } }]
              : u.user_roles.filter(r => r.role.name !== "ADMIN");
            return { ...u, user_roles: roles };
          }
          return u;
        }));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRevokeAuthor(id: string) {
    if (!confirm("Are you sure you want to revoke this author's access? They will no longer be able to post or access the dashboard.")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/revoke-author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: id }),
      });

      if (res.ok) {
        toast.success("Author access revoked");
        const revokedAuthor = authors.find(a => a.id === id);
        if (revokedAuthor) {
          setAuthors(authors.filter(a => a.id !== id));
          const { approved: _, ...authorData } = revokedAuthor;
          setPending([...pending, authorData]);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to revoke author");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDeleteUser(userId: string) {

    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    
    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        toast.success("User deleted");
        setUsers(users.filter(u => u.id !== userId));
        setAuthors(authors.filter(a => a.user_Id !== userId));
        setPending(pending.filter(p => p.user_Id !== userId));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveTab("pending")}
          className={`bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer ${activeTab === "pending" ? "ring-2 ring-red-500/20 border-red-500/50" : ""}`}
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-black text-foreground">{pending.length}</p>
          </div>
        </div>
        <div 
          onClick={() => setActiveTab("authors")}
          className={`bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer ${activeTab === "authors" ? "ring-2 ring-green-500/20 border-green-500/50" : ""}`}
        >
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Authors</p>
            <p className="text-2xl font-black text-foreground">{authors.length}</p>
          </div>
        </div>
        <div 
          onClick={() => setActiveTab("users")}
          className={`bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer ${activeTab === "users" ? "ring-2 ring-purple-500/20 border-purple-500/50" : ""}`}
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Platform Users</p>
            <p className="text-2xl font-black text-foreground">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border/60 rounded-3xl shadow-xl overflow-hidden">
        {/* Header/Toolbar */}
        <div className="p-6 border-b border-border/60 flex flex-col md:flex-row gap-6 items-center justify-between bg-muted/20">
          <div className="flex bg-muted p-1 rounded-2xl w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("pending")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "pending" ? "bg-background shadow-lg shadow-black/5 text-foreground scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pending ({pending.length})
            </button>
            <button 
              onClick={() => setActiveTab("authors")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "authors" ? "bg-background shadow-lg shadow-black/5 text-foreground scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Authors
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "users" ? "bg-background shadow-lg shadow-black/5 text-foreground scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Users
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
            <button className="p-2 border border-input rounded-xl hover:bg-background transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Table/List Content */}
        <div className="overflow-x-auto">
          {activeTab === "pending" && (
            filteredPending.length === 0 ? (
              <EmptyState message="No pending applications" submessage="When users apply to be authors, they will appear here." />
            ) : (
              <div className="divide-y divide-border/60">
                {filteredPending.map((author) => (
                  <AuthorRow 
                    key={author.id} 
                    author={author} 
                    onApprove={handleApprove} 
                    onDecline={handleDecline} 
                    processingId={processingId} 
                  />
                ))}
              </div>
            )
          )}

          {activeTab === "authors" && (
            filteredAuthors.length === 0 ? (
              <EmptyState message="No authors found" submessage="Try adjusting your search or filters." />
            ) : (
              <div className="divide-y divide-border/60">
                {filteredAuthors.map((author) => (
                  <AuthorRow 
                    key={author.id} 
                    author={author} 
                    onRevoke={handleRevokeAuthor}
                    processingId={processingId} 
                  />
                ))}
              </div>

            )
          )}

          {activeTab === "users" && (
            filteredUsers.length === 0 ? (
              <EmptyState message="No users found" submessage="Try adjusting your search or filters." />
            ) : (
              <div className="divide-y divide-border/60">
                {filteredUsers.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onToggleAdmin={handleToggleAdmin} 
                    onDelete={handleDeleteUser} 
                    processingId={processingId} 
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function EmptyState({ message, submessage }: { message: string; submessage: string }) {
  return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
        <Users className="w-8 h-8" />
      </div>
      <div>
        <p className="text-lg font-bold">{message}</p>
        <p className="text-muted-foreground">{submessage}</p>
      </div>
    </div>
  );
}

function AuthorRow({ 
  author, 
  onApprove, 
  onDecline, 
  onRevoke,
  processingId 
}: { 
  author: any; 
  onApprove?: (id: string) => void; 
  onDecline?: (id: string) => void; 
  onRevoke?: (id: string) => void;
  processingId: string | null;
}) {

  return (
    <div className="p-6 hover:bg-muted/10 transition-colors group">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/20 overflow-hidden shrink-0">
            {author.urlToImage ? (
              <img src={author.urlToImage} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              author.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-foreground">{author.name}</h3>
              {author.approved && (
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Approved
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {author.user?.email}
              </span>
            </div>
            {author.bio && (
              <div className="mt-3 bg-muted/50 p-4 rounded-2xl border border-border/40 text-sm italic leading-relaxed max-w-2xl">
                &ldquo;{author.bio}&rdquo;
              </div>
            )}
          </div>
        </div>

        {(onApprove || onDecline || onRevoke) && (
          <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
            {onDecline && (
              <button 
                onClick={() => onDecline(author.id)}
                disabled={processingId === author.id}
                className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
              >
                Decline
              </button>
            )}
            {onRevoke && (
              <button 
                onClick={() => onRevoke(author.id)}
                disabled={processingId === author.id}
                className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processingId === author.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Revoke Access
              </button>
            )}
            {onApprove && (
              <button 
                onClick={() => onApprove(author.id)}
                disabled={processingId === author.id}
                className="flex-1 lg:flex-none px-6 py-2 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processingId === author.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Approve
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function UserRow({ 
  user, 
  onToggleAdmin, 
  onDelete, 
  processingId 
}: { 
  user: any; 
  onToggleAdmin: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  processingId: string | null;
}) {
  const isAdmin = user.user_roles?.some((r: any) => r.role.name === "ADMIN") || false;
  const isAuthor = user.authors !== null;

  return (
    <div className="p-6 hover:bg-muted/10 transition-colors group">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-foreground">{user.name || "Anonymous User"}</h3>
              <div className="flex gap-1">
                {isAdmin && (
                  <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Admin
                  </span>
                )}
                {isAuthor && (
                  <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold uppercase">
                    <Award className="w-2.5 h-2.5" />
                    Author
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
          <button 
            onClick={() => onToggleAdmin(user.id, isAdmin)}
            disabled={processingId === user.id}
            className={`flex-1 lg:flex-none px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${isAdmin ? "text-amber-600 hover:bg-amber-50" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {isAdmin ? "Remove Admin" : "Make Admin"}
          </button>
          <button 
            onClick={() => onDelete(user.id)}
            disabled={processingId === user.id}
            className="flex-1 lg:flex-none p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
            title="Delete User"
          >
            {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
