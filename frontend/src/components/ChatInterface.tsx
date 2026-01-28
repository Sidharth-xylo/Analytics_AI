"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { chat, getFiles, uploadFile, connectUrl, deleteFile } from "@/lib/api";
import { Send, User, Loader2, ChevronRight, FileText, Plus, X, UploadCloud, Link as LinkIcon, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChartRenderer from "@/components/ChartRenderer";
import KPICard from "@/components/KPICard";
import DataConnect from "@/components/DataConnect";
import { cn } from "@/lib/utils";

interface Widget {
    vis_type: 'kpi' | 'chart';
    payload: any;
}

type Message = {
    role: "user" | "assistant";
    content: string;
    widgets?: Widget[];
};

interface FileItem {
    id: string;
    filename: string;
    source: string;
}

export default function ChatInterface({ isConnected = false }: { isConnected?: boolean }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataConnected, setDataConnected] = useState(isConnected);
    const [loadingText, setLoadingText] = useState("Analyzing request...");

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            const steps = ["Analyzing request...", "Querying dataset...", "Calculating insights...", "Rendering visualization..."];
            let i = 0;
            interval = setInterval(() => {
                setLoadingText(steps[i % steps.length]);
                i++;
            }, 2500);
        } else {
            setLoadingText("Analyzing request...");
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Sidebar State
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default Open for visibility
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [addTab, setAddTab] = useState<'upload' | 'url'>('upload');

    // Add Panel State
    const [urlInput, setUrlInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Fetch files on mount and when connected
    const refreshFiles = async () => {
        try {
            const list = await getFiles();
            console.log("Files fetched:", list);
            setFiles(list);

            // Auto-select logic
            if (list.length > 0) {
                if (!selectedFileId || !list.find(f => f.id === selectedFileId)) {
                    setSelectedFileId(list[list.length - 1].id); // Select newest
                }
                setDataConnected(true);
            }
        } catch (error) {
            console.error("Failed to fetch files", error);
        }
    };

    useEffect(() => {
        refreshFiles();
    }, [dataConnected]);

    const handleDataConnected = (data: any) => {
        setDataConnected(true);
        if (data?.file_id) {
            refreshFiles().then(() => {
                setSelectedFileId(data.file_id);
            });
        }
    };

    const handleAddFile = async (e?: React.FormEvent, file?: File) => {
        if (e) e.preventDefault();
        setIsAdding(true);

        try {
            let data;
            if (addTab === 'upload' && file) {
                data = await uploadFile(file);
            } else if (addTab === 'url' && urlInput) {
                // Determine if valid URL
                if (!urlInput.trim()) return;
                data = await connectUrl(urlInput);
                setUrlInput("");
            } else {
                setIsAdding(false);
                return;
            }

            if (data?.file_id) {
                // SUCCESS: Refresh list from server (Single Source of Truth)
                await refreshFiles();
                setSelectedFileId(data.file_id);
                setShowAddPanel(false);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add file: " + (error as Error).message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteFile = async (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation(); // Prevent selection
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            await deleteFile(fileId);
            const list = await getFiles();
            setFiles(list);

            // If we deleted the selected file, select another one or null
            if (selectedFileId === fileId) {
                if (list.length > 0) setSelectedFileId(list[list.length - 1].id);
                else setSelectedFileId(null);
            }
        } catch (error) {
            console.error("Failed to delete file", error);
            alert("Failed to delete file.");
        }
    };

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMessage: Message = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        setQuery("");
        setLoading(true);

        try {
            const data = await chat(userMessage.content, selectedFileId || undefined);

            let assistantMessage: Message;
            let content = "";
            let widgets: Widget[] = [];

            if (data.type === "dashboard" || data.type === "widget") {
                content = "Here is the analysis:";
                widgets = data.payload || [];
            } else if (data.type === "text") {
                content = data.payload || "Analysis complete.";
            } else {
                content = typeof data.payload === 'string' ? data.payload : JSON.stringify(data.payload);
            }

            assistantMessage = {
                role: "assistant",
                content,
                widgets
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, there was an error processing your request."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const truncateFilename = (name: string, limit: number = 12) => {
        if (!name) return "Unknown";
        if (name.length <= limit) return name;
        return name.substring(0, limit) + "...";
    };

    return (
        <div className="flex h-[600px] w-full max-w-5xl mx-auto bg-brand-panel backdrop-blur-xl rounded-[30px] border border-brand-border overflow-hidden shadow-2xl relative">

            {/* Sidebar / Document Drawer */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -250, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        className="w-64 bg-brand-card border-r border-brand-border h-full flex flex-col shadow-xl z-20 absolute md:relative"
                    >
                        <div className="p-4 border-b border-brand-border flex items-center justify-between">
                            <h3 className="font-semibold text-brand-text-primary text-sm">Documents</h3>
                            <Button onClick={() => setSidebarOpen(false)} className="md:hidden h-8 w-8 bg-transparent hover:bg-white/10 p-0 text-white">
                                <ChevronRight className="rotate-180 w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {files.length === 0 && (
                                <div className="text-center p-4 text-xs text-brand-text-muted opacity-60">
                                    No documents yet.
                                </div>
                            )}
                            {files.map(file => (
                                <button
                                    key={file.id}
                                    onClick={() => setSelectedFileId(file.id)}
                                    title={file.filename}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all text-left group",
                                        selectedFileId === file.id
                                            ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30 font-medium"
                                            : "hover:bg-brand-deep/50 text-brand-text-secondary"
                                    )}
                                >
                                    {file.source === 'url' ? <LinkIcon className="w-4 h-4 flex-shrink-0 opacity-70" /> : <FileText className="w-4 h-4 flex-shrink-0 opacity-70" />}
                                    <span className="truncate flex-1">{truncateFilename(file.filename)}</span>
                                    {selectedFileId === file.id && <CheckCircle2 className="w-3 h-3 text-brand-primary" />}

                                    <div
                                        role="button"
                                        onClick={(e) => handleDeleteFile(e, file.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Add File Section at Bottom */}
                        <div className="p-3 bg-brand-deep/30 border-t border-brand-border">
                            {!showAddPanel ? (
                                <Button
                                    onClick={() => setShowAddPanel(true)}
                                    className="w-full bg-brand-card hover:bg-brand-deep border border-brand-border text-brand-text-secondary flex items-center justify-center gap-2 h-9 text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Add File
                                </Button>
                            ) : (
                                <div className="bg-brand-card rounded-xl p-3 border border-brand-border shadow-lg animate-in slide-in-from-bottom-2 fade-in">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setAddTab('upload')}
                                                className={cn("text-xs pb-1 border-b-2 transition-colors", addTab === 'upload' ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-text-muted hover:text-brand-text-primary")}
                                            >
                                                Upload
                                            </button>
                                            <button
                                                onClick={() => setAddTab('url')}
                                                className={cn("text-xs pb-1 border-b-2 transition-colors", addTab === 'url' ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-text-muted hover:text-brand-text-primary")}
                                            >
                                                URL
                                            </button>
                                        </div>
                                        <button onClick={() => setShowAddPanel(false)} className="text-brand-text-muted hover:text-red-400">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {addTab === 'upload' ? (
                                        <div className="relative group cursor-pointer border-2 border-dashed border-brand-border hover:border-brand-primary/50 rounded-lg p-4 text-center transition-all bg-brand-deep/20">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) handleAddFile(undefined, e.target.files[0]);
                                                }}
                                                disabled={isAdding}
                                            />
                                            {isAdding ? (
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-primary" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <UploadCloud className="w-5 h-5 text-brand-text-muted" />
                                                    <span className="text-[10px] text-brand-text-muted">Click to browse</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                placeholder="Google Sheet URL..."
                                                className="h-8 text-xs bg-white border-brand-border text-black rounded-md placeholder:text-gray-400"
                                            />
                                            <Button
                                                onClick={(e) => handleAddFile(e)}
                                                disabled={!urlInput || isAdding}
                                                className="h-7 text-xs bg-brand-primary hover:bg-brand-primary/90 w-full"
                                            >
                                                {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : "Connect"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 h-full relative z-10 bg-brand-deep/30">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-brand-text-secondary space-y-8">
                            <div className="text-center">
                                <div className="w-24 h-24 relative mx-auto mb-6">
                                    <Image src="/mascot.png" alt="Mascot" fill className="object-contain" />
                                </div>
                                <p className="text-2xl font-semibold text-brand-text-primary">Ready to analyze your data.</p>

                                <div className="mt-4">
                                    {selectedFileId ? (
                                        <span className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                                            Current: {files.find(f => f.id === selectedFileId)?.filename}
                                        </span>
                                    ) : (
                                        <p className="text-sm text-brand-text-muted">
                                            👈 Select or Add a file to start chatting
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-12 h-12 relative mt-1 flex-shrink-0">
                                        <Image src="/mascot.png" alt="Mascot" fill className="object-contain" />
                                    </div>
                                )}

                                <div
                                    className={`w-full max-w-[95%] md:max-w-[85%] rounded-[24px] p-4 md:p-6 shadow-sm transition-all overflow-hidden ${msg.role === "user"
                                        ? "bg-brand-primary/10 text-brand-primary rounded-tr-sm font-medium border border-brand-primary/20"
                                        : "bg-white/80 text-gray-700 rounded-tl-sm border border-white/50 shadow-md backdrop-blur-md"
                                        }`}
                                >
                                    {msg.content && <p className="whitespace-pre-wrap mb-4">{msg.content}</p>}

                                    {msg.widgets && msg.widgets.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 w-full">
                                            {msg.widgets.map((widget: Widget, idx: number) => {
                                                if (widget.vis_type === 'kpi') {
                                                    return (
                                                        <div key={idx} className="col-span-1">
                                                            <KPICard data={widget.payload} />
                                                        </div>
                                                    );
                                                } else if (widget.vis_type === 'chart') {
                                                    return (
                                                        <div key={idx} className="col-span-1 md:col-span-2 w-full h-96">
                                                            <ChartRenderer data={widget.payload} />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                {
                                    msg.role === "user" && (
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center mt-1 shadow-sm border border-brand-primary/30 flex-shrink-0">
                                            <User className="w-6 h-6 text-brand-deepTeal" />
                                        </div>
                                    )
                                }
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-brand-text-muted ml-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-brand-deepTeal" />
                            </div>
                            <span className="text-sm font-medium min-w-[120px]">{loadingText}</span>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-brand-panel/60 border-t border-brand-border backdrop-blur-md">
                    <div className="flex gap-2 items-center">
                        <Button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn("bg-transparent hover:bg-white/10 text-brand-text-muted p-2 h-10 w-10 transition-transform", sidebarOpen ? "rotate-180" : "")}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={selectedFileId ? "Ask questions about this file..." : "Select or upload a file first"}
                            disabled={!selectedFileId}
                            className="flex-1 bg-brand-deep border-brand-border focus-visible:ring-brand-primary text-brand-text-primary placeholder:text-brand-text-muted rounded-xl shadow-sm"
                        />
                        <Button onClick={handleSend} disabled={loading || !query.trim()} className="bg-brand-primary hover:bg-brand-primarySoft text-brand-text-primary font-semibold rounded-xl transition-all shadow-sm hover:shadow-md h-10 px-4">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
