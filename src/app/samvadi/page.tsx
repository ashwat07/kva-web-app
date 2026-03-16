import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samvadi | Karnataka Vishwakarma Association",
};

export default function SamvadiPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-full bg-primary/10 p-6 inline-block text-4xl">📋</div>
      <h1 className="mt-6 text-2xl font-bold text-kva-text md:text-3xl">
        <span className="text-primary">Samvadi</span>
      </h1>
      <p className="mt-2 text-kva-text-light">
        Community members directory — connect with fellow members
      </p>
      <p className="mt-8 text-lg font-medium text-primary-dark">Coming soon</p>
    </div>
  );
}
