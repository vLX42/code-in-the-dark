import { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { useEntryStore } from "../hooks/useEntryStore";
import { eventId } from "../config/event";
import { apiFetch } from "../lib/apiFetch";
import { useEffect } from "react";

interface FormData {
  handle: string;
  fullName: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { entry, updateEntry, updateIsLoading } = useEntryStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      handle: entry?.handle || "",
      fullName: entry?.fullName || "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    updateIsLoading(true);
    updateEntry({ handle: data.handle, fullName: data.fullName });

    try {
      const response = await apiFetch("entry", {
        handle: data.handle,
        fullName: data.fullName,
        eventId: eventId,
      });
      const { id } = await response.json();
      updateEntry({ id });
      router.push("/editor");
    } catch (error) {
      console.error("Failed to submit entry:", error);
      // Handle error appropriately
    } finally {
      updateIsLoading(false);
    }
  };

  useEffect(() => {
    if (entry?.id) {
      router.push("/editor");
    }
  }, [entry?.id, router]);

  useEffect(() => {
    reset({
      handle: entry?.handle || "",
      fullName: entry?.fullName || "",
    });
  }, [entry, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Welcome!</h1>
      <h3>Please state your handle and your name</h3>
      <input
        type="text"
        placeholder="Handle"
        {...register("handle", {
          required: "Handle is required",
          minLength: {
            value: 3,
            message: "Handle must be at least 3 characters",
          },
          maxLength: {
            value: 15,
            message: "Handle must be at most 15 characters",
          },
        })}
      />
      {errors.handle && <p>{errors.handle.message}</p>}
      <input
        type="text"
        placeholder="Full name"
        {...register("fullName", {
          required: "Full name is required",
          minLength: {
            value: 5,
            message: "Full name must be at least 5 characters",
          },
          maxLength: {
            value: 80,
            message: "Full name must be at most 80 characters",
          },
        })}
      />
      {errors.fullName && <p>{errors.fullName.message}</p>}
      <input type="submit" className="button" />
    </form>
  );
};

export default Home;
