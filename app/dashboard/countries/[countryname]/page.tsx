import CountryDetailsClient from "@/components/custom/CountryDetailsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ countryname: string }>;
}) {
  const { countryname } = await params;

  return <CountryDetailsClient countryName={decodeURIComponent(countryname)} />;
}
