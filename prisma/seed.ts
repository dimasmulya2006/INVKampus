import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // Hash password
  const adminPassword = await bcrypt.hash("admin123", 10);
  const petugasPassword = await bcrypt.hash("petugas123", 10);

  // Buat akun Admin
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin dibuat: ${admin.username}`);

  // Buat akun Petugas
  const petugas = await prisma.user.upsert({
    where: { username: "petugas1" },
    update: {},
    create: {
      name: "Petugas Inventaris",
      username: "petugas1",
      password: petugasPassword,
      role: "PETUGAS",
    },
  });
  console.log(`✅ Petugas dibuat: ${petugas.username}`);

  // Buat contoh data barang
  const items = [
    {
      code: "INV-001",
      name: "Laptop Dell Latitude",
      category: "Elektronik",
      quantity: 10,
      condition: "BAIK" as const,
      location: "Lab Komputer A",
      dateReceived: new Date("2024-01-15"),
      description: "Laptop untuk kegiatan perkuliahan",
    },
    {
      code: "INV-002",
      name: "Proyektor Epson EB-X51",
      category: "Elektronik",
      quantity: 5,
      condition: "BAIK" as const,
      location: "Ruang Kelas 101",
      dateReceived: new Date("2024-02-10"),
      description: "Proyektor untuk presentasi",
    },
    {
      code: "INV-003",
      name: "Meja Belajar Mahasiswa",
      category: "Furnitur",
      quantity: 50,
      condition: "BAIK" as const,
      location: "Ruang Kelas 101",
      dateReceived: new Date("2023-08-01"),
      description: "Meja belajar standar untuk mahasiswa",
    },
    {
      code: "INV-004",
      name: "Kursi Dosen",
      category: "Furnitur",
      quantity: 3,
      condition: "RUSAK_RINGAN" as const,
      location: "Ruang Dosen",
      dateReceived: new Date("2022-07-20"),
      description: "Kursi ergonomis untuk dosen",
    },
    {
      code: "INV-005",
      name: "AC Split Daikin 1 PK",
      category: "Elektronik",
      quantity: 8,
      condition: "BAIK" as const,
      location: "Lab Komputer B",
      dateReceived: new Date("2023-12-05"),
      description: "AC untuk kenyamanan ruangan",
    },
  ];

  for (const item of items) {
    const created = await prisma.item.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
    console.log(`✅ Barang dibuat: [${created.code}] ${created.name}`);
  }

  console.log("\n🎉 Seeding selesai!");
  console.log("=".repeat(40));
  console.log("📋 Akun yang tersedia:");
  console.log("  👤 Admin    → username: admin    | password: admin123");
  console.log("  👤 Petugas  → username: petugas1 | password: petugas123");
  console.log("=".repeat(40));
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
