"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout";
import { useUpdateUserProfileMutation } from "../store/api/userManagementApis/userManagementApis";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import { useRef } from "react";

export default function AccountPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null); // New state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For image preview

  const { data: user } = useLoggedInUser();
  const userId = user?.data?._id;
  console.log("userId 34", userId);
  const [updateUserProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();

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

    try {
      await updateUserProfile({ formData, id: userId }).unwrap();
    } catch (err) {
      console.log("err 61", err);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
  };

  //   const handleLinkPayPal = () => {
  //     // This will redirect the producer to PayPal OAuth login page
  //     window.location.href = "http://localhost:5000/payment/link-paypal";
  //   };

  // const userId = "686378d1394a32f019c80030"; // Producer's user ID

  const handleLinkPayPal = async () => {
    // Fetch the PayPal authorization URL from the backend API
    const response = await fetch(
      `http://localhost:5000/api/v1/payment/link-paypal?userId=${userId}`
    );
    const data = await response.json();

    // If the data contains the PayPal OAuth URL, redirect the user
    if (data && data.data) {
      window.location.href = data.data; // Redirect the user to PayPal OAuth login page
    }
  };

  // https://www.paypal.com/connect?client_id=AeMnBMlrboT2yZ77Ny1Zuwm-UnhJeeMzvE1D1ana1ZetUAzPfo7C-Px41iR4FijH5SN1FHEYrGokg3G2&response_type=code&scope=openid&redirect_uri=http://localhost:5000/api/v1/payment/paypal-callback
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
                      PayPal Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="paypalEmail"
                      placeholder="your@email.com"
                      defaultValue={user?.data?.paypalEmail || ""}
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
                      name="artistName"
                      placeholder="Your producer name"
                      defaultValue={user?.data?.producer_name || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-zinc-400">
                      Country
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Your country"
                      defaultValue={user?.data?.country || ""}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
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
                      name="instagram"
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
                      name="youtube"
                      placeholder="Your Youtube username"
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
                      name="tiktok"
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
                    name="bio"
                    placeholder="Tell us about yourself"
                    defaultValue={user?.data?.bio || ""}
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
                  Current Plan: <span className="text-emerald-500">Pro</span>
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
            <Button
              onClick={handleLinkPayPal}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
            >
              Link your PayPal Account
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
