"use server";

import { ID, Models, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { fetchCurrentUser, getTotalStorageUsedByUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  const storageUsed = await getTotalStorageUsedByUser();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bytes = 500 * 1024 * 1024;

    if (storageUsed + inputFile.size > bytes) {
      throw new Error("Storage limit exceeded. Maximum allowed is 60 MB.");
    }

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to upload document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload files.");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) {
    queries.push(Query.equal("type", types));
  }
  if (searchText) {
    queries.push(Query.contains("name", searchText));
  }
  if (limit) {
    queries.push(Query.limit(limit));
  }

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit = 8,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await fetchCurrentUser();

    if (!currentUser) throw new Error("Failed to find an user.");

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    const filesStorage = files.documents.reduce((total, document) => {
      return total + (document.size || 0); // Sum the 'size' field; default to 0 if size is undefined
    }, 0);

    console.log(filesStorage);

    return parseStringify({ files, filesStorage });
  } catch (error) {
    handleError(error, "Failed to fetch files.");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
  owner,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  const currentUser = await fetchCurrentUser();

  if (currentUser.$id !== owner) {
    throw new Error("Unauthorized.");
  }

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
  owner,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  const currentUser = await fetchCurrentUser();

  if (currentUser.$id !== owner) {
    throw new Error("Unauthorized.");
  }

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
  owner,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  const currentUser = await fetchCurrentUser();

  if (currentUser.$id !== owner) {
    throw new Error("Unauthorized.");
  }

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
