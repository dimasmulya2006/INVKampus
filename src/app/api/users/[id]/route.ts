import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data pengguna" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const updateData: any = {
      name: data.name,
      username: data.username,
      role: data.role,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, name: true, username: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate pengguna" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus pengguna" }, { status: 500 });
  }
}
