import { getTotalStorageUsedByUser } from "@/lib/actions/user.actions";
import { convertFileSize } from "@/lib/utils";
import Image from "next/image";

export default async function Home() {
  const storage = await getTotalStorageUsedByUser();

  console.log(storage);

  return (
    <div className="">
      <h1 className="text-3xl text-brand">File Kepper</h1>
      <p>{convertFileSize(storage)} utilisés sur 60MB.</p>
    </div>
  );
}
