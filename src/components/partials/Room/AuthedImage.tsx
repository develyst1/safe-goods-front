"use client";

import { Image, Skeleton } from "antd";
import { useAuthedImage } from "@/hooks/room";
import type { FileRef } from "@/types/api/main/room";

interface AuthedImageProps {
  file: FileRef;
  size?: number;
}

/** A slip / evidence thumbnail loaded through the bearer-token client; click → AntD preview. */
export default function AuthedImage({ file, size = 112 }: AuthedImageProps) {
  const { src, isPending } = useAuthedImage(file.url);
  if (isPending || !src) {
    return <Skeleton.Image active style={{ width: size, height: size }} />;
  }
  return (
    <Image
      src={src}
      alt={file.fileName}
      width={size}
      height={size}
      className="rounded-[10px] object-cover"
      style={{ objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }}
    />
  );
}
