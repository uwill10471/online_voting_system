import React,{useEffect} from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AdminHomePage = () => {
  // Sample data for demonstration purposes
  const elections = [
    { id: 1, name: "Presidential Election", date: "2024-11-05", status: "Ongoing" },
    { id: 2, name: "Senate Election", date: "2024-10-20", status: "Upcoming" },
    { id: 3, name: "Local Election", date: "2024-12-15", status: "Completed" }
  ];

  const candidates = [
    { id: 1, name: "Candidate A", position: "President", votes: 1200 },
    { id: 2, name: "Candidate B", position: "Senator", votes: 850 },
    { id: 3, name: "Candidate C", position: "Mayor", votes: 600 }
  ];

  //pending approvals
  const pendingApprovals = [
    { id: 1, name: "Candidate D", position: "Councilor", submitted: "2024-11-01" },
    { id: 2, name: "Candidate E", position: "Governor", submitted: "2024-11-02" }
  ];
const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn)
const navigate = useNavigate()
useEffect(() => { if (!isAdminLoggedIn) { navigate('/'); } }, [isAdminLoggedIn, navigate]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Card className="mb-4">
        <Card.Header>Elections Overview</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {elections.map(election => (
                <tr key={election.id}>
                  <td>{election.id}</td>
                  <td>{election.name}</td>
                  <td>{election.date}</td>
                  <td>{election.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Candidate Votes</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.position}</td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Pending Approvals</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(approval => (
                <tr key={approval.id}>
                  <td>{approval.id}</td>
                  <td>{approval.name}</td>
                  <td>{approval.position}</td>
                  <td>{approval.submitted}</td>
                  <td>
                    <Button variant="success" className="me-2">Approve</Button>
                    <Button variant="danger">Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminHomePage;
