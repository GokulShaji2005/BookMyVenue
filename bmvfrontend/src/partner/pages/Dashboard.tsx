"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, clearSession, UserSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Building,
  TrendingUp,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Star
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession || activeSession.role !== "partner") {
      router.push("/partner/login");
    } else {
      setSessionState(activeSession);
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/partner/login");
  };

  const recentBookings = [
    { id: "BK-482019", name: "Ananya Nair", email: "ananya@gmail.com", date: "24/06/2026", slot: "Full Day", guests: 600, amount: 178500, status: "Confirmed" },
    { id: "BK-903827", name: "Viren Joseph", email: "viren@outlook.com", date: "30/06/2026", slot: "Evening", guests: 120, amount: 77375, status: "Pending" },
    { id: "BK-123490", name: "Kunal Shah", email: "kunal@cred.com", date: "05/07/2026", slot: "Morning", guests: 80, amount: 48625, status: "Pending" },
    { id: "BK-339841", name: "Manoj Kumar", email: "manoj@gmail.com", date: "12/07/2026", slot: "Full Day", guests: 1200, amount: 247000, status: "Cancelled" }
  ];

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-neutral-muted">Verifying partner session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans">
      
      {/* Dashboard Top Header */}
      <header className="bg-white border-b border-neutral-light h-16 flex items-center justify-between px-6 shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-2xl font-bold text-teal-primary">
            Book<span className="text-amber-cta">My</span>Venue
          </Link>
          <span className="text-[9px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md">Partner Console</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <span className="font-bold text-neutral-dark block">Hello, {session.name}</span>
            <span className="text-neutral-muted block">Partner Account</span>
          </div>
          <div className="h-8 w-px bg-neutral-light" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-neutral-muted hover:text-destructive flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-grow flex max-w-7xl w-full mx-auto p-6 gap-6 items-start flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Welcome banner */}
          <div className="bg-white border border-neutral-light rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-dark">Venue Management Overview</h2>
              <p className="text-xs text-neutral-muted mt-0.5">Manage live availability slot grids, approve user booking requests, and audit payments.</p>
            </div>
            <Button className="bg-teal-primary text-white hover:bg-teal-hover rounded-xl flex items-center gap-1.5 h-10 font-semibold shadow-md shadow-teal-primary/20">
              <Plus className="h-4.5 w-4.5" /> Add New Venue
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Venue Views</span>
                  <span className="text-2xl font-bold text-neutral-dark block mt-1 font-sans">14,250</span>
                  <span className="text-[10px] text-teal-primary font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12% this month
                  </span>
                </div>
                <div className="h-10 w-10 bg-teal-light text-teal-primary rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Confirmed Bookings</span>
                  <span className="text-2xl font-bold text-neutral-dark block mt-1 font-sans">34</span>
                  <span className="text-[10px] text-teal-primary font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="h-3 w-3" /> +8% this month
                  </span>
                </div>
                <div className="h-10 w-10 bg-amber-light text-amber-cta rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Gross Earnings</span>
                  <span className="text-2xl font-bold text-neutral-dark block mt-1 font-sans">₹12.4L</span>
                  <span className="text-[10px] text-teal-primary font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="h-3 w-3" /> +24% this month
                  </span>
                </div>
                <div className="h-10 w-10 bg-teal-light text-teal-primary rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Average Rating</span>
                  <span className="text-2xl font-bold text-neutral-dark block mt-1 font-sans">4.8</span>
                  <div className="flex text-amber-cta gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-cta text-amber-cta" />
                    ))}
                  </div>
                </div>
                <div className="h-10 w-10 bg-amber-light text-amber-cta rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 fill-amber-cta text-amber-cta" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings table */}
          <div className="bg-white border border-neutral-light rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-light flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-neutral-dark">Recent Booking Requests</h3>
              <span className="text-xs text-neutral-muted font-medium">Auto-Refresh Active</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-light/50 border-b border-neutral-light text-neutral-muted font-bold uppercase">
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date / Slot</th>
                    <th className="px-6 py-3 text-center">Guests</th>
                    <th className="px-6 py-3 text-right">Earning Amount</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-light">
                  {recentBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-neutral-light/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-neutral-dark">{bk.id}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-neutral-dark block">{bk.name}</span>
                        <span className="text-[10px] text-neutral-muted">{bk.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-neutral-dark block">{bk.date}</span>
                        <span className="text-[10px] text-neutral-muted">{bk.slot}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-neutral-dark">{bk.guests}</td>
                      <td className="px-6 py-4 text-right font-bold text-teal-primary">₹{bk.amount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold ${
                          bk.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : bk.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}>
                          {bk.status === "Confirmed" ? <CheckCircle className="h-3 w-3" /> : bk.status === "Pending" ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {bk.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button size="sm" className="bg-teal-primary text-white hover:bg-teal-hover px-2.5 py-1 h-7 text-[10px] rounded-lg">Approve</Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-red-50 px-2.5 py-1 h-7 text-[10px] rounded-lg">Decline</Button>
                          </div>
                        ) : (
                          <span className="text-neutral-muted text-[10px] font-semibold">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Quick Calendar Slot Mock */}
          <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-light bg-neutral-light/20 flex justify-between items-center">
              <span className="font-serif font-bold text-sm text-neutral-dark">Slot Scheduler</span>
              <span className="text-[10px] font-bold text-teal-primary uppercase">June 2026</span>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-neutral-muted mb-2">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-dark">
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isBooked = dayNum % 5 === 0;
                  const isBlocked = dayNum === 17 || dayNum === 23;
                  return (
                    <div
                      key={i}
                      className={`py-2 rounded-lg cursor-pointer transition-colors ${
                        isBooked
                          ? "bg-amber-light text-amber-cta border border-amber-cta/20"
                          : isBlocked
                            ? "bg-red-50 text-red-500 border border-red-200"
                            : "hover:bg-neutral-light/50 border border-transparent"
                      }`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 justify-around text-[9px] font-bold text-neutral-muted uppercase pt-4 mt-3 border-t border-neutral-light">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-cta block" /> Booked</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 block" /> Blocked</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neutral-light block" /> Available</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Action links */}
          <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-sm text-neutral-dark pb-2 border-b border-neutral-light">Quick Checklist</h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5 items-center">
                <CheckCircle className="h-4.5 w-4.5 text-teal-primary shrink-0" />
                <span className="text-neutral-dark font-medium line-through">Configure business email profile</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <CheckCircle className="h-4.5 w-4.5 text-teal-primary shrink-0" />
                <span className="text-neutral-dark font-medium line-through">Upload ownership proofs</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Clock className="h-4.5 w-4.5 text-amber-cta shrink-0" />
                <span className="text-neutral-dark font-medium">Verify your first venue listing (Pending)</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Clock className="h-4.5 w-4.5 text-amber-cta shrink-0" />
                <span className="text-neutral-dark font-medium">Link bank account for payouts</span>
              </div>
            </div>
          </Card>
        </aside>

      </div>
    </div>
  );
}
