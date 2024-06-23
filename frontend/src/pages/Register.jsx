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
import { registerUser, updateUserDetails, userDetails } from "@/api";
import { Otp } from "./Otp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, updateUserDetail } from "@/redux/actions/userActions";
import { Loading } from "@/components/loading";
import { useToast } from "@/components/ui/use-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploadInputBox } from "@/components/card/imageUploadInputBox";
import { v4 } from "uuid";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  username: z
    .string()
    .min(5, {
      message: "Username contain at least 5 Alphabets.",
    })
    .max(20, {
      message: "Username must be of 20 or less characters",
    })
    .refine(
      (value) => {
        return /^(?=(?:[^a-zA-Z]*[a-zA-Z]){5})[a-zA-Z0-9_]{1,20}$/.test(value);
      },
      {
        message: "Only Alphabets, Numbers and Underscore are allowed",
      }
    ),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export const Register = () => {
  const [currentStep, setCurrentStep] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const isAuth = useSelector((state) => state.user.isAuth);
  const { userId } = useSelector((state) => state.user.userDetail);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      const { name, email, username, avatar, _id } = res.data.user;
      dispatch(
        updateUserDetail({ name, email, username, avatar, userId: _id })
      );
      setCurrentStep("otp");
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

  useEffect(() => {
    (async () => {
      if (!isAuth) {
        try {
          const user = await userDetails();
          if (user?.data?.user) {
            const { email, username, avatar, name, unreadMessages, _id } =
              user.data.user;
            dispatch(
              updateUserDetail({
                email,
                username,
                avatar,
                name,
                userId: _id,
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
    <>
      <div className="flex fullHeight items-center bg-[#15171c]">
        <div className="text-[#ffffffe0] w-[95%] md:w-1/3 m-auto min-h-[50vh]  flex flex-col justify-center border border-[#1f212a] bg-[#0d0e12] rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep ? currentStep : "empty"}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === "login" ? (
                <ScrollArea className="h-[90vh]">
                  <div
                    className="py-10 flex justify-center items-center flex-col"
                    style={{ width: "100%" }}
                  >
                    <p className="text-2xl mb-5">Register</p>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-4/5 space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Your Name"
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
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Your Username"
                                  className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="example@example.com"
                                  className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
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
                            Submit
                          </Button>
                        ) : (
                          <Button className="w-full">
                            <Loading />
                          </Button>
                        )}
                      </form>
                    </Form>
                    <div className="w-4/5 my-4 text-sm">
                      <span>Already have an Account? </span>
                      <Link to="/login" className="text-[#976cf3]">
                        Signin
                      </Link>
                    </div>
                  </div>
                </ScrollArea>
              ) : currentStep === "otp" ? (
                <Otp setCurrentStep={setCurrentStep} />
              ) : currentStep === "addProfilePart" ? (
                <div className=" flex flex-col items-center m-6">
                  <p className="text-xl mb-5">Add Profile Picture</p>
                  <ImageUploadInputBox
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    firebasePath={`profileImages/${userId || v4()}`}
                    uploadImageToDB={uploadImageToDB}
                    placeholder="Click here to upload"
                    size="12rem"
                    className="text-black"
                  />
                  <div className=" w-full flex justify-around mt-6">
                    <Button
                      variant="outline"
                      onClick={skipProfileImage}
                      className="text-black"
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
    </>
  );
};
