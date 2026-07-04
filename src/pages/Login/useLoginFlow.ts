import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { requestOTP, loginUser } from "../../redux/roaster/roasterSlice";

export const useLoginFlow = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVal, setEmailVal] = useState("");
  const [dobVal, setDobVal] = useState("");
  const [role, setRole] = useState<"teacher" | "student" | "school">("teacher");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendOTP = async () => {
    try {
      const fields = role === "school" ? ["email"] : ["email", "dob"];
      const values = await form.validateFields(fields);
      setLoading(true);

      const resultAction = await dispatch(
        requestOTP({ role, email: values.email, dob: values.dob })
      );

      if (requestOTP.fulfilled.match(resultAction)) {
        message.success("Verification code sent to your email!");
        setEmailVal(values.email);
        if (role !== "school") setDobVal(values.dob);
        setOtpSent(true);
        setTimer(150); // 2:30 countdown
      } else {
        const errorMsg = (resultAction.payload as string) || "Failed to send OTP";
        message.error(errorMsg);
      }
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(err.message || "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        loginUser({
          role,
          email: emailVal,
          dob: role === "school" ? undefined : dobVal,
          otp: values.otp,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        message.success("Logged in successfully!");
        const data = resultAction.payload;
        const schoolSlug = data.user.school_id || data.user.company_id || "greenwood-high";
        if (role === "school") {
          navigate(`/${schoolSlug}/teachers`);
        } else {
          navigate(`/${schoolSlug}/dashboard`);
        }
      } else {
        const errorMsg = (resultAction.payload as string) || "Invalid verification code";
        message.error(errorMsg);
      }
    } catch (err: any) {
      message.error(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const resetOTPState = () => {
    setOtpSent(false);
    setTimer(0);
  };

  return {
    form,
    loading,
    otpSent,
    role,
    timer,
    setRole,
    formatTimer,
    handleSendOTP,
    onFinish,
    resetOTPState,
  };
};
