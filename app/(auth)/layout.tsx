import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <div className="flex gap-4 items-center">
            <Image src={"/logo.png"} alt="logo" width={80} height={80} />
            <h1 className="text-white text-3xl font-semibold">FileKeeper</h1>
          </div>

          <div className="space-y-5 text-white">
            <h1 className="h1">Gérer vos fichiers en toute simplicité.</h1>
            <p className="body-1">
              C'est la place ou vous pouvez stocker tout vos fichiers.
            </p>
          </div>

          <Image
            src={"/assets/images/files.png"}
            alt="auth illustration"
            width={320}
            height={320}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <div className="flex gap-4 items-center">
            <Image
              src={"/assets/images/vector-logo.png"}
              alt="logo"
              width={80}
              height={80}
            />
            <h1 className="text-brand text-3xl font-semibold">FileKeeper</h1>
          </div>
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
