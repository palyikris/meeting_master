"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { createClient } from "@/lib/supabase/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/password-input";
import styles from "./styles/login.module.css";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/auth/check_session";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),
  isForTablet: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      isForTablet: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code === "invalid_credentials") {
        toast.error("Invalid email or password. Please try again.");
      }
      return;
    }
    if (data.session) {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", data.session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      dispatch(
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          role: profile?.role,
          company_id: profile?.company_id,
        })
      );

      if (
        (profile?.role === "admin" || profile?.role === "company_admin") &&
        values.isForTablet
      ) {
        router.push("/tablet");
        return;
      }

      if (profile?.role === "admin") {
        router.push("/admin");
      } else if (
        profile?.role === "company_admin" ||
        profile?.role === "user"
      ) {
        router.push("/dashboard");
      }
    }
  }

  useEffect(() => {
    checkSession(supabase, router);
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.bgSquare}></div>
      <div className={styles.bgSquare}></div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#1E293B",
          },

          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#10B981",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#EF4444",
            },
          },
          loading: {
            iconTheme: {
              primary: "#4E77E4",
              secondary: "#4E77E4",
            },
          },
        }}
      ></Toaster>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.coloredSegment}>
            <div className={styles.box}>
              <h1>Welcome back!</h1>
              <p>No account? Talk to the colleague managing this app.</p>
            </div>
          </div>

          <div className={styles.formSegment}>
            <Image
              src={"/logo.png"}
              alt="Meeting master logo"
              width={200}
              height={500}
            ></Image>
            <h5 className={styles.titleDesc}>Good to see you back here.</h5>

            <div className={styles.formGroup}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@gmail.com"
                        autoComplete="email"
                        {...field}
                        style={{
                          border: "2px solid #4E77E4",
                          borderRadius: "5px",
                          width: "20em",
                          height: "3em",
                          padding: "0.5rem",
                        }}
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
                  <FormItem style={{ marginTop: "1rem" }}>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="********"
                        autoComplete="current-password"
                        {...field}
                        style={{
                          border: "2px solid #4E77E4",
                          borderRadius: "5px",
                          padding: "0.5rem",
                          height: "3em",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isForTablet"
                render={({ field }) => (
                  <FormItem style={{ marginTop: "1rem" }}>
                    <FormControl>
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            marginRight: "0.5rem",
                            border: "2px solid #4E77E4",
                            borderRadius: "5px",
                          }}
                          color="#4E77E4"
                        />
                        Tablet Mode
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit" className={styles.submitButton}>
                <span>Sign in</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
