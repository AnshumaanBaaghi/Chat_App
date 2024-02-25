import { OtpComponent } from "@/components/otpComponent";
import React, { useState } from "react";

export const Otp = () => {
  const handleOtpChange = (otp) => {
    console.log("OTP:", otp);
    // You can perform any actions with the OTP value here
  };
  return (
    <>
      <OtpComponent length={6} onOtpChange={handleOtpChange} />
    </>
  );
};
