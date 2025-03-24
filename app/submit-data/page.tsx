"use client";

import {JSX, useState} from "react";
import { BsUpload, BsShieldCheck, BsCodeSquare, BsDatabase } from "react-icons/bs";
import Link from "next/link";

// Define the Model type
interface Model {
    id: string;
    name: string;
    description: string;
    icon: JSX.Element;
}

export default function Upload() {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const models: Model[] = [
        {
            id: "model1",
            name: "Model 1: Precision Validator",
            description: "Leverages rule-based checks to ensure your data meets strict quality standards.",
            icon: <BsShieldCheck className="h-8 w-8 text-blue-400" />,
        },
        {
            id: "model2",
            name: "Model 2: Smart Enforcer",
            description: "Uses smart contracts to validate and secure your data with blockchain precision.",
            icon: <BsCodeSquare className="h-8 w-8 text-blue-400" />,
        },
        {
            id: "model3",
            name: "Model 3: Data Scaler",
            description: "Optimizes large datasets with decentralized storage and ML-driven insights.",
            icon: <BsDatabase className="h-8 w-8 text-blue-400" />,
        },
    ];

    const handleModelSelect = (modelId: string) => {
        setSelectedModel(modelId);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "text/csv") {
            setFile(droppedFile);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const isSubmitDisabled = !selectedModel || !file;

    return (
        <div className="min-h-screen bg-black py-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
                    Unleash Your <span className={"text-blue-500"}>Data’s Potential</span>
                </h1>
                <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto mb-16">
                    Select a PureChain model and upload your CSV to experience decentralized data validation like never before.
                </p>

                {/* Model Selection */}
                <section className="mb-20">
                    <h2 className="text-3xl font-semibold text-white text-center mb-8">
                        Choose Your Validation Model
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                onClick={() => handleModelSelect(model.id)}
                                className={`bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg cursor-pointer ${
                                    selectedModel === model.id
                                        ? "border-2 border-blue-600"
                                        : "hover:shadow-xl"
                                }`}
                            >
                                <div className="mb-4">{model.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{model.name}</h3>
                                <p className="text-gray-200">{model.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* File Upload */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-semibold text-white text-center mb-8">
                        Upload Your CSV Data
                    </h2>
                    <div
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg text-center"
                    >
                        <BsUpload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-200 mb-4">
                            {file ? `File: ${file.name}` : "Drag and drop your CSV here or click to select"}
                        </p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileInput}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer transition-colors"
                        >
                            Select File
                        </label>
                    </div>
                </section>

                {/* Submit Button */}
                <div className="text-center mt-12">
                    <button
                        disabled={isSubmitDisabled}
                        className={`px-8 py-4 text-lg font-medium text-white rounded-md transition-colors ${
                            isSubmitDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600"
                        }`}
                    >
                        Process Your Data
                    </button>
                    {isSubmitDisabled && (
                        <p className="text-sm text-gray-400 mt-2">
                            Please select a model and upload a CSV file to proceed.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}