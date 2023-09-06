import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login } = useToken();
  const navigate = useNavigate();
  const [hasChanged, setHasChanged] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setLoginSuccess(true);
      setHasChanged(!hasChanged);
      // navigate("/workout/list");
    } catch (error) {
      console.error("Login failed:", error);
    }
    e.target.reset();
  };

  return (
    <>
      {loginSuccess ? (
        <div className="card text-bg-light mb-3">
          <h2 className="card-header">Login</h2>
          <div className="card-body">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card text-bg-light mb-3">
          <h2 className="card-header">Login</h2>
          <div className="card-body">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
            <p>Logged In: {String(loginSuccess)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
