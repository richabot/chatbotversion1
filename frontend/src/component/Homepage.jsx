import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SHA256 } from 'crypto-js';
import axios from 'axios';
import Navbar from './Navbar';
const Homepage = () => {

    const userIdfull = localStorage.getItem("userid");
  
 const [total,setTotal]=useState(0)
 const [data,setData]=useState()
    function generateUserId(email) {
      const hashedEmail = SHA256(email).toString();
      const userId = hashedEmail.slice(0, 8); // Take the first 8 characters as the user ID
      return userId;
    }
  
    const userId = generateUserId(userIdfull);

    // const [chatbotId, setChatbotId] = useState(1);
    const [previousChatbot, setPreviousChatbot] = useState(14);
  
    useEffect(() => {
      const fetchPreviousChatbot = async () => {
        console.log(userId,"user")
        try {
          const response = await axios.get(`http://localhost:8080/chatbotidrequest/${userId}`);
          console.log("response",response)
          console.log(response.data.chatbotId,"original")
          setPreviousChatbot(parseInt(response.data.chatbotId));
          console.log(previousChatbot,"prev")
        } catch (error) {
          console.error('Failed to fetch previous chatbot customization:', error);
        }
      };
  
      fetchPreviousChatbot();
    }, []);

    useEffect(() => {
        const fetchPreviousChatbot = async () => {
          console.log(userId,"user")
          try {
            const response = await axios.get(`http://localhost:8080/chatbots/count/${userId}`);
            console.log("alldata",response.data)
            setTotal(response.data)
            setData(response.data.chatbots)
          
          } catch (error) {
            console.log('Failed to fetch previous chatbot customization:', error);
          }
        };
    
        fetchPreviousChatbot();
      }, []);
  
    const handleCreateChatbot = async () => {
        const nextChatbotId = previousChatbot + 1 ;
      
      
      window.location.href= `/customisation/${userId}/${nextChatbotId}`
    };
  



// const chatbotId=1
  return (
    <div>
        <Navbar/>
     {data?.map((chatbot) => (
        <div key={chatbot.chatbotId}>
          <Link to={`http://localhost:3000/display/${userId}/${chatbot.chatbotId}`}>
            {chatbot.name}
          </Link>
        </div>
      ))}
    
      <button onClick={handleCreateChatbot} >Create new</button>
        </div>
   
       
  )
}

export default Homepage