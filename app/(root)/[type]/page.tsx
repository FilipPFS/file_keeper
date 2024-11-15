import FileCard, { File } from "@/components/FileCard";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import React from "react";

const Type = async ({ params }: SearchParamProps) => {
  const type = ((await params).type as string) || "";

  const files = await getFiles();

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type === "others" ? "Autres" : type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MO</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Triez par: </p>
            <Sort />
          </div>
        </div>
      </section>

      {files.documents.length > 0 ? (
        <section className="file-list">
          {files.documents.map((file: File) => (
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
