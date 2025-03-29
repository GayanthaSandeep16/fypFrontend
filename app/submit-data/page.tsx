"use client";

import { useState } from "react";
import { BsUpload, BsShieldCheck, BsCodeSquare, BsDatabase } from "react-icons/bs";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

interface Model {
    id: string;
    name: string;
    description: string;
    note: string;
    icon: React.ReactNode;
}

export default function Upload() {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>(""); // New state for error messages
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{ message: string; ipfsHash?: string } | null>(null);

    const { user } = useUser();
    const { getToken } = useAuth();

    if (!user) {
        redirect("http://localhost:5173/sign-in");
    }

    const models: Model[] = [
        {
            id: "random-forest",
            name: "Random Forest Model",
            description: "A powerful ensemble learning model that uses multiple decision trees to make predictions. It’s great for classification and regression tasks, handling complex datasets with high accuracy.",
            note: "Best for labeled datasets with features and target variables (e.g., predicting a category or numerical value). Ensure your CSV has a target column for supervised learning.",
            icon: <BsShieldCheck className="h-8 w-8 text-blue-400" />,
        },
        {
            id: "k-means",
            name: "K-Means Clustering Model",
            description: "An unsupervised learning model that groups data into clusters based on similarity. It’s useful for discovering patterns or segments in your data without predefined labels.",
            note: "Ideal for unlabeled datasets where you want to find natural groupings (e.g., customer segmentation). Your CSV should contain numerical features without a target column.",
            icon: <BsCodeSquare className="h-8 w-8 text-blue-400" />,
        },
        {
            id: "logistic-regression",
            name: "Logistic Regression Model",
            description: "A simple yet effective model for binary classification tasks. It predicts the probability of an event occurring (e.g., yes/no, true/false) based on input features.",
            note: "Suitable for labeled datasets with binary outcomes (e.g., 0/1, yes/no). Ensure your CSV has a binary target column and relevant features.",
            icon: <BsDatabase className="h-8 w-8 text-blue-400" />,
        },
    ];

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

    const validateFile = (file: File): string | null => {
        // Check file type
        if (file.type !== "text/csv") {
            return "Please upload a valid CSV file.";
        }
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return "File size exceeds 10 MB. Please upload a smaller file.";
        }
        return null; // No errors
    };

    const handleModelSelect = (modelId: string) => setSelectedModel(modelId);

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const errorMessage = validateFile(droppedFile);
            if (errorMessage) {
                setError(errorMessage);
                setFile(null); // Clear the file if invalid
            } else {
                setError(""); // Clear any previous errors
                setFile(droppedFile);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const errorMessage = validateFile(selectedFile);
            if (errorMessage) {
                setError(errorMessage);
                setFile(null); // Clear the file if invalid
            } else {
                setError(""); // Clear any previous errors
                setFile(selectedFile);
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedModel || !file || !user) {
            setMessage("Please select a model, upload a file, and ensure you’re signed in.");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setResult(null);
        setError(""); // Clear any previous errors

        const formData = new FormData();
        formData.append("files", file);
        formData.append("clerkUserId", user.id);
        formData.append("walletAddress", user?.unsafeMetadata?.walletAddress as string);
        formData.append("modelId", selectedModel);

        try {
            const token = await getToken();
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit-data`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult({ message: response.data.message, ipfsHash: response.data.ipfsHash });
        } catch (error) {
            setResult({ message: (error as any).response?.data?.message || (error as any).message });
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = !selectedModel || !file || !user || isLoading;

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
                    Unleash Your <span className="text-blue-500">Data’s Potential</span>
                </h1>
                <section className="mb-20">
                    <h2 className="text-3xl font-semibold text-white text-center mb-8">Choose Your Preferred Model</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                onClick={() => handleModelSelect(model.id)}
                                className={`relative min-h-[210px] bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg cursor-pointer group transition-all duration-300 ${
                                    selectedModel === model.id
                                        ? "border-2 border-blue-600 scale-105"
                                        : "hover:scale-105 hover:shadow-2xl"
                                }`}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="mb-4">{model.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{model.name}</h3>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4">
                                <div className="mb-4">{model.icon}</div>
                                    <p className="text-gray-100 text-sm mb-2">{model.description}</p>
                                    <p className="text-gray-300 text-xs italic">Note: {model.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-semibold text-white text-center mb-8">Upload Your CSV Data</h2>
                    <div
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg text-center"
                    >
                        <BsUpload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-200 mb-4">{file ? `File: ${file.name}` : "Drag and drop your CSV here or click to select"}</p>
                        <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer transition-colors">
                            Select File
                        </label>
                        {/* Display error message below the upload area */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </section>
                <div className="text-center mt-12">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`px-8 py-4 text-lg font-medium text-white rounded-md transition-colors ${
                            isSubmitDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isLoading ? "Processing..." : "Process Your Data"}
                    </button>
                    {message && <p className="text-sm text-gray-400 mt-2">{message}</p>}
                </div>

                {/* Loading and Results Panel */}
                <div className="max-w-3xl mx-auto mt-8">
                    {isLoading && (
                        <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-200">Processing your data, please wait...</p>
                        </div>
                    )}
                    {result && !isLoading && (
                        <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                            <p className="text-gray-200">{result.message}</p>
                            {result.ipfsHash && (
                                <p className="text-gray-400 mt-2">IPFS Hash: <span className="text-blue-400">{result.ipfsHash}</span></p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}