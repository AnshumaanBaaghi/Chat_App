import { OtpComponent } from "@/components/otpComponent";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const Otp = () => {
  const { email } = useSelector((state) => state.userDetail);

  const handleOtpSubmit = (otp) => {
    console.log("OTP:", otp);
  };
  useEffect(() => {
    console.log("render");
  }, []);
  return (
    <OtpComponent email={email} length={4} onOtpSubmit={handleOtpSubmit} />
  );
};
