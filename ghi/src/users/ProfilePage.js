import React, { useEffect, useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { token } = useToken();

  const id = token?.user?.id;

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
      } else {
        console.log("Error fetching profile:", response.status);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <div className="card">
      <h2>Profile</h2>
      <div>
        <img
          src="/Generic-Profile.png"
          alt="Generic Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <div>
            <strong>Username:</strong> {username}
          </div>
          <div>
            <strong>Email:</strong> {email}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
