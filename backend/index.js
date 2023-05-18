const express = require('express');
const mongoose = require('mongoose');
const UserCustomization = require('./Model');
const User=require('./UserModel')
const cors =require('cors')
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Parse JSON request body
app.use(express.json());
app.use(cors())


const db="mongodb+srv://lavaformama:sarita70@cluster0.oenp3ec.mongodb.net/FormData?retryWrites=true&w=majority"
mongoose.connect(db).then(()=>{
console.log("Mongodb connected")
}).catch((err)=>console.log("NO connected",err))


//signup signin
app.post('/signup', async (req, res) => {
  const { name,email, password } = req.body;
console.log(name,email,password)

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name,email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Signin route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password,"signin")

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No user exist' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

    // Update user token in the database
    user.token = token;
    await user.save();

    res.json({ message: 'Signin successful', token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});


//create a chatbot
app.post('/customizations', async (req, res) => {
  console.log(req.body, "request");
  const { userId, chatbotId, headerColor, headerBackColor, bubbleColor, message1, firstmessgae, botfontcolor } = req.body;
  // console.log(userId, chatbotId, headerColor, headerBackColor, bubbleColor, message1, firstmessgae, botfontcolor, "post");
console.log(chatbotId,"chatbotit---->")
  try {
    let customization = await UserCustomization.findOne({ userId });

    if (customization) {
      // Check if chatbot with chatbotId exists for the user
      const existingChatbot = customization.chatbots.find((chatbot) => chatbot.chatbotId == chatbotId);
console.log(existingChatbot,"exisitng dtials----->")
      if (existingChatbot) {
        console.log("updated chatbot")
        // Update existing chatbot customization
        existingChatbot.headerColor = headerColor;
        existingChatbot.headerBackColor = headerBackColor;
        existingChatbot.bubbleColor = bubbleColor;
        existingChatbot.heading = message1;
        existingChatbot.startmessage = firstmessgae;
        existingChatbot.botfontcolor = botfontcolor;
      } else {
        // Create new chatbot customization
        console.log("created new chatbot for a user")
        customization.chatbots.push({
          chatbotId: chatbotId,
          name: 'Chatbot ' + chatbotId,
          headerColor: headerColor,
          headerBackColor: headerBackColor,
          bubbleColor: bubbleColor,
          heading: message1,
          startmessage: firstmessgae,
          botfontcolor: botfontcolor,
        });
      }
    } else {
      // Create new user customization with chatbot
      console.log("created successfully chatbot for new user")
      customization = new UserCustomization({
        userId: userId,
        chatbots: [
          {
            chatbotId: chatbotId,
            name: 'Chatbot ' + chatbotId,
            headerColor: headerColor,
            headerBackColor: headerBackColor,
            bubbleColor: bubbleColor,
            heading: message1,
            startmessage: firstmessgae,
            botfontcolor: botfontcolor,
          },
        ],
      });
    }

    await customization.save();
    console.log('User customization created or updated successfully');
    res.status(201).json({ message: 'User customization created or updated' });
  } catch (error) {
    console.error('Error creating or updating user customization:', error);
    res.status(500).json({ error: 'Failed to create or update user customization' });
  }
});
  // GET route to fetch user customization all chatbots
  // app.get('/customizations/:userId/:chatbotId', async (req, res) => {
  //   const userId = req.params.userId;
  //   const chatbotId = req.params.chatbotId;

  //   console.log(userId,chatbotId,"fetchinng data---.>>")
    
  
  //   try {
  //     const customization = await UserCustomization.findOne({ userId: userId });
  // console.log(customization,"customato")
  //     if (customization) {
  //       console.log(customization,"customer")
  //       const chatbot = customization.chatbots.find((chat) => {
  //         console.log(chat,"insidemap")
  //         chat.chatbotId === chatbotId});
  // console.log(chatbot,"chatbot detials")
  //       if (chatbot) {
  //         res.json(chatbot);
  //       } else {
  //         res.status(404).json({ error: 'Chatbot not found' });
  //       }
  //     } else {
  //       console.log("hello")
  //       // res.status(404).json({ error: 'User customization not found' });
  //       res.json({ data:"not found" });
  //       return
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user customization:', error);
  //     res.status(500).json({ error: 'Failed to fetch user customization' });
  //   }
  // });
  



  //get particular chatbot
  app.get('/customizations/:userId/:chatbotId', async (req, res) => {
    const userId = req.params.userId;
    const chatbotId = req.params.chatbotId;
    console.log(userId,chatbotId,"chatss")  
    try {
      const customization = await UserCustomization.findOne({ userId: userId });
  console.log(customization,"test 1 2 3")
      if (customization) {
        const chatbot = customization.chatbots.find((chat) => chat.chatbotId === chatbotId);
        if (chatbot) {
          console.log("test me")
          res.json(chatbot);
        } else {
          console.log("test me not")
          res.json({data:"not found"});
        }
      } else {
        console.log("testing data not found")
        res.json({data:"not found"});
      }
    } catch (error) {
      console.error('Error fetching user customization:', error);
      res.status(500).json({ error: 'Failed to fetch user customization' });
    }
  });
  //get latest chatbotid
  // app.get('/chatbotidrequest/:userId', async (req, res) => {
  
  app.get('/chatbotidrequest/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log("inside db",userId)
  
    try {
      let customization = await UserCustomization.findOne({ userId: userId });
  console.log("1",customization)
      if (!customization) {
        console.log("new")
     
  
        // await customization.save();
        console.log("2")
        res.json({ chatbotId: 0 }); // Return chatbotId as 1
        return;
      }
  
      const chatbots = customization.chatbots;
      const latestChatbot = chatbots.sort((a, b) => b.chatbotId - a.chatbotId)[0]; // Sort the chatbots array by chatbotId in descending order and retrieve the first (latest) chatbot
      console.log("3")
      console.log(latestChatbot,"latestchat")
      if (latestChatbot) {
        console.log(latestChatbot,"3 solution")
        res.json({ chatbotId: latestChatbot.chatbotId });
      } else {
        res.status(404).json({ error: 'Chatbot not found' });
      }
    } catch (error) {
      console.error('Error fetching user customization:', error);
      res.status(500).json({ error: 'Failed to fetch user customization' });
    }
  });


  app.get('/chatbots/count/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const user = await UserCustomization.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const chatbots = user.chatbots;
    const chatbotCount = chatbots.length;

    res.json({ count: chatbotCount, chatbots });
    } catch (error) {
      console.error('Error retrieving chatbot count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
