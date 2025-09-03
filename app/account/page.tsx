"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout";
import {
  useUpdateUserPasswordMutation,
  useUpdateUserProfileMutation,
} from "../store/api/userManagementApis/userManagementApis";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import { useRef } from "react";
import { toast } from "sonner";
import { useAddPaypalEmailMutation } from "../store/api/paymentApis/paymentApis";
import countries from "@/components/Data/country";

export default function AccountPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null); // New state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For image preview
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isSubmittingPayPal, setIsSubmittingPayPal] = useState(false);

  const { data: user, refetch } = useLoggedInUser();
  const [selectedCountry, setSelectedCountry] = useState("");

  // Update selectedCountry when user data changes
  useEffect(() => {
    if (user?.data?.country) {
      console.log("Setting selectedCountry to:", user.data.country);
      setSelectedCountry(user.data.country);
    }
  }, [user?.data?.country]);



  console.log("user 42", user);
  console.log("User country:", user?.data?.country);
  const userId = user?.data?._id;
  console.log("userId 34", userId);
  const [updateUserProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();

  const [updateUserPassword, { isLoading: isUpdatingPassword }] =
    useUpdateUserPasswordMutation();

  const [addPaypalEmail, { isLoading: isAddingPayPal }] = useAddPaypalEmailMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await updateUserProfile({
        formData,
        id: userId,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        // Refresh user data after successful update
        refetch();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.data.message);
      console.log("err 61", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const old_password = (
      form.elements.namedItem("old_password") as HTMLInputElement
    ).value;
    const new_password = (
      form.elements.namedItem("new_password") as HTMLInputElement
    ).value;
    const data = { old_password, new_password };
    try {
      const response = await updateUserPassword({ data, id: userId }).unwrap();
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong");
      console.log("err", error);
    }
  };


  const handleLinkPayPal = () => {
    setPaypalEmail(user?.data?.paypalEmail || "");
    setIsPayPalModalOpen(true);
  };

  const handlePayPalEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayPal(true);

    if (!paypalEmail.trim()) {
        toast.error("Please enter a valid PayPal email");
        setIsSubmittingPayPal(false);
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
        toast.error("Please enter a valid email address");
        setIsSubmittingPayPal(false);
        return;
    }

    try {
        const response = await addPaypalEmail({ 
            paypalEmail, 
            userId: userId as string 
        }).unwrap();
        
        if (response.success) {
            toast.success(response.message || "PayPal email updated successfully!");
            setIsPayPalModalOpen(false);
            setPaypalEmail("");
            refetch();
        } else {
            toast.error(response.message || "Failed to update PayPal email");
        }
    } catch (error: any) {
        console.error("PayPal email update error:", error);
        toast.error(
            error.data?.message || 
            error.error || 
            "Failed to update PayPal email. Please try again."
        );
    } finally {
        setIsSubmittingPayPal(false);
    }
};

  const handlePayPalModalClose = () => {
    setIsPayPalModalOpen(false);
    setPaypalEmail("");
    setIsSubmittingPayPal(false);
  };

  // https://www.paypal.com/connect?client_id=AeMnBMlrboT2yZ77Ny1Zuwm-UnhJeeMzvE1D1ana1ZetUAzPfo7C-Px41iR4FijH5SN1FHEYrGokg3G2&response_type=code&scope=openid&redirect_uri=https://louizmuzik-server.vercel.app/api/v1/payment/paypal-callback
  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Edit Profile Section */}
          <Card className="border-0 bg-[#0F0F0F] p-6">
            <form onSubmit={handleProfileUpdate} encType="multipart/form-data">
              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Your Profile
              </h2>
              <div className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-4">
                  <Label
                    htmlFor="profile_image"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Profile Image
                  </Label>

                  <div className="flex items-center space-x-4">
                    {/* Custom file input button */}
                    <label
                      htmlFor="profile_image"
                      className="cursor-pointer bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Choose File
                    </label>

                    <input
                      id="profile_image"
                      name="profile_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {/* Show the profile image */}
                    <img
                      src={
                        previewUrl ||
                        user?.data?.profile_image ||
                        "/path/to/default-image.jpg"
                      }
                      alt="Profile Preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 shadow-lg"
                    />
                  </div>

                  {previewUrl && (
                    <p className="text-sm text-gray-500 mt-2">
                      Preview of your profile image
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-400">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      defaultValue={user?.data?.name || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400">
                      Email
                    </Label>
                    <Input
                      readOnly
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      defaultValue={user?.data?.email || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="artistName" className="text-zinc-400">
                      Producer Name
                    </Label>
                    <Input
                      id="artistName"
                      name="producer_name"
                      placeholder="Your producer name"
                      defaultValue={user?.data?.producer_name || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-zinc-400">
                      Country
                    </Label>
                    <Select 
                      name="country" 
                      value={selectedCountry} 
                      onValueChange={(value) => {
                        console.log("Country selection changed to:", value);
                        setSelectedCountry(value);
                      }}
                    >
                      <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-60">
                        {countries.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                                         </Select>
                   </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="beatstars" className="text-zinc-400">
                      Beatstars Username
                    </Label>
                    <Input
                      id="beatstars"
                      name="beatstars"
                      placeholder="Your Beatstars username"
                      defaultValue={user?.data?.beatstarsUsername || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-zinc-400">
                      Instagram Username
                    </Label>
                    <Input
                      id="instagram"
                      name="instagramUsername"
                      placeholder="Your Instagram username"
                      defaultValue={user?.data?.instagramUsername || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="text-zinc-400">
                      Youtube Username
                    </Label>
                    <Input
                      id="youtube"
                      name="youtubeUsername"
                      placeholder="Example: @username"
                      defaultValue={user?.data?.youtubeUsername || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok" className="text-zinc-400">
                      TikTok Username
                    </Label>
                    <Input
                      id="tiktok"
                      name="tiktokUsername"
                      placeholder="Your TikTok username"
                      defaultValue={user?.data?.tiktokUsername || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-zinc-400">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="about"
                    placeholder="Tell us about yourself"
                    defaultValue={user?.data?.about || ""}
                    className="min-h-[100px] border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Password & Security Section */}
          <Card className="border-0 bg-[#0F0F0F] p-6">
            <form onSubmit={handlePasswordChange}>
              <h2 className="text-2xl font-bold text-white mb-6">
                Password & Security
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-zinc-400">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      name="old_password"
                      placeholder="••••••••"
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-zinc-400">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="new_password"
                        placeholder="••••••••"
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-400">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        // name="confirm_password"
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Subscription Section */}
          <Card className="border-0 bg-[#0F0F0F] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Subscription</h2>
                <p className="text-zinc-400 mt-1">
                  Current Plan: <span className={`${user?.data?.isPro ? "text-emerald-500" : "text-red-500"}`}>{user?.data?.isPro ? "Pro" : "N/A"}</span> 
                </p>
              </div>
              <Button asChild variant="outline" className="border-zinc-800">
                <Link href="/subscription">Manage Subscription</Link>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Unlimited melody uploads</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Full marketplace visibility</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Priority support</span>
              </div>
            </div>
          </Card>

          {/* Payment Settings Section */}
          <Card className="border-0 bg-[#0F0F0F] p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Payment (PayPal Setting)
            </h2>
            
            {/* Show current PayPal email if set */}
            {user?.data?.paypalEmail && (
              <div className="mb-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Current PayPal Email:</p>
                <p className="text-white font-medium">{user.data.paypalEmail}</p>
              </div>
            )}
            
            <Button
              onClick={handleLinkPayPal}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
              disabled={isAddingPayPal}
            >
              {user?.data?.paypalEmail ? "Update PayPal Account" : "Link your PayPal Account"}
            </Button>
          </Card>
        </div>
      </div>

      {/* PayPal Email Modal */}
      <Dialog open={isPayPalModalOpen} onOpenChange={handlePayPalModalClose}>
        <DialogContent className="bg-[#0F0F0F] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {user?.data?.paypalEmail ? "Update PayPal Account" : "Link PayPal Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePayPalEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="paypal-email" className="text-zinc-400">
                PayPal Email Address
              </Label>
              <Input
                id="paypal-email"
                type="email"
                name="paypalEmail"
                placeholder="Enter your PayPal email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                required
                disabled={isSubmittingPayPal}
              />
              <p className="text-xs text-zinc-500">
                This email will be used to receive payments for your sales.
              </p>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePayPalModalClose}
                className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                disabled={isSubmittingPayPal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 text-black hover:bg-emerald-600"
                disabled={isSubmittingPayPal}
              >
                {isSubmittingPayPal ? "Updating..." : (user?.data?.paypalEmail ? "Update Account" : "Link Account")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
