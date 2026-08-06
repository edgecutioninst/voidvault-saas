/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      description,
      publicId,
      duration,
      originalSize,
      compressedSize,
      compressedUrl,
    } = body;

    const original = Number(originalSize) || 0;
    const compressed = Number(compressedSize) || 0;

    const compressionActuallyWorked = compressed > 0 && compressed < original;

    const video = await prisma.video.create({
      data: {
        title,
        description: description || "",
        publicId,

        originalSize: String(original),

        // If compression failed, display original size instead
        compressedSize: String(
          compressionActuallyWorked ? compressed : original,
        ),

        // Don't save the compressed URL if it isn't smaller
        compressedUrl: compressionActuallyWorked ? compressedUrl || null : null,

        duration: Number(duration) || 0,
        bytes: original,
        userId,
      },
    });

    return NextResponse.json(video);
  } catch (error: any) {
    console.error("Server Error:", error);

    return NextResponse.json({ error: "Error saving video" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
