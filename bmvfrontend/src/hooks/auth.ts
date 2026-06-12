// import { register } from "module";
import { useState } from "react";
import { sendOtp } from "../customer/auth/route";
import { verifyOtp } from "../customer/auth/route";
import { register } from "../customer/auth/route";
// export const useRegister = () => {

//     const sendOtpHandler = async (phone: string) => {
//         return sendOtp(phone);
//     }

//     const verifyOtphandler = async (phone: string, otp: string) => {
//         return verifyOtp(phone, otp);
//     }

//     const registerHandler = async (data: registerDto) => {
//         return register()
//     }

//     return {
//         sendOtp: sendOtpHandler,
//         verifyOtp: verifyOtphandler,
//         register: registerHandler
//     }
// }