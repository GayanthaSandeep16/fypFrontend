"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsGear, BsPeople } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

interface TrainResult {
  message: string;
  status: string;
}

interface User {
  _id: string;
  created_at: number;
  datasetName: string;
  sector: "healthcare" | "finance";
  user: {
    email: string;
    name: string;
  };
  validationStatus: "VALID" | "INVALID";
  modelId: string;
}

interface Notification {
  _id: string;
  email: string;
  status: "success" | "failed";
  subject: string;
  timestamp: number;
  userId: string;
}

export default function AdminDashboard() {
  const [trainResult, setTrainResult] = useState<TrainResult | null>(null);
  const [validUsers, setValidUsers] = useState<User[]>([]);
  const [invalidUsers, setInvalidUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    train: false,
    users: false,
    notifications: false,
  });
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { getToken } = useAuth();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const models = [
    { id: "model1", name: "Random Forest Model" },
    { id: "model2", name: "K-Means Clustering Model" },
    { id: "model3", name: "Logistic Regression Model" },
  ];

  // Fetch valid users filtered by modelId
  const fetchValidUsers = async (tokenFetcher: () => Promise<string | null>, modelId?: string) => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const token = await tokenFetcher();
      const url = modelId 
        ? `${API_BASE_URL}/valid-submissions?modelId=${modelId}` 
        : `${API_BASE_URL}/valid-submissions`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Sending request with body:", JSON.stringify({ modelId }));
      if (!response.ok) throw new Error("Failed to fetch valid users");
      const data = await response.json();
      setValidUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Fetch invalid users filtered by modelId
  const fetchInvalidUsers = async (tokenFetcher: () => Promise<string | null>, modelId?: string) => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const token = await tokenFetcher();
      const url = modelId 
        ? `${API_BASE_URL}/invalid-submissions?modelId=${modelId}` 
        : `${API_BASE_URL}/invalid-submissions`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch invalid users");
      const data = await response.json();
      setInvalidUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Fetch notifications
  const fetchNotifications = async (tokenFetcher: () => Promise<string | null>) => {
    setLoading((prev) => ({ ...prev, notifications: true }));
    setError(null);  // Reset error state
    try {
      const token = await tokenFetcher();
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          setNotifications([]);   
          return;
        }
        throw new Error(errorData.error || "Failed to fetch notifications");
      }
      
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, notifications: false }));
    }
  };

  // Train model with selectedModel
  const handleTrainModel = async (tokenFetcher: () => Promise<string | null>, modelId: string) => {
    setLoading((prev) => ({ ...prev, train: true }));
    setTrainResult(null);
    setError(null);

    try {
      const token = await tokenFetcher();
      const response = await fetch(`${API_BASE_URL}/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify({ modelId }),
      });
      console.log("Sending request with body:", JSON.stringify({ modelId }));

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`Failed to train model: ${errorData.error}`);
      }
      const data: TrainResult = await response.json();
      setTrainResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, train: false }));
    }
  };

  useEffect(() => {
    if (selectedModel) {
      fetchValidUsers(getToken, selectedModel);
      fetchInvalidUsers(getToken, selectedModel);
    } else {
      fetchValidUsers(getToken);
      fetchInvalidUsers(getToken);
    }
    fetchNotifications(getToken);
  }, [getToken, selectedModel]);

  // Check if there are valid submissions for a specific model
  const hasValidSubmissions = (modelId: string) => {
    return validUsers.some((user) => user.modelId === modelId);
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="train" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-br from-blue-700/20 to-blue-500/20">
            <TabsTrigger value="train" className="text-white data-[state=active]:bg-blue-600/50">Train Model</TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-600/50">Users</TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-600/50">Notifications</TabsTrigger>
            <TabsTrigger value="admin" className="text-white data-[state=active]:bg-blue-600/50">Admin</TabsTrigger>
            <TabsTrigger value="models" className="text-white data-[state=active]:bg-blue-600/50">Models</TabsTrigger>
          </TabsList>

          <TabsContent value="train">
            <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Train Model</CardTitle>
                <CardDescription className="text-gray-300">Select a model to train and view the results.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-4 rounded-md cursor-pointer ${
                        selectedModel === model.id
                          ? "bg-blue-600/50 border-blue-600"
                          : "bg-blue-700/20 hover:bg-blue-600/30"
                      } border border-blue-500/30`}
                    >
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <Button
                        onClick={() => handleTrainModel(getToken, model.id)}
                        disabled={
                          loading.train || 
                          !hasValidSubmissions(model.id)
                        }
                        className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <BsGear className="h-5 w-5 mr-2" />
                        {loading.train && selectedModel === model.id ? "Training..." : "Train"}
                      </Button>
                      {!hasValidSubmissions(model.id) && (
                        <p className="text-red-400 text-sm mt-2">No valid submissions available</p>
                      )}
                    </div>
                  ))}
                </div>
                {trainResult && (
                  <p className="mt-4 text-gray-200">Result: {trainResult.message} (Status: {trainResult.status})</p>
                )}
                {error && !loading.train && (
                  <p className="mt-4 text-red-400">Error: {error}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rest of the TabsContent remains the same */}
          <TabsContent value="users">
            <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">View valid and invalid user submissions.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">
                    Valid Users {selectedModel ? `for ${models.find(m => m.id === selectedModel)?.name}` : ""}
                  </h3>
                  {loading.users ? (
                    <p className="text-gray-300">Loading...</p>
                  ) : validUsers.length > 0 ? (
                    <ul className="space-y-4 max-h-64 overflow-y-auto">
                      {validUsers.map((user) => (
                        <li key={user._id} className="text-gray-200">
                          <div><strong>Name:</strong> {user.user.name}</div>
                          <div><strong>Email:</strong> {user.user.email}</div>
                          <div><strong>Dataset:</strong> {user.datasetName}</div>
                          <div><strong>Sector:</strong> {user.sector}</div>
                          <div><strong>Model:</strong> {models.find(m => m.id === user.modelId)?.name || user.modelId}</div>
                          <div><strong>Submitted:</strong> {new Date(user.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300">No valid users found{selectedModel ? ` for ${models.find(m => m.id === selectedModel)?.name}` : ""}.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Invalid Users</h3>
                  {loading.users ? (
                    <p className="text-gray-300">Loading...</p>
                  ) : invalidUsers.length > 0 ? (
                    <ul className="space-y-4 max-h-64 overflow-y-auto">
                      {invalidUsers.map((user) => (
                        <li key={user._id} className="text-gray-200">
                          <div><strong>Name:</strong> {user.user.name}</div>
                          <div><strong>Email:</strong> {user.user.email}</div>
                          <div><strong>Dataset:</strong> {user.datasetName}</div>
                          <div><strong>Sector:</strong> {user.sector}</div>
                          <div><strong>Model:</strong> {models.find(m => m.id === user.modelId)?.name || user.modelId}</div>
                          <div><strong>Submitted:</strong> {new Date(user.created_at).toLocaleString()}</div>
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

          <TabsContent value="notifications">
            <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Email Notifications</CardTitle>
                <CardDescription className="text-gray-300">Monitor successful and failed email notifications sent to users.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.notifications ? (
                  <p className="text-gray-300">Loading...</p>
                ) : notifications.length > 0 ? (
                  <ul className="space-y-6 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className={`p-4 rounded-md ${notification.status === "success" ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
                      >
                        <div className="text-gray-200"><strong>Email:</strong> {notification.email}</div>
                        <div className="text-gray-200"><strong>Subject:</strong> {notification.subject}</div>
                        <div className="text-gray-200">
                          <strong>Status:</strong>{" "}
                          <span className={notification.status === "success" ? "text-green-400" : "text-red-400"}>
                            {notification.status}
                          </span>
                        </div>
                        <div className="text-gray-200">
                          <strong>User ID:</strong> <span className="text-blue-400">{notification.userId.slice(0, 8)}...</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          <strong>Sent:</strong> {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">No notifications found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Admin Management</CardTitle>
                <CardDescription className="text-gray-300">Create new admin accounts here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600/90 transition-colors flex items-center justify-center">
                  <BsPeople className="h-6 w-6 mr-2" />
                  Create New Admin
                </Button>
                <p className="text-gray-300 mt-4">(Functionality to be implemented with a future endpoint)</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models">
            <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Model Management</CardTitle>
                <CardDescription className="text-gray-300">View and manage trained models (to be implemented).</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Model management functionality will be added in future development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}