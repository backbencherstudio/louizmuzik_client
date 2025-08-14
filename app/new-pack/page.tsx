"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Camera, FileArchive, Loader2, Play, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Layout from "@/components/layout";
import { useCreatePackMutation, useUpdatePackMutation, useGetPackDetailsQuery } from "../store/api/packApis/packApis";
import { toast } from "sonner";
import { useLoggedInUser } from "../store/api/authApis/authApi";

// Lista predeterminada de géneros
const AVAILABLE_GENRES = [
  "Trap",
  "Reggaeton",
  "Afrobeat",
  "Drill",
  "House",
  "Hip Hop",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Electronic",
  "Latin",
  "Dancehall",
  "Ambient",
  "Lo-Fi",
];

export default function NewPackPage({params}: {params: {edit: string}}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isLoading, setIsLoading] = useState(false);
  const [packData, setPackData] = useState({
    title: "",
    description: "",
    price: "",
    videoUrl: "",
    included: "",
    zip_path: "",
    audio_path: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [samplePackFile, setSamplePackFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [updatePack, { isLoading: isUpdatingPack }] = useUpdatePackMutation();
  const { data: user } = useLoggedInUser();
  console.log("user", user);
  
  // Fetch pack details when editing
  const { data: packDetails, isLoading: isLoadingPack } = useGetPackDetailsQuery(editId || "", {
    skip: !editId,
  });

  useEffect(() => {
    if (packDetails?.data?.singlePackData && editId) {
      const pack = packDetails.data.singlePackData;
      setPackData({
        title: pack.title || "",
        description: pack.description || "",
        price: pack.price?.toString() || "",
        videoUrl: pack.video_path || "",
        included: pack.included || "",
        zip_path: pack.zip_path || "",
        audio_path: pack.audio_path || "",
      });
      setThumbnailPreview(pack.thumbnail_image || "");
      setSelectedGenres(pack.genre || []);
      setAgreedToTerms(true);
    }
  }, [packDetails, editId]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSamplePackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSamplePackFile(e.target.files[0]);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPackData((prev) => ({ ...prev, [name]: value }));
  };

  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setGenrePopoverOpen(false);
  };

  const removeGenre = (genreToRemove: string) => {
    setSelectedGenres(
      selectedGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  // Helper function to get file name from path
  const getFileNameFromPath = (path: string) => {
    if (!path) return "";
    return path.split('/').pop() || path.split('\\').pop() || path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      if(user?.data?.paypalEmail === "" || !user?.data?.paypalEmail ){
        toast.error("Please link your PayPal account to continue");
        router.push("/account");
        return;
      }

      if (!user?.data?._id) {
        toast.error("User not authenticated");
        return;
      }

      if (!packData.title.trim()) {
        toast.error("Pack title is required");
        return;
      }
      if (!packData.price || parseFloat(packData.price) < 0.99) {
        toast.error("Price must be at least $0.99");
        return;
      }
      
      // For new packs, require all files
      if (!editId) {
        if (!thumbnailFile) {
          toast.error("Thumbnail image is required");
          return;
        }
        // if (!samplePackFile) {
        //   toast.error("Sample pack file is required");
        //   return;
        // }
        if (!audioFile) {
          toast.error("Audio demo is required");
          return;
        }
      }
      
      if (selectedGenres.length === 0) {
        toast.error("At least one genre must be selected");
        return;
      }

      const formData = new FormData();
      formData.append("userId", user.data?._id);
      formData.append("title", packData.title);
      formData.append("description", packData.description); // Fixed: use description instead of included
      formData.append("price", packData.price);
      formData.append("video_path", packData.videoUrl);
      formData.append("included", packData.included);
      formData.append("genre", JSON.stringify(selectedGenres));
      formData.append("producer", user.data?.producer_name);

      if (thumbnailFile) {
        formData.append("thumbnail_image", thumbnailFile);
      }
      if (samplePackFile) {
        formData.append("zip_path", samplePackFile);
      }
      if (audioFile) {
        formData.append("audio_path", audioFile);
      }

      if (editId) {
        // Update existing pack
        try {
          await updatePack({ id: editId, formData }).unwrap();
          toast.success("Pack updated successfully");
          router.push("/items");
        } catch (error) {
          console.error("Error updating pack:", error);
          toast.error("Failed to update pack");
        }
      } else {
        // Create new pack
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${process.env.NEXT_PUBLIC_API_URL}/pack/create-pack`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            toast.success("Pack created successfully");
            router.push("/items");
          } else {
            toast.error("Failed to create pack");
          }
        };

        xhr.onerror = () => {
          toast.error("An error occurred during the upload");
        };

        xhr.send(formData);
      }
    } catch (error) {
      console.error("Error saving pack:", error);
      toast.error(editId ? "Failed to update pack" : "Failed to create pack");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPack && editId) {
    return (
      <Layout>
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading pack details...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">
              {editId ? "Edit Pack" : "Add New Pack"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title" className="text-white">
                  Name Of The Pack
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={packData.title}
                  onChange={handleInputChange}
                  placeholder="Enter pack name"
                  className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-white">
                  Pack Price
                </Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-800 bg-zinc-900 px-3 text-zinc-400">
                    $
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.99"
                    value={packData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="rounded-l-none border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-zinc-800 bg-zinc-900 px-3 text-zinc-400">
                    USD
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-white">Add Thumbnail</Label>
                <Card className="mt-1.5 flex items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/50 h-[232px]">
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg hover:bg-zinc-800/50"
                  >
                    {thumbnailFile || thumbnailPreview ? (
                      <div className="relative h-[200px] w-[90%]">
                        <Image
                          src={
                            thumbnailFile
                              ? URL.createObjectURL(thumbnailFile)
                              : thumbnailPreview
                          }
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Camera className="h-8 w-8 text-emerald-500" />
                    )}
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                </Card>
              </div>

              {/* Sample Pack Upload */}
              <div>
                <Label className="text-white">Sample Pack Upload</Label>
                <Card className="mt-1.5 border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-8 h-[232px]">
                  <div className="flex flex-col items-center justify-center gap-4 h-full">
                    <FileArchive className="h-12 w-12 text-emerald-500" />
                    <div className="text-center">
                      <p className="text-sm text-white">
                        {samplePackFile
                          ? samplePackFile.name
                          : editId && packData.zip_path
                            ? getFileNameFromPath(packData.zip_path)
                            : editId 
                              ? "Upload new file to replace existing one"
                              : "Drag your .zip file to start uploading"}
                      </p>
                      {!samplePackFile && (
                        <p className="text-xs text-zinc-500">OR</p>
                      )}
                    </div>
                    <input
                      id="pack-upload"
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleSamplePackUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-500 bg-transparent text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                      onClick={() =>
                        document.getElementById("pack-upload")?.click()
                      }
                    >
                      {samplePackFile ? "Change file" : "Browse files"}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Audio Demo */}
            <div>
              <Label className="text-white">MP3 Audio Demo</Label>
              <p className="mb-2 text-sm text-zinc-400">
                Upload an audio demo to showcase your pack
              </p>
              <Card className="border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Play className="h-12 w-12 text-emerald-500" />
                  <div className="text-center">
                    <p className="text-sm text-white">
                      {audioFile
                        ? audioFile.name
                        : editId && packData.audio_path
                          ? getFileNameFromPath(packData.audio_path)
                          : editId 
                            ? "Upload new file to replace existing one"
                            : "Drag your .wav or .mp3 file to start uploading"}
                    </p>
                    {!audioFile && <p className="text-xs text-zinc-500">OR</p>}
                  </div>
                  <input
                    id="audio-upload"
                    type="file"
                    accept=".mp3,.wav"
                    className="hidden"
                    onChange={handleAudioUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-500 bg-transparent text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                    onClick={() =>
                      document.getElementById("audio-upload")?.click()
                    }
                  >
                    {audioFile ? "Change file" : "Browse files"}
                  </Button>
                </div>
              </Card>
              <p className="mt-2 text-sm text-zinc-500">
                Only support .wav or .mp3 audio files
              </p>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoUrl" className="text-white">
                  Promo Video URL
                </Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={packData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="YouTube or Vimeo video URL"
                  className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                />
              </div>

              <div>
                <Label className="text-white">Pack Genres</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Popover
                    open={genrePopoverOpen}
                    onOpenChange={setGenrePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-md border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                      >
                        <Plus className="h-4 w-4 text-emerald-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[200px] border-zinc-800 bg-zinc-900 p-0"
                    >
                      <Command>
                        <CommandList>
                          <CommandEmpty>No genres found</CommandEmpty>
                          <CommandGroup>
                            {AVAILABLE_GENRES.map((genre) => (
                              <CommandItem
                                key={genre}
                                onSelect={() => addGenre(genre)}
                                className="text-white hover:bg-zinc-800"
                              >
                                {genre}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="relative flex flex-1 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1"
                        >
                          <span className="text-sm text-white">{genre}</span>
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="ml-1 rounded-full p-0.5 hover:bg-zinc-700"
                          >
                            <X className="h-3 w-3 text-zinc-400" />
                          </button>
                        </span>
                      ))}
                      {selectedGenres.length === 0 && (
                        <span className="text-sm text-zinc-500">
                          Select genres...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="included" className="text-white">
                  What&apos;s included on this pack
                </Label>
                <Textarea
                  id="included"
                  name="included"
                  value={packData.included}
                  onChange={handleInputChange}
                  className="mt-1.5 min-h-[120px] border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                  placeholder="Describe what's included in your pack..."
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
                className="mt-1 border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <Label
                htmlFor="terms"
                className="text-sm leading-relaxed text-zinc-400"
              >
                By continuing to upload you are ensuring that all the details
                above are your own creation and if it reveals that you are not
                associated with it, Melody Collab will not be associated with
                you. Please check the{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-500 hover:underline"
                >
                  privacy and policy page
                </Link>{" "}
                to get everything clear to you.
              </Label>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="relative">
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 text-white text-center rounded-full h-full relative transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {/* Zebra stripes */}
                    <div className="absolute smooth-zebra inset-0 bg-gradient-to-r from-emerald-600 to-emerald-600 rounded-full opacity-50"></div>
                  </div>
                </div>

                <div className="text-emerald-100 text-sm font-medium mt-2 text-center">
                  {Math.round(uploadProgress)}% Uploading...
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            {uploadProgress === 0 && (
              <Button
                type="submit"
                disabled={!agreedToTerms || isLoading || isUpdatingPack}
                className="w-full bg-emerald-500 py-6 text-black hover:bg-emerald-600 disabled:opacity-50"
              >
                {isLoading || isUpdatingPack 
                  ? (editId ? "Updating Pack..." : "Uploading Pack...") 
                  : (editId ? "Update Pack" : "Upload This Pack")
                }
              </Button>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
