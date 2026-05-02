export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CountriesClient from "@/components/custom/CountriesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading countries...</div>}>
      <CountriesClient />
    </Suspense>
  );
}