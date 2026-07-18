import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data barang" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const item = await prisma.item.update({
      where: { id: params.id },
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        quantity: parseInt(data.quantity),
        condition: data.condition,
        location: data.location,
        dateReceived: new Date(data.dateReceived),
        description: data.description,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate data barang" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.item.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus data barang" }, { status: 500 });
  }
}
