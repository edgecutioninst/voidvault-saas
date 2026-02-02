import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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
        const { title, description, publicId, duration, originalSize } = body;

        const video = await prisma.video.create({
            data: {
                title: title,
                description: description || "",
                publicId: publicId,
                originalSize: originalSize ? String(originalSize) : "0",
                compressedSize: String(Number(originalSize || 0) * 0.8), // Placeholder compression logic
                duration: Number(duration) || 0,
                bytes: Number(originalSize) || 0,
                userId: userId
            }
        });

        return NextResponse.json(video);

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Error saving video" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}