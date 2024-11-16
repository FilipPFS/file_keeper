import React, { Dispatch, SetStateAction } from "react";
import { File } from "./FileCard";
import { ImageThumbnail } from "./ActionModalContent";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

type Props = {
  file: File;
  onInputChange: Dispatch<SetStateAction<[] | string[]>>;
  handleRemoveUser: (email: string) => void;
};

const ShareInput = ({ file, onInputChange, handleRemoveUser }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Partager le fichiers avec d'autres utilisateurs.
        </p>
        <Input
          type="email"
          placeholder="Entrer l'adresse mail"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Partagé avec</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} utilisateurs
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button onClick={() => handleRemoveUser(email)}>
                  <Image
                    src={"/assets/icons/remove.svg"}
                    width={24}
                    height={24}
                    alt="remove"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ShareInput;
