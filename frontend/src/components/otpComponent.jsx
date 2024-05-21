import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export const OtpComponent = ({
  sendOrResendOtp,
  length,
  onOtpSubmit,
  email,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [resendOtpTimer, setResendOtpTimer] = useState(30);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.trim();
    if (isNaN(val)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.reduce((acc, el) => {
      return el == " " ? acc : acc + el;
    }, "");
    if (combinedOtp.length === length) {
      onOtpSubmit(combinedOtp);
    }

    if (val && index < length - 1 && inputRefs[index + 1]) {
      inputRefs[index + 1].focus();
    }
  };
  const handleClick = (index) => {
    inputRefs[index].setSelectionRange(1, 1);
  };
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs[index - 1]
    ) {
      inputRefs[index - 1].focus();
    }
  };

  useEffect(() => {
    if (resendOtpTimer > 0) {
      setTimeout(() => {
        setResendOtpTimer((pre) => pre - 1);
      }, 1000);
    }
  }, [resendOtpTimer]);

  useEffect(() => {
    if (inputRefs[0]) {
      inputRefs[0].focus();
    }
  }, []);
  return (
    <div className="py-10 w-full box-border min-h-[50vh]">
      <h2 className="px-4">OTP Verification</h2>
      <p className="px-4">Enter the OTP sent to {email}</p>
      <div className="border border-red-800 px-4 flex gap-5">
        {otp.map((el, index) => (
          <Input
            key={index}
            className="w-10 text-center"
            value={el}
            ref={(input) => (inputRefs[index] = input)}
            onChange={(e) => handleChange(e, index)}
            onClick={(e) => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <p className="px-4">
        Didn't receive the OTP?
        {resendOtpTimer > 0 ? (
          <span className="ml-2"> resend in {resendOtpTimer}</span>
        ) : (
          <span
            onClick={() => {
              sendOrResendOtp();
              setResendOtpTimer(30);
            }}
            className="ml-2 cursor-pointer text-blue-500"
          >
            resend
          </span>
        )}
      </p>
    </div>
  );
};
