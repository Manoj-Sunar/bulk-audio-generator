"use client";

import {
    Archive,
    CheckCircle2,
    Download,
    Loader2,
    Play,
    Square,
    Trash2,
    XCircle,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Button } from "../../ui/Button";

export interface GeneratedAudioFile {
    id: string;
    fileName: string;
    duration?: string;
    status: "success" | "processing" | "failed";
    audioUrl?: string;
}

interface GeneratedFilesTableProps {
    files: GeneratedAudioFile[];
    onPlay?: (file: GeneratedAudioFile) => void;
    onDownload?: (file: GeneratedAudioFile) => void;
    onDelete?: (file: GeneratedAudioFile) => void;
}

const statusStyles = {
    success:
        "bg-green-100 text-green-700 border-green-200",

    processing:
        "bg-primary-fixed text-primary border-primary/20 animate-pulse",

    failed:
        "bg-error-container text-error border-error/20",
};

const statusLabel = {
    success: "SUCCESS",
    processing: "GENERATING",
    failed: "FAILED",
};

export const GeneratedFilesTable = ({
    files,
    onPlay,
    onDownload,
    onDelete,
}: GeneratedFilesTableProps) => {
    return (
        <Card className="overflow-hidden rounded-xl border-gray-100 bg-white shadow-xs">

            {/* Header */}


            <div className="flex flex-col gap-4 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <Heading
                        as="h2"
                        size="xl"
                        weight="bold"
                    >
                        Generated Files
                    </Heading>

                    <p className="mt-1 text-sm text-on-surface-variant">
                        {files.filter((f) => f.status === "success").length} of {files.length} files are ready to download.
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <span className="rounded-full bg-primary-fixed px-3 py-1 text-sm font-semibold text-primary">
                        {files.length} Files
                    </span>

                    <Button
                        leftIcon={<Archive size={18} />}
                        disabled={!files.some((f) => f.status === "success")}
                        onClick={() => {
                            // Backend API
                            // GET /download/zip
                        }}
                    >
                        Download ZIP
                    </Button>

                </div>

            </div>

            <CardContent className="p-0">

                {files.length === 0 ? (
                    <div className="flex h-64 items-center justify-center text-on-surface-variant">
                        No generated files yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-surface-container">

                                <tr className="border-b border-outline-variant">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Preview
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Filename
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Duration
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {files.map((file) => (

                                    <tr
                                        key={file.id}
                                        className="border-b border-outline-variant transition-colors hover:bg-surface-container-low"
                                    >

                                        {/* Preview */}

                                        <td className="px-6 py-4">

                                            {file.status === "processing" ? (

                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container">

                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin text-primary"
                                                    />

                                                </div>

                                            ) : (

                                                <button
                                                    onClick={() => onPlay?.(file)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white"
                                                >

                                                    <Play
                                                        size={18}
                                                        className="ml-0.5"
                                                        fill="currentColor"
                                                    />

                                                </button>

                                            )}

                                        </td>

                                        {/* Name */}

                                        <td className="px-6 py-4">

                                            <p className="font-medium text-on-surface">
                                                {file.fileName}
                                            </p>

                                        </td>

                                        {/* Duration */}

                                        <td className="px-6 py-4 text-on-surface-variant">

                                            {file.duration ?? "--"}

                                        </td>

                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[file.status]}`}
                                            >

                                                {file.status === "success" && (
                                                    <CheckCircle2 size={14} />
                                                )}

                                                {file.status === "processing" && (
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                    />
                                                )}

                                                {file.status === "failed" && (
                                                    <XCircle size={14} />
                                                )}

                                                {statusLabel[file.status]}

                                            </span>

                                        </td>

                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    leftIcon={<Download size={18} />}
                                                    disabled={file.status !== "success"}
                                                    onClick={() => onDownload?.(file)}
                                                >
                                                    <Download size={18} />
                                                </Button>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    disabled={file.status === "processing"}
                                                    onClick={() => onDelete?.(file)}
                                                    leftIcon={<Trash2 size={18} />}
                                                >
                                                    {file.status === "processing" ? (
                                                        <Square size={18} />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </Button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </CardContent>

        </Card>
    );
};