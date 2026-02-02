export interface Video {
    id: string;
    public_id: string;
    title: string;
    description: string;
    createdAt: Date;
    userId: string;
    bytes: number;
    originalSize: number;
    compressedSize: number;
    duration: number;
}