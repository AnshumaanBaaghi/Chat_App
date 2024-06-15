import { sendOtp, verifyOtp } from "@/api";
import { OtpComponent } from "@/components/otpComponent";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

export const Otp = ({ setCurrentStep }) => {
  const { email } = useSelector((state) => state.user.userDetail);
  const { toast } = useToast();
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
      setCurrentStep("addProfilePart");
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
    // sendOrResendOtp();
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
