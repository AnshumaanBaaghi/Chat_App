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
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploadInputBox } from "@/components/card/imageUploadInputBox";
import { v4 } from "uuid";

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
      console.log("register:", res);
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
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Your Name" {...field} />
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
                    <Button variant="outline" onClick={skipProfileImage}>
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
