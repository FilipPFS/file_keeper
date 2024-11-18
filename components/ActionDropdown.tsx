"use client";

import { File } from "./FileCard";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails } from "./ActionModalContent";
import ShareInput from "./ShareInput";
import { useUser } from "@/context/UserContext";

type Props = {
  file: File;
};

const ActionDropdown = ({ file }: Props) => {
  const user = useUser();
  const userId = user.currentUser?.$id;
  const path = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[] | []>([]);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsLoading(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          owner: file.owner.$id,
          path,
        }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          owner: file.owner.$id,
          bucketFileId: file.bucketFileId,
          path,
        }),
      share: () =>
        updateFileUsers({
          fileId: file.$id,
          emails,
          owner: file.owner.$id,
          path,
        }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) {
      closeAllModals();
    }

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((email) => email !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      owner: file.owner.$id,
      emails: updatedEmails,
      path,
    });

    if (success) {
      setEmails(updatedEmails);
    }

    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { label, value } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              handleRemoveUser={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Etes-vous sûr de vouloir supprimer{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{label}</p>
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src={"/assets/icons/dots.svg"}
            width={33}
            height={33}
            alt="dots"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((action) => {
            const isOwner = userId === file.owner.$id;

            const canShowAction =
              isOwner || ["details", "download"].includes(action.value);

            if (!canShowAction) return null;

            return (
              <DropdownMenuItem
                key={action.value}
                className="shad-dropdown-item"
                onClick={() => {
                  setAction(action);
                  if (
                    ["rename", "share", "details", "delete"].includes(
                      action.value
                    ) &&
                    (isOwner || action.value === "details") // Allow 'details' for everyone
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {action.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={action.icon}
                      width={30}
                      height={30}
                      alt={action.label}
                    />
                    {action.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={action.icon}
                      width={30}
                      height={30}
                      alt={action.label}
                    />
                    {action.label}
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
