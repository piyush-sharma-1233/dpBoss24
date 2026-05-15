/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import moment from "moment";
import { signIn, signOut } from "../../auth";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

function extractKeyFromUrl(urlStr: string, bucket?: string) {
  try {
    const u = new URL(urlStr);
    const host = u.host;
    const path = u.pathname;
    const parts = host.split(".");
    if (parts.length >= 4 && parts[1] === "s3") {
      return decodeURIComponent(path.replace(/^\//, ""));
    }
    if (bucket && path.startsWith(`/${bucket}/`)) {
      return decodeURIComponent(path.slice(bucket.length + 2));
    }
  } catch {}
  return undefined;
}

export async function doLogout() {
  await signOut({ redirectTo: "/login" });
}

export async function doCredentialLogin(formData: any) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
}

export async function createLuckyNumber(data: {
  userId: number;
  number: string;
  date: string;
  time: string;
}) {
  const { userId, number, date, time } = data;

  if (!userId || !number || !date || !time) {
    throw new Error("All fields are required.");
  }

  const newLuckyNumber = await prisma.luckyNumber.create({
    data: {
      number,
      date: date,
      time,
      user: { connect: { id: userId } },
    },
  });

  return newLuckyNumber;
}
export async function getLuckyNumbers(filter?: { userId?: number; date?: string }) {
  try {
    const luckyNumbers = await prisma.luckyNumber.findMany( {where: {
      date: filter?.date ? filter?.date : undefined,
    }});
    return luckyNumbers;
  } catch (error) {
    // console.log('error', error)
    throw new Error("Failed to fetch lucky numbers: " + error);
  }
}
export async function deleteLuckyNumber(id: number) {
  try {
    const deletedLuckyNumber = await prisma.luckyNumber.delete({
      where: {
        id: id,
      },
    });

    return deletedLuckyNumber;
  } catch (error) {
    throw new Error("Failed to delete lucky number: " + error);
  }
}

export async function editLuckyNumber(id: number, number: string, time: string) {
  try {
    const updatedLuckyNumber = await prisma.luckyNumber.update({
      where: {
        id: id,
      },
      data: {
        number: number,
        time: time,
        date: moment().format('YYYY-MM-DD'), // Automatically update the date to the current date
      },
    });

    return updatedLuckyNumber;
  } catch (error) {
    throw new Error("Failed to update lucky number: " + error);
  }
}
export async function createVideoLink(data: { videoLink: string; userId: number }) {
  const { videoLink, userId } = data;

  if (!userId || !videoLink) {
    throw new Error("Both videoLink and userId are required.");
  }

  const newVideoLink = await prisma.videoLink.create({
    data: {
      videoLink,
      user: { connect: { id: userId } },
    },
  });

  return newVideoLink;
}
export async function getAllVideoLinks() {
  try {
    const videoLinks = await prisma.videoLink.findMany({
    }); 

    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) {
      return videoLinks;
    }

    const signed = await Promise.all(
      videoLinks.map(async (v) => {
        const key = extractKeyFromUrl(v.videoLink, bucket);
        if (!key) return v;

        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 604800 });
        return { ...v, videoLink: signedUrl };
      })
    );

    return signed;
  } catch (error) {
    throw new Error("Failed to fetch video links: " + error);
  }
}
// Delete video link by ID
export async function deleteVideoLink(id: number) {
  try {
    // First, check if the video link exists
    const videoLink = await prisma.videoLink.findUnique({
      where: { id },
    });

    if (!videoLink) {
      throw new Error(`Video link with ID ${id} not found.`);
    }

    // Proceed to delete the video link
    await prisma.videoLink.delete({
      where: { id },
    });

    return { message: "Video link deleted successfully." };
  } catch (error) {
    throw new Error(`Failed to delete video link: ${error}`);
  }
}

// Edit video link
export async function editVideoLink(id: number, videoLink: string) {
  try {
    // Check if the video link exists
    const existingVideoLink = await prisma.videoLink.findUnique({
      where: { id },
    });

    if (!existingVideoLink) {
      throw new Error(`Video link with ID ${id} not found.`);
    }

    // Update the video link
    const updatedVideoLink = await prisma.videoLink.update({
      where: { id },
      data: {
        videoLink, // New video URL
      },
    });

    return updatedVideoLink;
  } catch (error) {
    throw new Error(`Failed to update video link: ${error}`);
  }
}


export async function getAllRowsByMonthYear(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1); // First day of the month
  const endDate = new Date(year, month, 0); // Last day of the month

  // Format dates as YYYY-MM-DD
  const formattedStart = startDate.toISOString().split('T')[0];
  const formattedEnd = endDate.toISOString().split('T')[0];

  const rows = await prisma.luckyNumber.findMany({
    where: {
      date: {
        gte: formattedStart,
        lte: formattedEnd,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return rows;
}