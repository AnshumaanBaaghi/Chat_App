import { sendOtp, verifyOtp } from "@/api";
import { OtpComponent } from "@/components/otpComponent";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const Otp = () => {
  const { email } = useSelector((state) => state.user.userDetail);
  const { toast } = useToast();
  const navigate = useNavigate();
  const sendOrResendOtp = async () => {
    try {
      await sendOtp(email);
    } catch (error) {
      console.error("error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      await verifyOtp(otp, email);
      navigate("/");
    } catch (error) {
      if (error?.response?.data?.status == "error") {
        toast({
          variant: "destructive",
          title: error.response.data?.message,
        });
      } else {
        console.error("error:", error);
      }
    }
  };
  useEffect(() => {
    sendOrResendOtp();
  }, []);
  return (
    <OtpComponent
      sendOrResendOtp={sendOrResendOtp}
      email={email}
      length={4}
      onOtpSubmit={handleOtpSubmit}
    />
  );
};
