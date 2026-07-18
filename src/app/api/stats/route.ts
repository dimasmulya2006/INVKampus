import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalItems, totalUsers, itemsByCondition, itemsByCategory] = await Promise.all([
      prisma.item.count(),
      prisma.user.count(),
      prisma.item.groupBy({ by: ["condition"], _count: { id: true } }),
      prisma.item.groupBy({ by: ["category"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
    ]);

    const conditionMap: Record<string, number> = {};
    itemsByCondition.forEach((c) => {
      conditionMap[c.condition] = c._count.id;
    });

    return NextResponse.json({
      totalItems,
      totalUsers,
      totalGood: conditionMap["BAIK"] || 0,
      totalMinorDamage: conditionMap["RUSAK_RINGAN"] || 0,
      totalMajorDamage: conditionMap["RUSAK_BERAT"] || 0,
      itemsByCategory: itemsByCategory.map((c) => ({ category: c.category, count: c._count.id })),
    });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil statistik" }, { status: 500 });
  }
}
