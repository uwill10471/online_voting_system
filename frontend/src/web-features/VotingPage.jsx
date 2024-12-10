import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../axios';
import LinearProgress from '../Loaders/LinearProgress';
import { useParams } from 'react-router-dom';

// const candidates = [
//   { id: 1, username: 'user1', party: 'Party A', candidateName: 'Candidate 1', voterID: '12345', gender: 'Male', photo: 'https://via.placeholder.com/150' },
//   { id: 2, username: 'user2', party: 'Party B', candidateName: 'Candidate 2', voterID: '12346', gender: 'Female', photo: 'https://via.placeholder.com/150' },
//   { id: 3, username: 'user3', party: 'Party C', candidateName: 'Candidate 3', voterID: '12347', gender: 'Non-binary', photo: 'https://via.placeholder.com/150' }
// ];

const VotingPage = () => {
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { username } = useParams();

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/candidate/approved', { username }, { withCredentials: true });
        
        setCandidates(response.data);
      } catch (error) {
        console.error("Error in Fetching Candidates in VotingPage:", error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [username]);

  const handleVote = async (id) => {
    setVotedCandidateId(id);
    setLoading(true);
    try {
      const response = await axios.post('/api/vote', { username, candidateId: id });
      setMessage(response.data);
      
      
    } catch (error) {
      console.error("Error in VotingPage:", error);
      setMessage("Error in VotingPage: " + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <div className="container my-5">
      <h1 className="text-3xl font-bold mb-5">Vote for Your Favorite Candidate</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Photo</th>
            <th scope="col">Candidate Name</th>
            <th scope="col">Party</th>
            <th scope="col">Vote</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate._id}>
              <th scope="row">{index + 1}</th>
              <td><img src={candidate.photo} alt={`${candidate.candidateName}'s photo`} width="50" height="50" /></td>
              <td>{candidate.candidateName}</td>
              <td>{candidate.party}</td>
              <td>
                <button
                  onClick={() => handleVote(candidate._id)}
                  className={`btn ${votedCandidateId === candidate._id ? 'btn-success' : 'btn-primary'} ${votedCandidateId !== null && votedCandidateId !== candidate._id ? 'disabled' : ''}`}
                  disabled={votedCandidateId !== null && votedCandidateId !== candidate._id}
                >
                  {votedCandidateId === candidate._id ? 'Voted' : 'Vote'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {votedCandidateId && (
        <div className="alert alert-info mt-5">
          You voted for: {candidates.find(candidate => candidate._id === votedCandidateId)?.candidateName}
        </div>
      )}
      {message && (
        <div className="alert alert-info mt-5">
          {message}
        </div>
      )}
    </div>
  );
};

export default VotingPage;
