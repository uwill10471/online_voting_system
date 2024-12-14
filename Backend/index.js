import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import cors from 'cors'

import { v4 as uuidv4 } from 'uuid';
// import { GridFSBucket } from 'mongodb'; //for image bucket
import { v2 as cloudinary } from "cloudinary"
import { unlink } from "fs"
import cloudinaryConfig from "./src/Storage/Cloudinary.js"
import upload from './src/Storage/Multer.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import adminRegister from './src/Route/AdminRegister.js'
import adminLogin from './src/Route/AdminLogin.js'
import votingRoute from './src/Route/Vote.js'
import newsRoute from './src/Route/News.js'
import { fileURLToPath } from 'url'; 
import { dirname, join, resolve } from 'path'
import { containerBootstrap } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';
//models
import Block from './src/models/Block.js';
import Transaction from './src/models/Transaction.js';
import RegisteredUser from './src/models/RegisteredUser.js';
import Candidate from './src/models/CandidateSchema.js';
import Admin from './src/models/AdminSchema.js'
import User from './src/models/UserSchema.js'


// import multer from 'multer';
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let nlp;



const corsOptions = {
  origin:"http://localhost:3000", //https://ovs-gr0w.onrender.com
  credntials:true
}


app.use(cors(corsOptions))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.timeout = 30000;



// Configure Multer for file uploads 
// const storage = multer.memoryStorage(); 
// const upload = multer({ storage });
//Gemini 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });






