import FileCard, { File } from "@/components/FileCard";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";

const Type = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params).type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const result = await getFiles({ types, searchText, sort });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type === "others" ? "Autres" : type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total:{" "}
            <span className="h5">{convertFileSize(result.filesStorage)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Triez par: </p>
            <Sort />
          </div>
        </div>
      </section>

      {result.files.documents.length > 0 ? (
        <section className="file-list">
          {result.files.documents.map((file: File) => (
            <FileCard key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p>Aucun fichier.</p>
      )}
    </div>
  );
};

export default Type;
