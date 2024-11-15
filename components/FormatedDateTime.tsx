import { cn, formatDateTime } from "@/lib/utils";
import React from "react";

type Props = {
  date: string;
  className?: string;
};

const FormatedDateTime = ({ date, className }: Props) => {
  return (
    <p className={cn("body-1 text-light-200", className)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormatedDateTime;