(async () => { 
try { 
const mongoUsername = process.env.MONGO_USERNAME; 
const mongoPassword = process.env.MONGO_PASSWORD; 
const mongoCluster = process.env.MONGO_CLUSTER; 
await mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoCluster}/?retryWrites=true&w=majority&appName=Cluster0`); 
console.log("Database Connected");
 } catch (e) {
 console.error("Database Connection Error:", e); 
}
})();
    


app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production',// Use secure cookies in production
    // httpOnly: true,
   } 
}));
app.use(passport.initialize());
app.use(passport.session());

//User ka authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( adminRegister); 
app.use( adminLogin);
app.use('/api/vote', votingRoute)
app.use('/api/news',newsRoute)
app.post('/api/register', (req, res) => {
    

    const username = req.body.username;
    const Email = req.body.email;
    const password = req.body.password;

    if (!username || !password || !Email) {
        return res.status(400).send("Username, Email and password are required");
    }

    User.findOne({ username: username })
        .then((user) => {
            if (user) {
                return res.status(400).send("User already exists");
            }

            User.register(new User({ username ,Email }), password, (err, user) => {
                if (err) {
                    // console.log(err);
                    return res.status(500).send("Cannot register user");
                }
                passport.authenticate('local')(req, res, () => {
                    res.status(201).send(user);
                });
            });
        })
        .catch((err) => {
            // console.log("Error checking user existence:", err);
            res.status(500).send("Error checking user existence");
        });
});

// app.get("/",(req,res)=>{
//   res.send("Hellow world")
// })

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  try {
    // console.log('Login request received');
    req.session.user = req.user;
    res.json({ success: true, message: 'Login successful', username: req.user.username });
  } catch (error) {
    console.error("Error in login route backend", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// app.get("/api/login",(req,res)=>{
//   res.send("/api/get")
// })



//RegistertoVote

app.post("/api/registertovote", async (req, res) => {
  const { username, FullName, Age, DOB, PhoneNo, AadharNo, VoterID,gender } = req.body;

  try {
    // Check for missing fields
    if (!username || !FullName || !Age || !DOB || !PhoneNo || !AadharNo || !VoterID || !gender) {
      return res.status(400).json({ message: "Please fill all the required details." });
    }

    // Validate the age
    if (Age < 18) {
      return res.status(400).json({
        message: `${FullName}, thanks for showing interest. Come back in ${18 - parseInt(Age)} years!`
      });
    }

    // Check if username already exists
    const existingUser = await RegisteredUser.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: `User ${username} is already registered.` });
    }

    // Check if Aadhar and Voter ID are already registered
    const existingAadhar = await RegisteredUser.findOne({ AadharNo });
    if (existingAadhar) {
      return res.status(409).json({ message: `Aadhar number ${AadharNo} is already registered.` });
    }

    const existingVoterID = await RegisteredUser.findOne({ VoterID });
    if (existingVoterID) {
      return res.status(409).json({ message: `Voter ID ${VoterID} is already registered.` });
    }

    // Create a new user with a unique key
    const uniqueKey = uuidv4();
    const newUser = new RegisteredUser({
      username,
      FullName,
      Age,
      DOB,
      PhoneNo,
      AadharNo,
      VoterID,
      gender,
      uniqueKey,
      hasVoted: false
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: `${FullName}, thanks for registering to vote!`, success: true });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ message: "Please provide valid information for all fields." });
    }

    // Handle other unexpected errors
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});


app.post("/api/candidate/approved", async (req, res) => {
  const  {username}  = req.body;
  
  

  try {
    const user = await RegisteredUser.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ success: false, message: `User with username ${username} is not registered.` });
    }

    try {
      const response = await Candidate.find({ isSelected: true });
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error while fetching candidates.', error: error.message });
    }
  } catch (error) {
    console.error("Error checking registered user in /api/candidate/approved:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error while checking registered user.', error: error.message });
  }
});





// sends candidate info to candidateGallery.jsx
app.get("/api/candidate", async (req, res) => {
  try {
    const response = await Candidate.find({isSelected : false});
    //console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).send('Internal Server Error');
  }
})
.post('/api/candidate/register', upload.single('photo'), async (req, res) => {
  try {
    const { username , party, candidateName, voterID, gender } = req.body;
    // const { originalname, buffer } = req.file;
    const isSelected = false
    //  console.log(originalname,buffer);
     cloudinaryConfig()
    let uploadRes = await cloudinary.uploader.upload(
        req.file.path, {
            folder: 'test',
        }
    )
    .catch((error) => {
        // console.log(error);
    });
    unlink(req.file.path, (err) => {
        if (err) throw err;
        // console.log('path/file.txt was deleted');
    });
    // console.log(uploadRes?.secure_url)
     

    const newCandidate = new Candidate({ 
        username,
        party, 
        candidateName, 
        voterID, 
        gender, 
        photo:uploadRes?.secure_url,// Store the Photo Link in the candidate record
        isSelected
      });
      await newCandidate.save();
      res.status(200).json({ message: 'Candidate registered successfully! Pending Approval !!' });

  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ message: 'An error occurred while registering the candidate!' });
  }
})
.put("/api/candidate", async (req,res)=>{
const {id} = req.body
// console.log(id);

try{
await Candidate.updateOne({_id : id},{isSelected: true})
 res.status(200).json({success:true,message:`${id} updated successfully`})
}catch(error){
  console.error("Error Accepting user in PUT :: /candidate " , error)
}
})
.delete('/api/candidate', async (req, res) => {
    const { id, filename } = req.body;
    try {
        const documents = await Candidate.find({ _id: id });
      //  console.log('Documents found:', documents);

        if (documents.length > 0) {
            await Candidate.deleteOne({ _id: id });
        //    console.log('Candidate deleted successfully');

            
            res.status(200).send('Candidate deleted successfully');
        } else {
          //  console.log('No matching documents found to delete.');
            res.status(404).send('No matching documents found');
        }
    } catch (error) {
        console.error('Error finding or deleting candidate:', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.post("/api/chat", async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     // Add specific instructions to the prompt for a detailed markdown response
//     const enhancedPrompt = `${prompt}\n\nPlease provide a detailed response only on Election and if the propmt question is about something else reply with "keep this chat for election related topic only" formatted in Markdown, including headings, bullet points, new line for subheading and heading and links where applicable.`;

//     const result = await model.generateContent(enhancedPrompt);
//    // console.log("Response =", result.response.text());
//     res.status(200).json(result.response.text());
//   } catch (error) {
//     console.error("Error Generating Content in /chat :: post", error);
//     res.status(500).json({ error: "Error generating content" });
//   }
// });


// session route 
app.get('/api/session', (req, res) => { 
    if (req.session.user) { 
        res.send({ user: req.session.user }); 
    } else { 
        res.send({ message: 'No active session' });
    }
}); 

// Logout route

app.get('/api/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.json("Logged out sucessfully")// Redirect to login page after logout
  });
});

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        // Process the NLP request
        const response = await nlp.process('en', prompt);
        console.log("NLP Response:", response.answer);
        const answer = response.answer;

        // Get the latest vote and registration counts
        const voteCasted = await Block.countDocuments() - 1;
        const allVotes = await Transaction.find({}).exec();
        const totalRegisteredToVote = await RegisteredUser.countDocuments();
        const totalMaleRegisteredToVote = await RegisteredUser.countDocuments({ gender: "male" });
        const totalFemaleRegisteredToVote = await RegisteredUser.countDocuments({ gender: "female" });
        const totalOthersRegisteredToVote = await RegisteredUser.countDocuments({ gender: "others" });

        let MtotalMaleVoted = 0;
        let MtotalFemaleVoted = 0;
        let MtotalOthersVoted = 0;
        let MmaleVotedCandidates = {};
        let MfemaleVotedCandidates = {};
        let MotherVotedCandidates = {};
        let MaincountIndividualVotes = {};
        let MaincandidateDetail = [];

        // Function to collect candidate and vote details
        const resultNLP = async () => {
            let countIndividualVotes = {};
            let candidateDetail = [];
            for (const vote of allVotes) {
                const candidateId = vote.candidateId;
                if (countIndividualVotes[candidateId]) {
                    countIndividualVotes[candidateId]++;
                } else {
                    countIndividualVotes[candidateId] = 1;
                    const TempCandidate = await Candidate.findOne({ _id: candidateId });
                    if (TempCandidate) {
                        candidateDetail.push({
                            candidateId: candidateId,
                            candidateName: TempCandidate.candidateName,
                            gender: TempCandidate.gender,
                            party: TempCandidate.party
                        });
                    } else {
                        console.warn(`Candidate not found for candidateId: ${candidateId}`);
                    }
                }
            }
            MaincandidateDetail = candidateDetail;
            MaincountIndividualVotes = countIndividualVotes;
        }

        // Function to gather demographic details
        const electionNLP = async () => {
            let registeredUserVotedInfo = [];
            let totalMaleVoted = 0;
            let totalFemaleVoted = 0;
            let totalOthersVoted = 0;
            let maleVotedCandidates = {};
            let femaleVotedCandidates = {};
            let otherVotedCandidates = {};

            for (const userinfo of allVotes) {
                let info = await RegisteredUser.findOne({
                    username: userinfo.voterUsername,
                    hasVoted: true
                });

                const candidateId = userinfo.candidateId;
                if (!info) {
                    info = await RegisteredUser.findOneAndUpdate(
                        { username: userinfo.voterUsername },
                        { $set: { hasVoted: true } },
                        { new: true }
                    );
                }

                registeredUserVotedInfo.push(info);
                console.log(info);

                if (info.gender === "male") {
                    totalMaleVoted++;
                    if (maleVotedCandidates[candidateId]) {
                        maleVotedCandidates[candidateId]++;
                    } else {
                        maleVotedCandidates[candidateId] = 1;
                    }
                } else if (info.gender === "female") {
                    totalFemaleVoted++;
                    if (femaleVotedCandidates[candidateId]) {
                        femaleVotedCandidates[candidateId]++;
                    } else {
                        femaleVotedCandidates[candidateId] = 1;
                    }
                } else {
                    totalOthersVoted++;
                    if (otherVotedCandidates[candidateId]) {
                        otherVotedCandidates[candidateId]++;
                    } else {
                        otherVotedCandidates[candidateId] = 1;
                    }
                }
            }

            MtotalMaleVoted = totalMaleVoted;
            MtotalFemaleVoted = totalFemaleVoted;
            MtotalOthersVoted = totalOthersVoted;
            MmaleVotedCandidates = maleVotedCandidates;
            MfemaleVotedCandidates = femaleVotedCandidates;
            MotherVotedCandidates = otherVotedCandidates;
        }

        if (!answer) {
            const updatedPrompt = `${prompt}\n\nPlease provide a detailed response only on Election and if the prompt question is about something else reply with "keep this chat for election related topic only" formatted in Markdown, including headings, bullet points, new line for subheading and heading and links where applicable.`;
            const result = await model.generateContent(updatedPrompt);
            res.status(200).json(result.response.text());
        } else if (answer === 'demographics') {
            await electionNLP();
            const updatedPrompt = `# Election Report

## Registered Voters
- **Total Registered Voters**: ${totalRegisteredToVote}
- **Total Male Registered Voters**: ${totalMaleRegisteredToVote}
- **Total Female Registered Voters**: ${totalFemaleRegisteredToVote}
- **Total Other Registered Voters**: ${totalOthersRegisteredToVote}

## Votes Cast by Gender
- **Total Male Votes Cast**: ${MtotalMaleVoted}
- **Total Female Votes Cast**: ${MtotalFemaleVoted}
- **Total Other Votes Cast**: ${MtotalOthersVoted}

Based on the above information, please provide a summary of the registered voters and votes cast by gender in Markdown format, including headings, bullet points, and any additional insights you find relevant.`

            console.log(updatedPrompt);

            const result = await model.generateContent(updatedPrompt);
            res.status(200).json(result.response.text());
        } else if (answer === 'election') {
            await electionNLP();
            await resultNLP();

            const updatedPrompt = `
# Election Results Summary
** Make sure to not mention any sensitive detail of user and dont mention any ID of either candidate or user for candidate you can use their name **
**Total Votes Cast**: **${voteCasted}**

## Votes Per Candidate
${Object.entries(MaincountIndividualVotes).map(([id, count]) => `- **Candidate ID**: \`${id}\` received **${count}** votes`).join('\n')}

## Candidate Details
${MaincandidateDetail.map(candidate => `
- **Candidate ID**: \`${candidate.candidateId}\`
  - **Name**: ${candidate.candidateName}
  - **Gender**: ${candidate.gender}
  - **Party**: ${candidate.party}
`).join('\n')}

## Voter Demographics
### Total Votes by Gender
- **Male Voters**: ${MtotalMaleVoted}
- **Female Voters**: ${MtotalFemaleVoted}
- **Other Voters**: ${MtotalOthersVoted}

### Votes Per Candidate by Gender
#### Male Voters
${Object.entries(MmaleVotedCandidates).map(([id, count]) => `- **Candidate ID**: \`${id}\` received **${count}** votes from male voters`).join('\n')}

#### Female Voters
${Object.entries(MfemaleVotedCandidates).map(([id, count]) => `- **Candidate ID**: \`${id}\` received **${count}** votes from female voters`).join('\n')}

#### Other Voters
${Object.entries(MotherVotedCandidates).map(([id, count]) => `- **Candidate ID**: \`${id}\` received **${count}** votes from other voters`).join('\n')}

Based on the above information , please provide a summary and detailed report of the election results in Markdown format, including headings, bullet points, and tables where applicable.
`;

            console.log(updatedPrompt);

            const result = await model.generateContent(updatedPrompt);
            res.status(200).json(result.response.text());
        } else if (answer === 'results') {
            await resultNLP();

            console.log("Total votes:", voteCasted);
            console.log("Individual votes count:", MaincountIndividualVotes);
            console.debug("Candidate details:", MaincandidateDetail);

            const updatedPrompt = `
# Election Results Summary

**Total Votes Cast**: **${voteCasted}**

## Votes Per Candidate
${Object.entries(MaincountIndividualVotes).map(([id, count]) => `- **Candidate ID**: \`${id}\` received **${count}** votes`).join('\n')}

## Candidate Details
${MaincandidateDetail.map(candidate => `
- **Candidate ID**: \`${candidate.candidateId}\`
  - **Name**: ${candidate.candidateName}
  - **Gender**: ${candidate.gender}
  - **Party**: ${candidate.party}
`).join('\n')}

Based on the above information, please provide a summary of the election results in Markdown format, including headings and bullet points.
`;

            console.log(updatedPrompt);

            const result = await model.generateContent(updatedPrompt);
            res.status(200).json(result.response.text());
        }
    } catch (error) {
        console.error("Error in /api/chat:", error);
        res.status(500).json({ error: "Error processing request" });
    }
});


const initializeNlp = async () => {
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    nlp = container.get('nlp');
    nlp.settings.autoSave = false;
    nlp.settings.threshold = 0.7;
    nlp.addLanguage('en');

    // Adds the utterances and intents for the NLP
    const addDocuments = () => {
        // Election report queries
        const reportDocuments = [
            'generate a report on election queries',
            'I want a report on the elections',
            'Please create an election report',
            'Can you generate a report on the elections?',
            'Make an election report',
            'Give me a report on the election queries',
            'Report the election queries',
            'Prepare an election query report',
            'Generate an analysis on the election queries',
            'I need an election query report',
            // Additional variations up to 50
            'Can you prepare a summary of election queries?', 
            'Make a detailed report on election topics', 
            'Produce a report about election queries', 
            'Create a document on election issues', 
            'Summarize the election queries in a report', 
            'I need a detailed report on the elections', 
            'Provide a report on election questions', 
            'Compile a report about election matters', 
            'Draft a report on election-related queries', 
            'Generate an election inquiry report', 
            'I require a report on the election results', 
            'Can you make a report on election inquiries?', 
            'Put together a report on election topics', 
            'Create a detailed election report', 
            'Write a report on the election-related questions', 
            'Can you generate a summary report on elections?', 
            'I need a comprehensive election report', 
            'Provide me with a report on the election queries', 
            'Formulate a report on election topics', 
            'Generate a thorough report on election queries', 
            'Create a report regarding election matters', 
            'Can you compile an election queries report?', 
            'Produce an election-related report', 
            'Summarize election queries into a report', 
            'Make a report on election subjects', 
            'I need an election report summary', 
            'Give me a full report on the elections', 
            'Generate a detailed summary of election queries', 
            'Report on election topics for me', 
            'Create a comprehensive election-related report', 
            'Draft an election query summary report', 
            'Produce a detailed document on election queries', 
            'Can you write a report about elections?', 
            'Compile all election-related queries in a report', 
            'Prepare a detailed election analysis report', 
            'Provide a full report on election topics', 
            'Summarize the election-related questions in a report'
        ];

        // Voter demographics queries
        const demographicsDocuments = [
            'tell me how many men voted',
            'how many women participated in the election',
            'what is the male voter turnout',
            'how many female voters were there',
            'can you give me the number of male voters',
            'provide statistics on female voters',
            'how many men voted in the election',
            'tell me the number of female participants',
            'give me the gender distribution of voters',
            'how many male voters were there',
            'No of male voters who voted',
            'how many male voted',
            'how many female voted',
            'No. of female voters',
            'No. of male voters',
            'how many men voted',
            'how many female voted',
            'men who showed up for election',
            'female who showed up for election',
            'numbers of men who showed up for election',
            'numbers of female who showed up for voting'
        ];

        // Election results queries
        const resultsDocuments = [
            'what are the election results so far',
            'tell me the current election results',
            'what is the result of the election so far',
            'can you provide the latest election results',
            'what’s the status of the election results',
            'give me an update on the election results',
            'how are the election results looking',
            'tell me the current standings in the election',
            'provide the latest results of the election',
            'what are the preliminary election results',
        ];

        reportDocuments.forEach(doc => nlp.addDocument('en', doc, 'report.election'));
        demographicsDocuments.forEach(doc => nlp.addDocument('en', doc, 'report.demographics'));
        resultsDocuments.forEach(doc => nlp.addDocument('en', doc, 'report.results'));

        nlp.addAnswer('en', 'report.election', 'election');
        nlp.addAnswer('en', 'report.demographics', 'demographics');
        nlp.addAnswer('en', 'report.results', 'results');
    };

    addDocuments();
    await nlp.train();
    console.log('NLP model trained and ready.');
};

initializeNlp();







app.use(express.static(resolve(__dirname, "../frontend/dist"))); 
app.get('*', (req, res) => { 
  
  res.sendFile(resolve(__dirname, "../frontend/dist", "index.html")); 

});




    app.listen(PORT, () => {
        console.log(`NLP app listening at http://localhost:${PORT}`);
    });

//ELECTION - REACT FRONTEND FOLDER
//BACKEND - NODEJS BACKEND FOLDER
//GITHUB WILL BE PROVIDED IN DESCRIPTION 