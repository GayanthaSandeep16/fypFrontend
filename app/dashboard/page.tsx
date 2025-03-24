"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import {BsGear, BsPeople} from "react-icons/bs";

// Types for API responses (adjust based on actual API data structure)
interface TrainResult {
    message: string;
    status: string;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    walletAddress: string;
    sector: "healthcare" | "finance";
    organization: string;
    reason: string;
    isValid?: boolean;
}

interface Notification {
    id: string;
    email: string;
    status: "sent" | "failed";
    timestamp: string;
    error?: string;
}

export default function AdminDashboard() {
    const [trainResult, setTrainResult] = useState<TrainResult | null>(null);
    const [validUsers, setValidUsers] = useState<User[]>([]);
    const [invalidUsers, setInvalidUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState({
        train: false,
        users: false,
        notifications: false,
    });
    const [error, setError] = useState<string | null>(null);

    // Base URL for API (replace with your actual API base URL)
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    // Fetch valid users
    const fetchValidUsers = async () => {
        setLoading((prev) => ({ ...prev, users: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/valid-submissions`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Failed to fetch valid users");
            const data: User[] = await response.json();
            setValidUsers(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((prev) => ({ ...prev, users: false }));
        }
    };

    // Fetch invalid users
    const fetchInvalidUsers = async () => {
        setLoading((prev) => ({ ...prev, users: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/invalid-submissions`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Failed to fetch invalid users");
            const data: User[] = await response.json();
            setInvalidUsers(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((prev) => ({ ...prev, users: false }));
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading((prev) => ({ ...prev, notifications: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            const data: Notification[] = await response.json();
            setNotifications(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((prev) => ({ ...prev, notifications: false }));
        }
    };

    // Train model
    const handleTrainModel = async () => {
        setLoading((prev) => ({ ...prev, train: true }));
        setTrainResult(null);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/train`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Failed to train model");
            const data: TrainResult = await response.json();
            setTrainResult(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((prev) => ({ ...prev, train: false }));
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchValidUsers();
        fetchInvalidUsers();
        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full
          bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent blur-[100px]" />
                <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full
          bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent blur-[100px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
                    Admin Dashboard
                </h1>

                {/* Tabs */}
                <Tabs defaultValue="train" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-4 bg-gradient-to-br from-blue-700/20 to-blue-500/20">
                        <TabsTrigger value="train" className="text-white data-[state=active]:bg-blue-600/50">
                            Train Model
                        </TabsTrigger>
                        <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-600/50">
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-600/50">
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="admin" className="text-white data-[state=active]:bg-blue-600/50">
                            Admin
                        </TabsTrigger>
                    </TabsList>

                    {/* Train Model Tab */}
                    <TabsContent value="train">
                        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
                            <CardHeader>
                                <CardTitle className="text-white">Train Model</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Trigger model training and view the results here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={handleTrainModel}
                                    disabled={loading.train}
                                    className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors flex items-center justify-center"
                                >
                                    <BsGear className="h-6 w-6 mr-2" />
                                    {loading.train ? "Training..." : "Train Model"}
                                </Button>
                                {trainResult && (
                                    <p className="mt-4 text-gray-200">
                                        Result: {trainResult.message} (Status: {trainResult.status})
                                    </p>
                                )}
                                {error && !loading.train && (
                                    <p className="mt-4 text-red-400">Error: {error}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
                            <CardHeader>
                                <CardTitle className="text-white">User Management</CardTitle>
                                <CardDescription className="text-gray-300">
                                    View valid and invalid user submissions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Valid Users */}
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-4">Valid Users</h3>
                                    {loading.users ? (
                                        <p className="text-gray-300">Loading...</p>
                                    ) : validUsers.length > 0 ? (
                                        <ul className="space-y-4 max-h-64 overflow-y-auto">
                                            {validUsers.map((user) => (
                                                <li key={user.id} className="text-gray-200">
                                                    <strong>{user.fullName}</strong> ({user.email})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-300">No valid users found.</p>
                                    )}
                                </div>
                                {/* Invalid Users */}
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-4">Invalid Users</h3>
                                    {loading.users ? (
                                        <p className="text-gray-300">Loading...</p>
                                    ) : invalidUsers.length > 0 ? (
                                        <ul className="space-y-4 max-h-64 overflow-y-auto">
                                            {invalidUsers.map((user) => (
                                                <li key={user.id} className="text-gray-200">
                                                    <strong>{user.fullName}</strong> ({user.email})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-300">No invalid users found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
                            <CardHeader>
                                <CardTitle className="text-white">Email Notifications</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Monitor email send statuses and failures.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading.notifications ? (
                                    <p className="text-gray-300">Loading...</p>
                                ) : notifications.length > 0 ? (
                                    <ul className="space-y-4 max-h-64 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <li key={notification.id} className="text-gray-200">
                        <span>
                          {notification.email} -{" "}
                            <span
                                className={
                                    notification.status === "sent" ? "text-green-400" : "text-red-400"
                                }
                            >
                            {notification.status}
                          </span>
                        </span>
                                                {notification.error && (
                                                    <span className="text-red-400"> ({notification.error})</span>
                                                )}
                                                <span className="text-sm text-gray-400 block">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-300">No notifications found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Admin Tab */}
                    <TabsContent value="admin">
                        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
                            <CardHeader>
                                <CardTitle className="text-white">Admin Management</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Create new admin accounts here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors flex items-center justify-center"
                                >
                                    <BsPeople className="h-6 w-6 mr-2" />
                                    Create New Admin
                                </Button>
                                <p className="text-gray-300 mt-4">
                                    (Functionality to be implemented with a future endpoint)
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}