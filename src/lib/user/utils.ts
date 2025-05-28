import axios from "axios";
import toast from "react-hot-toast";


export async function getUsersInCompany() {
  const {data} = await axios.get("/api/users/users-in-company");
  if (!data || data.error) {
    console.error("Error fetching users in company:", data.error);
    toast.error("Error fetching users in company!");
    return null;
  }

  return data;
}