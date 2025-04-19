"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Define the form schema with Zod
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  walletAddress: z.string().min(10, "Wallet address must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateAdmin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { getToken } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      walletAddress: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = await getToken();
      console.log("Token:", token);

      const response = await fetch("http://54.169.111.231:3000/api/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          walletAddress: data.walletAddress,
          role: "Admin", // Hardcoded as Admin
        }),
      });

      console.log("Response Status:", response.status);
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      const result = JSON.parse(responseText);
      if (!response.ok) {
        throw new Error(result.error || "Failed to create admin");
      }

      console.log("Admin created successfully:", result);
      setSuccessMessage(result.message || "Admin created successfully!");
      form.reset();
      router.push("/admin-dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Background styling */}
      </div>
      <div className="container mx-auto px-6 max-w-2xl relative z-10">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Create New Admin
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Register a new admin to manage the PureChain platform.
        </p>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg space-y-6"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-300">
                    Must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Wallet Address */}
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Admin..." : "Create Admin"}
            </Button>

            {/* Success/Error Messages */}
            {successMessage && (
              <p className="text-green-400 text-center mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-400 text-center mt-4">{errorMessage}</p>
            )}
          </form>
        </FormProvider>

        <div className="text-center mt-8">
          <Link href="/admin-dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}