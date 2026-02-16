import { ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import PdfThumbnail from '../../../utils/PdfThumbnail';
import { MAX_FILE_SIZE } from '../../../types/contact';
import Swal from 'sweetalert2';

interface DocumentsStepProps {
    readonly data: File[];
    readonly onUpdate: React.Dispatch<React.SetStateAction<File[]>>;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function DocumentsStep({ data, onUpdate, onNext, onBack, onSaveAndExit }: DocumentsStepProps) {
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validFiles: File[] = [];
        const invalidFiles: string[] = [];

        files.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {

             Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: `These files exceed 10MB:\n\n${invalidFiles.join("\n")}`,
                        });
        }
        if (validFiles.length > 0) {
            onUpdate((prev) => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        onUpdate((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePreview = (file: File) => {
        const isImage = file.type.startsWith("image");
        const isPdf = file.type.includes("pdf");

        if (isImage || isPdf) {
            setPreviewFile(file);
        } else {
            // Force download
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto p-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Upload Documents</h1>
                <p className="text-lg text-slate-600">
                    Add contracts, invoices, change orders, and other relevant documents for this project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Click to upload or drag and drop
                        </h3>
                        <p className="text-sm text-slate-600">
                            PDF, Word, Excel, or Image files (up to 10MB each)
                        </p>
                    </label>
                </div>

                {/* Attachment Grid */}
                <div className='flex flex-wrap gap-4 mt-4'>

                    {data?.map((file, index) => {
                        if (!file) {
                            return;
                        }
                        const isImage = file.type.startsWith("image");
                        const isPdf = file.type.includes("pdf");

                        return (
                            <div key={index} className="relative border rounded-lg p-2 shadow bg-white w-[150px]" >
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-black/10
    p-[5px]
    rounded
    text-[12px]
    text-gray-700
    transition-all duration-10
    hover:bg-red-500
    hover:text-white
  "
                                >
                                    ✕
                                </button>

                                <div onClick={() => handlePreview(file)} className="cursor-pointer">
                                    {isImage && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="thumb"
                                            className="h-24 w-full object-cover rounded"
                                        />
                                    )}

                                    {isPdf && <PdfThumbnail file={file} />}

                                    {!isImage && !isPdf && (
                                        <div className="h-24 flex items-center justify-center text-4xl">
                                            📎
                                        </div>
                                    )}

                                    <div className="mt-2 text-sm">
                                        <p className="truncate font-medium">{file.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


                {/* Preview Modal */}
                {previewFile && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded w-3/4 h-3/4 relative">
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="absolute top-2 right-2 text-red-500"
                            >
                                Close
                            </button>

                            {/* Preview Content */}
                            {previewFile.type.startsWith("image") ? (
                                <img
                                    src={URL.createObjectURL(previewFile)}
                                    alt="preview"
                                    className="max-h-full mx-auto"
                                />
                            ) : (
                                <iframe
                                    src={URL.createObjectURL(previewFile)}
                                    title="preview"
                                    className="w-full h-full"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Recommended Documents</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Contract or Purchase Order</li>
                        <li>• Preliminary Notice (if already sent)</li>
                        <li>• Invoices and Payment Applications</li>
                        <li>• Change Orders or Amendments</li>
                        <li>• Proof of Delivery or Work Performed</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex gap-3">
                    {onSaveAndExit && (
                        <button
                            onClick={onSaveAndExit}
                            className="px-6 py-3 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Save & Exit to Dashboard
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
