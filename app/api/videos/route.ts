import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { auth } from "@clerk/nextjs/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const videos = await prisma.video.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(videos)
    } catch (error: any) {
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}