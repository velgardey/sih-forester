'use client';

import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ContactInfo = {
    phone?: string;
    email?: string;
};

type UserForm = {
  full_name: string;
  father_name?: string;
  aadhaar_id?: string;
  govt_id?: string;
  tribal_group?: string;
  village?: string;
  district?: string;
  state?: string;
contact_info? : ContactInfo;
};

export default function NewUserPage() {
  const { register, handleSubmit } = useForm<UserForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: UserForm) => {
    try {
      setLoading(true);
      const res = await api.post("/users/", data);
      const userId = res.data.user_id;
      router.push(`/claims/new?user_id=${userId}`);
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          {...register("full_name", { required: true })}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Father's Name"
          {...register("father_name")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Aadhaar ID"
          {...register("aadhaar_id")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Govt ID"
          {...register("govt_id")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Tribal Group"
          {...register("tribal_group")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Village"
          {...register("village")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="District"
          {...register("district")}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="State"
          {...register("state")}
          className="border p-2 w-full rounded"
        />
        <input
            type="tel"
            placeholder="Phone"
            {...register("contact_info.phone")}
            className="border p-2 w-full rounded"
        />
        <input
            type="email"
            placeholder="Email"
            {...register("contact_info.email")}
            className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Next →"}
        </button>
      </form>
    </div>
  );
}
