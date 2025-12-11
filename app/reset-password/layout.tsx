import React, { PropsWithChildren, Suspense } from "react";
import { Progress } from "@/components/ui/progress";


const layout = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const Loading = () => {
  return <Progress value={33} />;
};

export default layout;
