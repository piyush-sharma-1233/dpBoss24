import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = (await req.json().catch(() => ({}))) as {
      fileName?: string;
      fileType?: string;
    };

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const extFromName = fileName && fileName.includes(".") ? fileName.split(".").pop() : undefined;
    const normalizedExtFromName = extFromName?.toLowerCase().replace(/[^a-z0-9]/g, "");
    const extFromType = fileType && fileType.includes("/") ? fileType.split("/")[1] : undefined;
    const normalizedExtFromType = extFromType?.toLowerCase().replace(/[^a-z0-9]/g, "");
    const ext = normalizedExtFromName || normalizedExtFromType || "bin";

    const resolvedContentType = (() => {
      if (fileType && typeof fileType === "string" && fileType.trim().length > 0) return fileType;
      if (!ext) return "application/octet-stream";
      if (ext === "mp4") return "video/mp4";
      if (ext === "mov") return "video/quicktime";
      if (ext === "webm") return "video/webm";
      if (ext === "mkv") return "video/x-matroska";
      return "application/octet-stream";
    })();

    const key = `uploads/videos/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) {
      return NextResponse.json({ error: "S3_BUCKET_NAME not configured" }, { status: 500 });
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: resolvedContentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });
    const region = process.env.AWS_REGION;
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return NextResponse.json({ key, url, fileUrl, contentType: resolvedContentType });
  } catch {
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
