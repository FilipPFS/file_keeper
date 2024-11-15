import React from "react";
import { File } from "./FileCard";
import Thumbnail from "./Thumbnail";
import FormatedDateTime from "./FormatedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";

export const ImageThumbnail = ({ file }: { file: File }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormatedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: File }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <DetailRow label="Format:" value={file.extension} />
      <DetailRow label="Taille:" value={convertFileSize(file.size)} />
      <DetailRow label="Propriétaire:" value={file.owner.fullName} />
      <DetailRow label="Modifié le:" value={formatDateTime(file.$updatedAt)} />
    </>
  );
};
