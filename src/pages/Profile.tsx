import { useRef } from "react";
import {
  User, Envelope, Clock, Trophy, Target, Flame, BookOpen, PencilSimple, Camera, Trash,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, profileLoading: loading, avatarUrl, uploadAvatar, deleteAvatar } = useGlobalState();
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadAvatar(file);
    e.target.value = "";
  };

  const stats = profile
    ? [
        { label: "Day Streak", val: `${profile.current_streak}`, icon: Flame, color: "text-orange-500 bg-orange-500/10" },
        { label: "Avg Score", val: `${profile.average_score.toFixed(1)}%`, icon: Target, color: "text-blue-500 bg-blue-500/10" },
        { label: "Study Hours", val: `${profile.total_study_hours.toFixed(1)}h`, icon: Clock, color: "text-purple-500 bg-purple-500/10" },
        { label: "Exams Done", val: `${profile.exams_completed}`, icon: Trophy, color: "text-yellow-500 bg-yellow-500/10" },
      ]
    : [];

  return (
    <Layout>
      <div className="min-h-screen p-6 lg:p-12 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative mb-12">
          <div className="h-48 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 w-full overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
          </div>

          <div className="px-8 flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-background border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-3xl" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-black text-primary">
                    {initials}
                  </div>
                )}
              </div>
              {/* Avatar overlay actions */}
              <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  title="Upload avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
                {avatarUrl && (
                  <button
                    onClick={deleteAvatar}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-red-500/60 text-white"
                    title="Remove avatar"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1 pb-2">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-black tracking-tight mb-2">{profile?.full_name}</h1>
                  <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2"><Envelope weight="bold" /> {profile?.email}</span>
                    {profile?.peak_performance_time && (
                      <span className="flex items-center gap-2"><BookOpen weight="bold" /> Peak: {profile.peak_performance_time}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <Button variant="outline" className="mb-2 rounded-full font-bold" onClick={() => navigate("/settings")}>
              <PencilSimple className="mr-2" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
            : stats.map((s) => (
                <div key={s.label} className="bg-card border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.color)}>
                    <s.icon weight="fill" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black">{s.val}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
        </div>

        {/* Cognitive Profile */}
        {!loading && profile && (
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Cognitive Profile</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Peak Performance Time</div>
                <div className="font-black text-lg capitalize">{profile.peak_performance_time ?? "Not set"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Longest Streak</div>
                <div className="font-bold">{profile.longest_streak} days</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
