import React, { Suspense } from "react";
import CountryTable from "@/components/custom/CountryTable";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="mt-10">Loading table...</div>}>
        <CountryTable />
      </Suspense>
    </div>
  );
};

export default page;
