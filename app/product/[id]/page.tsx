"use client";

import { useState, useRef, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Heart,
  ShoppingCart,
  ArrowLeft,
  PlaySquare,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import { useCart } from "@/components/cart-context";
import { useFavoritePackMutation, useGetPackDetailsQuery } from "@/app/store/api/packApis/packApis";
import { useLoggedInUser } from "@/app/store/api/authApis/authApi";
import { Slider } from "@/components/ui/slider";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addToCart } = useCart();
  const {
    data: packDetails,
    isLoading,
    error,
  } = useGetPackDetailsQuery(id);
  const pack = packDetails?.data.singlePackData;
  const producerId = pack?.userId?._id;
  const { data: user ,refetch} = useLoggedInUser();
  const userId = user?.data?._id;
  const [favoritePack, { is: isFavoritePackLoading }] = useFavoritePackMutation();
  const isFavorite = user?.data?.favourite_packs?.includes(id);

  const morePacks = packDetails?.data?.eachUserAllPack;

  // Create product object from pack data
  const product = pack
    ? {
        id: pack._id,
        title: pack.title,
        producer: pack.producer,
        price: pack.price,
        image: pack.thumbnail_image,
        description: pack.description || "No description available",
        audioDemo: {
          name: "Audio Demo",
          duration: "0:00",
        },
        videoPreview: pack.video_path || null,
        details: {
          category: "Pack",
          genre:
            pack.genre && pack.genre.length > 0 ? pack.genre.join(", ") : "N/A",
        },
      }
    : null;

  useEffect(() => {
    if (pack?.audio_path) {
      audioRef.current = new Audio(pack?.audio_path);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.pause();
        }
      };
    }
  }, [pack?.audio_path]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        producer: product.producer,
        price: product.price,
        image: product.image,
        userId: userId,
        producerId: producerId,
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (product && userId) {
      favoritePack({ id: product.id, userId: userId });
      refetch();
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Error loading product</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Back Button */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Media */}
            <div className="lg:w-1/2">
              {/* Product Image or Video */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 mb-4">
                {showVideo && product?.videoPreview ? (
                  <video
                    src={product?.videoPreview}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={product?.image}
                    alt={product?.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {/* Media Toggle */}
              {product?.videoPreview && (
                <div className="flex gap-2">
                  <Button
                    variant={!showVideo ? "default" : "outline"}
                    className={`flex-1 ${
                      !showVideo
                        ? "bg-emerald-500 text-black hover:bg-emerald-600"
                        : "border-zinc-800"
                    }`}
                    onClick={() => setShowVideo(false)}
                  >
                    Cover
                  </Button>
                  <Button
                    variant={showVideo ? "default" : "outline"}
                    className={`flex-1 ${
                      showVideo
                        ? "bg-emerald-500 text-black hover:bg-emerald-600"
                        : "border-zinc-800"
                    }`}
                    onClick={() => setShowVideo(true)}
                  >
                    <PlaySquare className="w-4 h-4 mr-2" />
                    Video Preview
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="lg:w-1/2">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {product?.title}
                  </h1>
                  <Link
                    href={`/producers/${pack?.userId?._id || "unknown"}`}
                    className="text-emerald-500 hover:text-emerald-400 transition-colors text-lg"
                  >
                    {product?.producer}
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    isFavorite
                      ? "text-red-500 hover:text-red-600"
                      : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                  onClick={handleFavoriteToggle}
                  disabled={isFavoritePackLoading}
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              {/* Audio Demo */}
              {pack?.audio_path && (
                <div className="bg-zinc-900/50 rounded-xl p-4 mb-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-200"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {product?.audioDemo?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <span>{formatTime(currentTime)}</span>
                          <span>/</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Slider */}
                    <div className="space-y-2">
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleProgressChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Buy */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-bold text-white">
                  ${product?.price?.toFixed(2)}
                </div>
                <Button
                  className="bg-emerald-500 text-black hover:bg-emerald-600 h-12 px-8 flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Description */}
              <p className="text-zinc-300 leading-relaxed mb-8">
                {product?.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/50">
                {Object.entries(product?.details || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-zinc-500 text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-zinc-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* More from Producer */}
        {morePacks && morePacks.length > 0 && (
          <div className="border-t border-zinc-800 mt-16">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                More from {pack?.userId?.producer_name || product?.producer}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {morePacks.slice(0, 20).map((item: any) => (
                  <Link
                    key={item?._id}
                    href={`/product/${item?._id}`}
                    className="group block overflow-hidden rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={item?.thumbnail_image}
                        alt={item?.title}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105 hover:brightness-75"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                        {item?.title}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-emerald-500">
                        ${item?.price?.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
