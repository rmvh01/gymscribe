import useToken from "@galvanize-inc/jwtdown-for-react";

const useLogout = () => {
  const { token } = useToken();

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/token`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Successfully logged out");
      } else {
        console.log("Failed to logout");
      }
    } catch (error) {
      console.error("There was an error logging out", error);
    }
  };

  return logout;
};

export default useLogout;
