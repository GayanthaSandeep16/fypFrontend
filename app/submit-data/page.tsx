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
    icon: JSX.Element;
}

export default function Upload() {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state
    const [result, setResult] = useState<{ message: string; ipfsHash?: string } | null>(null); // Added result state

    const { user } = useUser();
    const { getToken } = useAuth();

    if (!user) {
        redirect("http://localhost:5173/sign-in");
    }

    const models: Model[] = [
        { id: "model1", name: "Model 1: Precision Validator", description: "...", icon: <BsShieldCheck className="h-8 w-8 text-blue-400" /> },
        { id: "model2", name: "Model 2: Smart Enforcer", description: "...", icon: <BsCodeSquare className="h-8 w-8 text-blue-400" /> },
        { id: "model3", name: "Model 3: Data Scaler", description: "...", icon: <BsDatabase className="h-8 w-8 text-blue-400" /> },
    ];

    const handleModelSelect = (modelId: string) => setSelectedModel(modelId);
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "text/csv") setFile(droppedFile);
        else alert("Please upload a valid CSV file.");
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "text/csv") setFile(selectedFile);
        else alert("Please upload a valid CSV file.");
    };

    const handleSubmit = async () => {
        if (!selectedModel || !file || !user) {
            setMessage("Please select a model, upload a file, and ensure you’re signed in.");
            return;
        }

        setIsLoading(true); // Start loading
        setMessage(""); // Clear previous message
        setResult(null); // Clear previous result

        const formData = new FormData();
        formData.append("files", file);
        formData.append("clerkUserId", user.id);
        formData.append("walletAddress", user?.unsafeMetadata?.walletAddress || "0x59C6D89CF29B4Be21AB08b62C1db4694A77B6f0f");
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
            setResult({ message: error.response?.data?.message || error.message });
        } finally {
            setIsLoading(false); // Stop loading
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
                    <h2 className="text-3xl font-semibold text-white text-center mb-8">Choose Your Validation Model</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                onClick={() => handleModelSelect(model.id)}
                                className={`bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg cursor-pointer ${
                                    selectedModel === model.id ? "border-2 border-blue-600" : "hover:shadow-xl"
                                }`}
                            >
                                <div className="mb-4">{model.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{model.name}</h3>
                                <p className="text-gray-200">{model.description}</p>
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