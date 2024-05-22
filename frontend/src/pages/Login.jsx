import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "@/components/formError";
import { loginUser, updateUserDetails, userDetails } from "@/api";
import { Otp } from "./Otp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, updateUserDetail } from "@/redux/actions/userActions";
import { Loading } from "@/components/loading";
import { useToast } from "@/components/ui/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploadInputBox } from "@/components/card/imageUploadInputBox";
import { v4 } from "uuid";

const FormSchema = z.object({
  emailOrUsername: z.string().min(5, {
    message: "Username or Email contain at least 5 Characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 Characters.",
  }),
});

export const Login = () => {
  const [currentStep, setCurrentStep] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isAuth = useSelector((state) => state.user.isAuth);
  const { userId } = useSelector((state) => state.user.userDetail);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await loginUser(data);
      if (res?.data?.user) {
        const { name, email, username, avatar, _id } = res.data.user;
        dispatch(
          updateUserDetail({ name, email, username, avatar, userId: _id })
        );
        dispatch(login());
        navigate("/");
      } else if (res?.data?.email) {
        dispatch(
          updateUserDetail({ email: res.data.email, userId: res.data._id })
        );
        setCurrentStep("otp");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    } catch (error) {
      if (error?.response?.data?.status == "error") {
        setErrorMessage(error.response.data.message);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const uploadImageToDB = async (url) => {
    return updateUserDetails({ avatar: url });
  };

  const updateAuthStatus = () => {
    dispatch(login());
  };

  useEffect(() => {
    (async () => {
      if (!isAuth) {
        try {
          const user = await userDetails();
          if (user?.data?.user) {
            const { name, email, username, avatar, _id } = user.data.user;
            dispatch(
              updateUserDetail({ name, email, username, avatar, userId: _id })
            );
            dispatch(login());
            navigate("/");
          }
        } catch (error) {
          console.log("error:", error);
        }
      }
    })();
  }, []);

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex h-screen items-center">
      <div className="w-1/3 m-auto min-h-[50vh] flex flex-col justify-center border border-red-500 rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep ? currentStep : "empty"}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === "login" ? (
              <div
                className="py-10 flex justify-center items-center"
                style={{ width: "100%" }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-4/5 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="emailOrUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Your Username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormError message={errorMessage} />
                    {!isLoading ? (
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Loading />
                      </Button>
                    )}
                  </form>
                </Form>
              </div>
            ) : currentStep === "otp" ? (
              <Otp setCurrentStep={setCurrentStep} />
            ) : currentStep === "addProfilePart" ? (
              <div className=" flex flex-col items-center m-6">
                <ImageUploadInputBox
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  firebasePath={`profileImages/${userId || v4()}`}
                  uploadImageToDB={uploadImageToDB}
                  placeholder="Add Profile Picture"
                  size="12rem"
                />
                <div className=" w-full flex justify-around mt-6">
                  <Button variant="outline" onClick={updateAuthStatus}>
                    Skip
                  </Button>
                  <Button disabled={!imageUrl} onClick={updateAuthStatus}>
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
