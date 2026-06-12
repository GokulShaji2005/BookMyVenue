import { POST } from "@/app/api/[...path]/route";
import { apiFetch } from "@/src/lib/api";

export interface VerifyOtpResponse {
    verified: boolean;
    phone: string;
    phoneVerifiedToken: string;
}


export const sendOtp = (
    phone: string
) => {
    return apiFetch(`/auth/send-otp`, {
        method: "POST",
        body: { phone }
    })
}

export const verifyOtp = (
    phone: string,
    otp: string
) => {
    return apiFetch<VerifyOtpResponse>(
        "/auth/verify-otp", {
        method: "POST",
        body: { phone, otp }
    })
}

export const register = (
    name: string, phone: string, email: string, password: string, phoneToken: string, role: string
) => {
    return apiFetch(`/users/register`, {
        method: "POST",
        body: { name, phone, email, password, phoneVerifiedToken: phoneToken, role }
    })

}