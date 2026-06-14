"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Building,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  ShieldAlert
} from "lucide-react";

export default function BookingConfirm() {
  const router = useRouter();
  
  // Pending Booking details
  const [pending, setPending] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Confirmation state
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const activeSession = getSession();
    setSession(activeSession);
    
    const saved = localStorage.getItem("bmv_pending_booking");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPending(parsed);
      
      // Auto fill if session is active
      if (activeSession) {
        setContactName(activeSession.name);
        setContactEmail(activeSession.email);
        setContactPhone(activeSession.phone || "");
      }
    } else {
      // If no pending booking, redirect to venues
      router.push("/venues");
    }
  }, [router]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await apiFetch<any>("/booking", {
        method: "POST",
        body: {
          venueId: pending.venueId,
          bookingDate: pending.date,
          specialRequest: `Coordinator: ${contactName}, Phone: ${contactPhone}, Email: ${contactEmail}`,
        },
      });

      // Clear pending booking
      localStorage.removeItem("bmv_pending_booking");
      
      // Use bookingReference as display ID (e.g. BMV-XXXXXX)
      setBookingId(response.bookingReference || response.bookingId);
      setIsSuccess(true);
    } catch (err: any) {
      setApiError(err.message || "Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pending) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <p className="text-neutral-muted">Loading booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {isSuccess ? (
          // GORGEOUS SUCCESS STATE
          <div className="bg-white border border-neutral-light rounded-2xl p-8 md:p-12 shadow-xl text-center flex flex-col items-center animate-scale-in max-w-2xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-teal-light text-teal-primary flex items-center justify-center mb-6 shadow-inner animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <h2 className="font-serif font-bold text-3xl text-neutral-dark mb-2">Booking Confirmed!</h2>
            <p className="text-sm text-neutral-muted mb-6">
              Your venue reservation request has been processed and locked in.
            </p>

            <div className="bg-[#FAFAF8] border border-neutral-light rounded-xl p-5 w-full text-left space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs border-b border-neutral-light pb-2">
                <span className="text-neutral-muted font-semibold">Booking ID</span>
                <span className="font-mono font-bold text-teal-primary">{bookingId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Venue</span>
                <span className="font-bold text-neutral-dark">{pending.venueName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Date & Slot</span>
                <span className="font-bold text-neutral-dark">{pending.date} ({pending.slot})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-semibold">Expected Guests</span>
                <span className="font-bold text-neutral-dark">{pending.guests} Guests</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-light">
                <span className="text-neutral-muted font-semibold">Amount Paid</span>
                <span className="font-bold text-teal-primary text-sm">₹{pending.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-teal-primary text-white hover:bg-teal-hover px-8 py-3 rounded-xl h-auto text-sm font-bold">
                  Go to Home
                </Button>
              </Link>
              <Link href="/venues">
                <Button variant="outline" className="w-full sm:w-auto border-input text-neutral-dark hover:bg-neutral-light px-8 py-3 rounded-xl h-auto text-sm font-bold">
                  Browse More Venues
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // CONFIRMATION FORM & SUMMARY
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-neutral-dark mb-2">Review & Confirm Booking</h2>
            <p className="text-sm text-neutral-muted mb-8">
              Please double check your details and fill in the coordinator contact form.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              {/* Form panel */}
              <form onSubmit={handleConfirmBooking} className="md:col-span-3 bg-white border border-neutral-light rounded-2xl p-6 shadow-sm space-y-5">
                
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs flex gap-2 items-start animate-fade-in">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </div>
                )}

                <h3 className="text-lg font-serif font-bold text-neutral-dark pb-2 border-b border-neutral-light">Event Coordinator Details</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Full Name</label>
                  <Input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter coordinator name"
                    className="h-10 border-input rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Email Address</label>
                    <Input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="h-10 border-input rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Mobile Number</label>
                    <Input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="h-10 border-input rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-[#fcfaf5] border border-amber-cta/20 p-4 rounded-xl flex gap-3 text-xs text-[#b87842] leading-relaxed">
                  <ShieldCheck className="h-5 w-5 text-amber-cta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Secure Transaction Guarantee</span>
                    Your booking is covered by BookMyVenue's Venue Guarantee. If the partner fails to deliver the space in agreed conditions, you receive a 100% refund.
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-cta text-white hover:bg-amber-hover py-4 h-auto text-base font-bold shadow-md shadow-amber-cta/20 rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Securing Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Confirm & Secure Booking
                    </>
                  )}
                </Button>
              </form>

              {/* Summary panel */}
              <div className="md:col-span-2 space-y-6">
                <Card className="border border-neutral-light shadow-sm bg-white rounded-2xl overflow-hidden">
                  <div className="relative h-36 w-full bg-neutral-light">
                    <Image
                      src={pending.venueImage}
                      alt={pending.venueName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-neutral-dark line-clamp-1">{pending.venueName}</h4>
                      <p className="text-xs text-neutral-muted flex items-center gap-1 mt-1">
                        <Building className="h-3.5 w-3.5 text-teal-primary" /> Venue Reservation
                      </p>
                    </div>

                    <hr className="border-neutral-light" />

                    <div className="space-y-2.5 text-xs text-neutral-dark font-medium">
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Calendar className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Date: <strong>{pending.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Clock className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Slot: <strong>{pending.slot}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-muted">
                        <Users className="h-4 w-4 text-teal-primary shrink-0" />
                        <span>Guests: <strong>{pending.guests} Guests</strong></span>
                      </div>
                    </div>

                    <hr className="border-neutral-light" />

                    <div className="space-y-2 text-xs text-neutral-muted">
                      <div className="flex justify-between">
                        <span>Base rate</span>
                        <span className="font-semibold text-neutral-dark">₹{pending.totalPrice ? Math.round(pending.totalPrice / 1.205).toLocaleString("en-IN") : "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Taxes</span>
                        <span className="font-semibold text-neutral-dark">Included</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-neutral-dark pt-2 border-t border-neutral-light">
                        <span>Total Price</span>
                        <span className="text-teal-primary text-base">₹{pending.totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
