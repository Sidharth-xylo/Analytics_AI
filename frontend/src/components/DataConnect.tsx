"use client";

import { useState } from "react";
import { uploadFile, connectUrl } from "@/lib/api";
import { Upload, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, FileSpreadsheet, Sparkles } from "lucide-react";
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
        <div className="w-full max-w-2xl mx-auto">
            {/* Main Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-card-hover border border-slate-200/60 overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Connect Your Data</h2>
                    </div>
                    <p className="text-sm text-slate-600 ml-13">Upload a file or connect to Google Sheets to get started</p>
                </div>

                {/* Tab Switcher */}
                <div className="px-8 pt-6 pb-4">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setActiveTab('file')}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'file'
                                ? 'bg-white text-brand-primary shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('url')}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'url'
                                ? 'bg-white text-brand-secondary shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            Google Sheets
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-8 pb-8 min-h-[280px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {activeTab === 'file' ? (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                <label className="group block w-full h-56 border-2 border-dashed border-slate-200 hover:border-brand-primary/50 bg-slate-50/50 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden">
                                    {/* Gradient Accent on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
                                        <div className="mb-4 w-16 h-16 rounded-2xl bg-gradient-ai flex items-center justify-center group-hover:scale-110 transition-transform shadow-premium">
                                            {loading ? (
                                                <Loader2 className="w-7 h-7 text-white animate-spin" />
                                            ) : (
                                                <Upload className="w-7 h-7 text-white" />
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                            {loading ? 'Uploading...' : 'Drop your file here'}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-3">or click to browse</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            CSV, XLS, XLSX • Max 10MB
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".csv, .xlsx, .xls"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </label>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="url"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Google Sheets URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            placeholder="https://docs.google.com/spreadsheets/d/..."
                                            className="h-12 pl-12 pr-4 bg-slate-50 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all"
                                            value={url}
                                            onChange={(e) => setInputUrl(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Make sure the sheet is publicly accessible or shared with view permissions
                                    </p>
                                </div>

                                <Button
                                    onClick={handleUrlConnect}
                                    disabled={loading || !url}
                                    className="w-full h-12 bg-gradient-secondary hover:opacity-90 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="w-4 h-4" />
                                            Connect Sheet
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Messages */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-4 rounded-xl border border-rose-100"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">{error}</span>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-100"
                        >
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">{success}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-slate-500 mt-4">
                Your data is processed securely and never stored permanently
            </p>
        </div>
    );
}
