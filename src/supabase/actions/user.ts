import { ProfileT } from "@/types/auth/user";
import { supabase } from "../client";

export const getProfileById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, bio, created_at, updated_at, user_roles(id, role), classrooms:user_classrooms(*)",
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as ProfileT;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};
