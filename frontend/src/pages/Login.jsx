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
import {
  login,
  updateUnreadMessages,
  updateUserDetail,
} from "@/redux/actions/userActions";
import { Loading } from "@/components/loading";
import { useToast } from "@/components/ui/use-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
  const { _id } = useSelector((state) => state.user.userDetail);
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
      const { name, email, username, avatar, _id, unreadMessages } =
        res.data.user;
      dispatch(
        updateUserDetail({
          name,
          email,
          username,
          avatar,
          _id: _id,
        })
      );
      dispatch(updateUnreadMessages(unreadMessages));
      if (res?.data?.isEmailVerified) {
        dispatch(login());
        navigate("/");
      } else {
        setCurrentStep("otp");
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

  const uploadImageToDB = async () => {
    if (!imageUrl) return;
    try {
      await updateUserDetails({ avatar: imageUrl });
      dispatch(updateUserDetail({ avatar: imageUrl }));
      dispatch(login());
    } catch (error) {
      console.log("error:", error);
    }
  };

  const skipProfileImage = () => {
    dispatch(login());
  };

  const onRemoveImage = () => {
    setImageUrl(null);
  };

  useEffect(() => {
    (async () => {
      if (!isAuth) {
        try {
          const user = await userDetails();
          if (user?.data?.user) {
            const { name, email, username, avatar, _id, unreadMessages } =
              user.data.user;
            dispatch(
              updateUserDetail({
                name,
                email,
                username,
                avatar,
                _id: _id,
              })
            );
            dispatch(updateUnreadMessages(unreadMessages));

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
    <div className="flex fullHeight items-center bg-[#15171c]">
      <div className="text-[#ffffffe0] w-[95%] md:w-1/3 m-auto min-h-[50vh] flex flex-col justify-center border border-[#1f212a] bg-[#0d0e12] rounded-xl">
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
                className="py-10 flex justify-center items-center flex-col"
                style={{ width: "100%" }}
              >
                <p className="text-2xl mb-5">Login</p>
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
                              className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
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
                              className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
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
                        Login
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Loading />
                      </Button>
                    )}
                  </form>
                </Form>
                <div className="w-4/5 my-4 text-sm">
                  <span>Don't have an Account? </span>
                  <Link to="/register" className="text-[#976cf3]">
                    Signup
                  </Link>
                </div>
              </div>
            ) : currentStep === "otp" ? (
              <Otp setCurrentStep={setCurrentStep} />
            ) : currentStep === "addProfilePart" ? (
              <div className=" flex flex-col items-center m-6">
                <p className="text-xl mb-5">Add Profile Picture</p>
                <ImageUploadInputBox
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  firebasePath={`profileImages/${_id || v4()}`}
                  onRemoveImage={onRemoveImage}
                  placeholder="Click here to upload"
                  size="12rem"
                  className="text-black"
                />
                <div className=" w-full flex justify-around mt-6">
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={skipProfileImage}
                  >
                    Skip
                  </Button>
                  <Button disabled={!imageUrl} onClick={uploadImageToDB}>
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
