"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { File } from "./FileCard";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormatedDateTime from "./FormatedDateTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchString = searchParams.get("query") || "";
  const [results, setResults] = useState<File[] | []>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);

        return router.push(path.replace(searchString, ""));
      }
      const res = await getFiles({ searchText: debouncedQuery });

      setResults(res.files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchString) {
      setQuery("");
    }
  }, [searchString]);

  const handleClick = (file: File) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + "s"
      }?query=${query}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src={"/assets/icons/search.svg"}
          width={24}
          height={24}
          alt="search icon"
        />

        <Input
          value={query}
          placeholder="Rechercher..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClick(file)}
                >
                  <div className="flex cursor-pointer gap-4 items-center">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormatedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">Aucun fichier trouvé.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
