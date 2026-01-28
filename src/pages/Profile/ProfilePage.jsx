import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  PencilLine,
  Save,
  LogOut,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logOut } = useAuth();

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 🔹 Fetch user profile
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          // 👇 Create empty user doc if not exists
          await setDoc(userRef, {
            name: "",
            phone: "",
            address: "",
            email: user.email,
          });
          setUserData({});
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      setUserData({ ...userData, ...formData });
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // ✅ Proper returns
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Not logged in</p>;
  }

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow rounded-xl space-y-4">
      <div className="flex items-center gap-2">
        <UserRound className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="text-gray-800 font-medium">
            {user.email}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <UserRound className="w-5 h-5 text-gray-500" />
          {editMode ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-b p-1 w-full"
              placeholder="Name"
            />
          ) : (
            <span>{userData?.name || "N/A"}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-500" />
          {editMode ? (
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border-b p-1 w-full"
              placeholder="Phone"
            />
          ) : (
            <span>{userData?.phone || "N/A"}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          {editMode ? (
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border-b p-1 w-full"
              placeholder="Address"
            />
          ) : (
            <span>{userData?.address || "N/A"}</span>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {editMode ? (
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <PencilLine className="w-4 h-4" /> Edit
          </button>
        )}

        <button
          onClick={logOut}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
