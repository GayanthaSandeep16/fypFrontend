"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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

// Define the form schema with Zod
const formSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    walletAddress: z.string().min(10, "Wallet address must be at least 10 characters"),
    sector: z.enum(["healthcare", "finance"], {
        required_error: "Please select a sector",
    }),
    organization: z.string().min(2, "Organization name must be at least 2 characters"),
    reason: z.string().min(10, "Please provide a reason with at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BecomeMember() {
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

    const onSubmit = (data: FormValues) => {
        console.log("Form submitted:", data);
        // Add your submission logic here (e.g., API call)
    };

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full
                    bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent
                    blur-[100px]" />
                <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full
                    bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent
                    blur-[100px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
            </div>
            <div className="container mx-auto px-6 max-w-2xl relative z-10">
                {/* Header */}
                <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
                    Join the PureChain Community
                </h1>
                <p className="text-xl text-gray-300 text-center mb-12">
                    Sign up to contribute to decentralized data quality and power the future of AI.
                </p>

                {/* Form */}
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
                                    <FormDescription className="text-gray-300">
                                        This will be your display name in the PureChain ecosystem.
                                    </FormDescription>
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
                                    <FormDescription className="text-gray-300">
                                        We’ll use this to contact you about your account.
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
                                    <FormDescription className="text-gray-300">
                                        Your blockchain wallet address for secure interactions.
                                    </FormDescription>
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
                                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="finance">Finance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription className="text-gray-300">
                                        Choose the industry you’re working in.
                                    </FormDescription>
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
                                    <FormDescription className="text-gray-300">
                                        Tell us where you’re affiliated.
                                    </FormDescription>
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
                            className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors"
                        >
                            Sign Up
                        </Button>
                    </form>
                </FormProvider>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}