import React, { useState, useEffect } from "react";
import { Table, Button, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CallList = () => {
  const navigate = useNavigate();
  const [calls, setCalls] = useState([]);
  const [groupedCalls, setGroupedCalls] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch calls from API
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        // Get the access token from localStorage for authentication
        const accessToken = localStorage.getItem("accessToken");

        // API request to fetch call data
        const response = await fetch("https://frontend-test-api.aircall.dev/calls", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        groupCallsByDate(data.nodes);  // group the calls by date
        setCalls(data.nodes);          // set the fetched calls in state
        setLoading(false);             // set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching call data:", error);
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  // Group calls by date
  const groupCallsByDate = (data) => {
    const grouped = data.reduce((acc, call) => {
      const date = new Date(call.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(call);
      return acc;
    }, {});
    setGroupedCalls(grouped);
  };

  // Archive a call
  const archiveCall = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // API request to archive the call
      const response = await fetch(`https://frontend-test-api.aircall.dev/calls/${id}/archive`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Update the call list after archiving the call
        const updatedCalls = calls.map((call) =>
          call.id === id ? { ...call, is_archived: true } : call
        );
        setCalls(updatedCalls);
        groupCallsByDate(updatedCalls);
      } else {
        console.error("Error archiving the call");
      }
    } catch (error) {
      console.error("Error archiving call:", error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove the token
    navigate("/login"); // Redirect to the login page
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      {/* Logo at the top */}
      <img 
        src="/TT Logo.png" 
        alt="Turing Technologies Logo" 
        style={{ width: "100px", marginBottom: "20px" }} 
      />
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Turing Technologies Frontend Test</h2>
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      {/* Display grouped calls */}
      {Object.keys(groupedCalls).map((date) => (
        <div key={date} className="mb-4">
          <h5 className="mb-3">
            <Badge bg="secondary">{date}</Badge>
          </h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Call Type</th>
                <th>Direction</th>
                <th>Duration</th>
                <th>From</th>
                <th>To</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedCalls[date].map((call) => (
                <tr key={call.id}>
                  <td>{call.call_type}</td>
                  <td>{call.direction}</td>
                  <td>{call.duration} seconds</td>
                  <td>{call.from}</td>
                  <td>{call.to}</td>
                  <td>{new Date(call.created_at).toLocaleTimeString()}</td>
                  <td>
                    <Badge bg={call.is_archived ? "success" : "warning"}>
                      {call.is_archived ? "Archived" : "Active"}
                    </Badge>
                  </td>
                  <td>
                    {!call.is_archived && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => archiveCall(call.id)}
                      >
                        Archive
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
  );
};

export default CallList;
