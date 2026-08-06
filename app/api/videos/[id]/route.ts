import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // find the video and make sure it belongs to this user
    const video = await prisma.video.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // delete original video from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
      invalidate: true,
    });

    // delete database record
    await prisma.video.delete({
      where: {
        id: video.id,
      },
    });

    return NextResponse.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
