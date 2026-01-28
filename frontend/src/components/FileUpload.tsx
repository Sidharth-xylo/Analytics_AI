"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function FileUpload({ onUploadComplete }: { onUploadComplete: (data: any) => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                const data = await uploadFile(file);
                setSuccess(true);
                onUploadComplete(data);
            } catch (err: any) {
                setError("Failed to upload file. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-blue-500 transition-colors w-full max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="mb-4 bg-blue-500/10 p-4 rounded-full">
                    {loading ? (
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    ) : success ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : error ? (
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    ) : (
                        <Upload className="w-8 h-8 text-blue-400" />
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">Upload Data</h3>
                <p className="text-gray-400 mb-6 text-sm">
                    Drag & drop or click to upload CSV/Excel
                </p>

                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Browse Files
                    <input
                        type="file"
                        className="hidden"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </label>

                {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
                {success && <p className="mt-4 text-green-400 text-sm">Upload Successful!</p>}
            </motion.div>
        </Card>
    );
}
