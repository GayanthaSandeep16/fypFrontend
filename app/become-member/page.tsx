"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

// Define the form schema with Zod, including email
const formSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    walletAddress: z.string().min(10, "Wallet address must be at least 10 characters"),
    sector: z.enum(["Healthcare", "Finance"], {
        required_error: "Please select a sector",
    }),
    organization: z.string().min(2, "Organization name must be at least 2 characters"),
    reason: z.string().min(10, "Please provide a reason with at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BecomeMember() {
    const { user, isLoaded } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formInitialized, setFormInitialized] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter(); // Initialize useRouter

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            walletAddress: "",
            sector: undefined,
            organization: "",
            reason: "",
        },
    });

    // Pre-fill form with Clerk data
    useEffect(() => {
        if (isLoaded && user && !formInitialized) {
            form.reset({
                fullName: user.fullName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
                walletAddress: "",
                sector: undefined,
                organization: "",
                reason: "",
            });
            setFormInitialized(true);
        }
    }, [isLoaded, user, form, formInitialized]);

    const onSubmit = async (data: FormValues) => {
        if (!isLoaded || !user) {
            form.setError("root", { message: "Please wait for authentication to complete" });
            return;
        }

        console.log("User ID from Clerk:", user.id); // Debug: Check if user.id exists
        setIsSubmitting(true);
        try {
            const requestBody = {
                name: data.fullName,
                email: data.email,
                organization: data.organization,
                sector: data.sector,
                reason: data.reason,
                role: "User",
                clerkUserId: user.id,
                walletAddress: data.walletAddress,
            };
            console.log("Request body:", requestBody); // Debug: Log the body before sending

            const response = await fetch('https://backend.purechain.store/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            console.log("Response from server:", result); // Debug: Log server response

            if (!response.ok) {
                throw new Error(result.error || "Failed to create user");
            }

            console.log("User created successfully:", result);
            setSuccessMessage(result.message); // Set success message
            form.reset();
            router.push('/'); // Redirect to home page
        } catch (error) {
            console.error("Submission error:", error);
            form.setError("root", { message: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                {/* ... background styling ... */}
            </div>
            <div className="container mx-auto px-6 max-w-2xl relative z-10">
                <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
                    Join the PureChain Community
                </h1>
                <p className="text-xl text-gray-300 text-center mb-12">
                    Sign up to contribute to decentralized data quality and power the future of AI.
                </p>

                {!isLoaded && <p className="text-white text-center">Loading authentication...</p>}

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
                                            placeholder="you@example.com"
                                            className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                                            {...field}
                                        />
                                    </FormControl>
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

                        {/* Sector */}
                        <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Sector</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors min-h-12">
                                                <SelectValue placeholder="Select your sector" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/90 text-white border-blue-500/20">
                                                <SelectGroup>
                                                    <SelectLabel>Sectors</SelectLabel>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Organization */}
                        <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Organization</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your Company"
                                            className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Reason for Joining */}
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Reason for Joining</FormLabel>
                                    <FormControl>
                                        <textarea
                                            placeholder="Why do you want to join PureChain?"
                                            className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-300">
                                        Share your motivation—we’d love to know!
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Sign Up"}
                        </Button>
                    </form>
                </FormProvider>

                {successMessage && (
                    <p className="text-white text-center mt-4">{successMessage}</p>
                )}

                <div className="text-center mt-8">
                    <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}