import Link from "next/link";

import ActionDropdown from "@/components/ActionDropdown";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "@/components/Thumbnail";
import { type File } from "@/components/FileCard";
import { Chart } from "@/components/Chart";
import FormatedDateTime from "@/components/FormatedDateTime";
import { getTotalStorageUsedByUser } from "@/lib/actions/user.actions";

const Dashboard = async () => {
  const result = await getFiles({ types: [], limit: 10 });

  return (
    <div className="flex flex-col gap-10">
      <section>
        <Chart />
      </section>
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Fichiers ajoutés recemment</h2>
        {result.files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {result.files.documents.map((file: File) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormatedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
