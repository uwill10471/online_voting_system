import React, { useEffect, useState } from 'react';
import axios from '../axios';
import LinearProgress from '../Loaders/LinearProgress';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function CandidatePage() {
    const [party, setParty] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [voterID, setVoterID] = useState("");
    const [gender, setGender] = useState("");
    const [message, setMessage] = useState("");
    const [photo, setPhoto] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { username } = useParams();
    const reduxUsername = useSelector(state => state.username.username)
    const navigate = useNavigate()
    const isLoggedIn = useSelector(state => state.login.isLoggedIn)
    const partyOptions = ["BJP","INC","SP","AAP","TMC","Shiv Sena","YSR Congress","AIADMK","DMK","Not Specified"]
    const [tempParty,setTempParty] = useState("")
    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('party', party!="Not Specified"?party : tempParty);
        formData.append('candidateName', candidateName);
        formData.append('voterID', voterID);
        formData.append('gender', gender);
        formData.append('photo', photo);

        try {
            const response = await axios.post("/api/candidate/register", formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage(response.data.message);

            if (response.data.photo) {
                setImageUrl(`/image/${response.data.photo}`);
            }
        } catch (error) {
            console.error("CandidatePage error:", error);
            setMessage("An error occurred while registering you!");
        } finally {
            setIsLoading(false);
        }
    };

   useEffect(()=>{
 if(username !== reduxUsername){
    navigate(`/candidate/register/${reduxUsername}`)
   }
   },[reduxUsername,navigate])

      useEffect(()=>{
 if(!isLoggedIn){
    navigate("/login")
   }
   },[isLoggedIn,navigate])

  

    return (
        <div className="container mx-auto mt-5 p-5">
            <h2 className="text-2xl font-bold mb-5">Register as Candidate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="form-group">
                    <label htmlFor="party" className="form-label">username</label>
                    <input 
                        type="text" 
                        id="party" 
                        value={username} 
                        readOnly
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="party" className="form-label">Party</label>
                    <select 
                    name="party" 
                    id="party"
                    value={party}
                    onChange={(e)=>setParty(e.target.value)}
                    className='form-control'
                    >
                        <option value="">Select Party</option>
                        {
                            partyOptions.map((partyName,index)=>(
                            <option value={partyName} key={index}>{partyName}</option>
                            ))
                        }
                        


                    </select>
                </div>

                {/* if party is not specified */}
                {party==="Not Specified" &&  <div className="form-group">
                    <label htmlFor="party" className="form-label">Specify Your Party</label>
                    <input 
                        type="text" 
                        id="partyNS" 
                        value={tempParty} 
                        onChange={(e) => setTempParty(e.target.value)} 
                        className="form-control"
                    
                    />
                </div> }


                <div className="form-group">
                    <label htmlFor="candidateName" className="form-label">Candidate Name</label>
                    <input 
                        type="text" 
                        id="candidateName" 
                        value={candidateName} 
                        onChange={(e) => setCandidateName(e.target.value)} 
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="voterID" className="form-label">Voter ID</label>
                    <input 
                        type="text" 
                        id="voterID" 
                        value={voterID} 
                        onChange={(e) => setVoterID(e.target.value)} 
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select 
                        id="gender" 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)} 
                        className="form-control"
                        required
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="photo" className="form-label">Photo</label>
                    <input 
                        type="file" 
                        id="photo" 
                        onChange={handleFileChange} 
                        className="form-control"
                        required
                    />
                </div>
                {isLoading && <LinearProgress />}
                {message && <div className="alert alert-info mt-3">{message}</div>}
                <button type="submit" className="btn btn-primary mt-3 w-full">Register</button>
            </form>
            {imageUrl && <img src={imageUrl} alt="Candidate" className="mt-5" />}
        </div>
    );
}

export default CandidatePage;
