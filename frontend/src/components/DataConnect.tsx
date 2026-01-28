"use client";

import { useState } from "react";
import { uploadFile, connectUrl } from "@/lib/api";
import { Upload, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DataConnect({ onConnect }: { onConnect: (data: any) => void }) {
    const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [url, setInputUrl] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                const data = await uploadFile(file);
                setSuccess("File uploaded successfully");
                onConnect(data);
            } catch (err: any) {
                setError("Failed to upload file. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUrlConnect = async () => {
        if (!url.trim()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await connectUrl(url);
            setSuccess("Connected to Google Sheet successfully");
            onConnect(data);
        } catch (err: any) {
            setError("Failed to connect to sheet. Check permissions/link.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-brand-card/40 backdrop-blur-xl rounded-[24px] shadow-2xl border border-brand-border p-6 md:p-8">
            {/* Simple Top Navigation */}
            <div className="flex justify-center gap-6 mb-8">
                <button
                    onClick={() => setActiveTab('file')}
                    className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'file'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-800 hover:text-black'
                        }`}
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    Upload File
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'url'
                        ? 'border-brand-secondary text-brand-secondary'
                        : 'border-transparent text-gray-800 hover:text-black'
                        }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    Google Sheets
                </button>
            </div>

            <div className="min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {activeTab === 'file' ? (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center text-center w-full"
                        >
                            <label className="w-full h-48 border-2 border-dashed border-brand-border hover:border-brand-primary/50 bg-brand-panel/50 hover:bg-brand-panel rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group">
                                <div className="mb-3 bg-white shadow-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-brand-primary" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-black">Click to Upload</h3>
                                <p className="text-xs text-brand-text-muted mt-1">CSV or Excel (max 10MB)</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="url"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center text-center w-full"
                        >
                            <div className="w-full flex flex-col gap-4">


                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste Google Sheet URL here..."
                                        className="h-11 bg-brand-panel border-brand-border text-black rounded-xl"
                                        value={url}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleUrlConnect}
                                        disabled={loading || !url}
                                        className="h-11 px-6 bg-brand-secondary hover:bg-brand-secondarySoft text-white font-semibold rounded-xl shadow-lg shadow-indigo-200"
                                    >
                                        Connect
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center justify-center gap-2 text-rose-500 text-sm bg-rose-50 p-3 rounded-xl border border-rose-100 font-medium w-full">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center justify-center gap-2 text-brand-primary text-sm bg-blue-50 p-3 rounded-xl border border-blue-100 font-medium w-full">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
