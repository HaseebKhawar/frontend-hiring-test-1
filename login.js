import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API request to authenticate the user
      const response = await fetch("https://frontend-test-api.aircall.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the access token in localStorage
        localStorage.setItem("accessToken", data.access_token);
        // Redirect to the Call List page
        navigate("/calls");
      } else {
        setError(data.message || "Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      {/* Logo at the top */}
      <img 
        src="/TT Logo.png" 
        alt="Turing Technologies Logo" 
        style={{ width: "100px", marginBottom: "20px" }} 
      />
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Login Button: Blue */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
