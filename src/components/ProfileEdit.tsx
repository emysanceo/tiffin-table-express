import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X, Loader2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileEditProps {
  userId: string;
  currentProfile: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  onProfileUpdate: () => void;
}

const ProfileEdit = ({ userId, currentProfile, onProfileUpdate }: ProfileEditProps) => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(currentProfile?.full_name || "");
  const [phone, setPhone] = useState(currentProfile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(currentProfile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop() || "png";
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrl);
    setUploading(false);
    toast.success("Avatar uploaded!");
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        avatar_url: avatarUrl || null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setOpen(false);
      onProfileUpdate();
    }
    setSaving(false);
  };

  const getInitials = () => {
    if (fullName) {
      return fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "U";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border hover:border-primary transition-colors group"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {getInitials()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>
              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">Tap to upload photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="bg-muted/50 border-border"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
