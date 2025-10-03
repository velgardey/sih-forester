"use client";

import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ClaimForm = {
  right_type: string;
  claim_status: string;
  document: FileList;
};

export default function NewClaimPage() {
  const { register, handleSubmit } = useForm<ClaimForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const claimantId = params.get("claimant_id");

  const onSubmit = async (data: ClaimForm) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("claimant_id", claimantId || "");
      formData.append("right_type", data.right_type);
      formData.append("claim_status", data.claim_status);
      if (data.document?.[0]) {
        formData.append("document", data.document[0]);
      }

      await api.post("/claims/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Claim created successfully!");
      router.push("/"); // go back home or claims list
    } catch (err) {
      console.error(err);
      alert("Error creating claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">New Claim</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register("right_type")} className="border p-2 w-full rounded">
          <option value="IFR">IFR</option>
          <option value="CR">CR</option>
          <option value="CFR">CFR</option>
        </select>

        <select {...register("claim_status")} className="border p-2 w-full rounded">
          <option value="PENDING">Pending</option>
          <option value="GRANTED">Granted</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="file"
          {...register("document")}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
