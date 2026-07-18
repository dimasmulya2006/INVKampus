import { Package, Tags, Users, AlertTriangle, CheckCircle, Clock, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getStats() {
  const [totalItems, totalUsers, itemsByCondition, categories] = await Promise.all([
    prisma.item.count(),
    prisma.user.count(),
    prisma.item.groupBy({ by: ["condition"], _count: { id: true } }),
    prisma.item.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  const conditionMap: Record<string, number> = {};
  itemsByCondition.forEach((c) => {
    conditionMap[c.condition] = c._count.id;
  });

  const recentItems = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    totalItems,
    totalUsers,
    totalCategories: categories.length,
    totalGood: conditionMap["BAIK"] || 0,
    totalMinorDamage: conditionMap["RUSAK_RINGAN"] || 0,
    totalMajorDamage: conditionMap["RUSAK_BERAT"] || 0,
    recentItems,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Workspace Overview</h1>
        <p className="text-text-secondary text-sm font-medium">Real-time metrics of your campus inventory.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard 
          title="Total Items" 
          value={stats.totalItems.toString()} 
          icon={<Package size={22} />} 
          trend="+12%"
        />
        <StatCard 
          title="Categories" 
          value={stats.totalCategories.toString()} 
          icon={<Tags size={22} />} 
        />
        <StatCard 
          title="Available" 
          value={stats.totalGood.toString()} 
          icon={<CheckCircle size={22} className="text-success" />} 
          accent="text-success"
        />
        <StatCard 
          title="Needs Repair" 
          value={(stats.totalMinorDamage + stats.totalMajorDamage).toString()} 
          icon={<AlertTriangle size={22} className="text-warning" />} 
          accent="text-warning"
        />
        <StatCard 
          title="Team Members" 
          value={stats.totalUsers.toString()} 
          icon={<Users size={22} className="text-brand-accent" />} 
          accent="text-brand-accent"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary text-bg-base rounded-lg">
                <Package size={18} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Recent Additions</h2>
            </div>
            <Link href="/dashboard/items" className="text-sm text-brand-accent font-semibold hover:text-brand-primary transition-colors flex items-center gap-1 group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-text-tertiary uppercase tracking-wider font-semibold border-b border-border-subtle">
                <tr>
                  <th className="px-4 py-4 font-semibold">Item Code</th>
                  <th className="px-4 py-4 font-semibold">Name</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50">
                {stats.recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-surface-hover transition-colors group cursor-pointer">
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-text-secondary">{item.code}</td>
                    <td className="px-4 py-4 font-semibold">{item.name}</td>
                    <td className="px-4 py-4 text-text-secondary">
                      <span className="px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.condition === "BAIK" ? "bg-success" :
                          item.condition === "RUSAK_RINGAN" ? "bg-warning" : "bg-danger"
                        }`}></div>
                        <span className="text-xs font-semibold text-text-secondary">
                          {item.condition === "BAIK" ? "Good" : item.condition === "RUSAK_RINGAN" ? "Minor Damage" : "Major Damage"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-text-tertiary text-xs font-medium">{new Date(item.dateReceived).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
                {stats.recentItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-text-tertiary font-medium">No items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-brand-primary text-bg-base rounded-lg">
              <Activity size={18} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">System Log</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-subtle before:to-transparent">
            {stats.recentItems.slice(0, 4).map((item) => (
              <ActivityItem 
                key={`act-${item.id}`}
                title="Item Registered" 
                desc={`${item.name} (${item.code}) was added to the inventory.`} 
                time={new Date(item.createdAt).toLocaleDateString('id-ID')} 
              />
            ))}
            {stats.recentItems.length === 0 && (
              <div className="text-sm text-text-tertiary text-center py-8 font-medium">System is quiet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, accent }: { title: string, value: string, icon: React.ReactNode, trend?: string, accent?: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-default relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500 ${accent || "text-text-primary"}`}>
        {icon}
      </div>
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl bg-bg-surface border border-border-subtle shadow-sm ${accent || "text-text-primary"}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, desc, time }: { title: string, desc: string, time: string }) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-bg-base border-2 border-brand-primary z-10 shadow-sm"></div>
      <div className="ml-8 flex flex-col">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{desc}</p>
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary mt-2 font-medium">
          <Clock size={12} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
