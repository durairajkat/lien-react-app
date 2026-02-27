import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Upload } from "lucide-react";
import PdfThumbnail from "../../../utils/PdfThumbnail";
import { useState } from "react";
import { MAX_FILE_SIZE } from "../../../types/contact";
import Swal from "sweetalert2";
import { useUploadDocumentMutation } from "../../../features/document/DocumentApi";

type AddDocumentModalProps = {
    show: boolean;
    onClose: () => void;
    projectId?: number | null;
    projects?: { id: number; name: string }[];
}

const AddDocumentModal = ({ show, onClose, projectId, projects = [] }: AddDocumentModalProps) => {

    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [data, setData] = useState<File[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId || null);

    const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

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
            setData((prev) => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        setData((prev) => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async () => {
        // Implement file upload logic here (e.g., send to backend)
        console.log("Files to upload:", data);
        if (!selectedProjectId) {
            Swal.fire("Error", "Project ID missing", "error");
            return;
        }

        if (data.length === 0) {
            Swal.fire("Error", "Please select files", "error");
            return;
        }
        try {

            await uploadDocument({
                projectId: selectedProjectId,
                files: data,
            }).unwrap();

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Documents uploaded successfully",
                timer: 1500,
                showConfirmButton: false,
            });

            setData([]);
            onClose();

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Upload failed",
            });

        }
        
    }

    console.log("Selected Project ID:", selectedProjectId, data.length, isLoading);

    return (
        <Dialog
            open={show}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >

            {/* Title */}
            <DialogTitle>
                Add Document

                <IconButton onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8
                    }}
                >
                    X
                </IconButton>

            </DialogTitle>


            {/* Content */}
            <DialogContent>
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    {projects?.length > 0 && (
                    <div className="mb-6">
                        <label htmlFor="project-select" className="block text-sm font-medium text-slate-700 mb-2">
                            Select Project *
                        </label>
                        <select
                            value={selectedProjectId ?? "0"}
                            onChange={(e) =>
                                setSelectedProjectId(
                                    e.target.value === "0"
                                        ? null
                                        : Number(e.target.value)
                                )
                            }
                            className="pl-10 pr-8 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        >
                            <option value="0">All Projects</option>

                            {projects?.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    )}
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
                                        className="absolute top-2 right-2 bg-black/10    p-[5px]    rounded    text-[12px]    text-gray-700
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
            </DialogContent>
            <DialogActions>

                <button
                    onClick={onClose}
                    className="px-6 py-1 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || data.length === 0 || !selectedProjectId}
                    className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                    Save
                </button>

            </DialogActions>
        </Dialog>
    )
}

export default AddDocumentModal