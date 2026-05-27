import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Practice.css';

const SKILLS = {
  reading: {
    label: 'Reading', icon: '📖', color: '#1d9e75',
    activities: [
      // ── L2: THE GREETINGS ──────────────────────────────────────────────
      {
        id: 'r1', title: 'The Greetings — Mark & Julia', level: 'A1',
        type: 'multiple_choice', lesson: 'The Greetings', phase: 'pre',
        text: `Mark: Good afternoon!\nJulia: Good afternoon!\nMark: Hi, what's your name?\nJulia: I'm Julia. And you?\nMark: I'm Mark. Nice to meet you!\nJulia: Nice to meet you too! How do you spell your name?\nMark: It's M-A-R-K. How do you spell yours?\nJulia: J-U-L-I-A.\nMark: Great! How are you?\nJulia: I'm good, thanks. How about you?\nMark: Fine, thanks!\nJulia: Alright, then! But I have to go now!\nMark: Okay, no problem. Have a good day!\nJulia: Thanks, you too! See you later!\nMark: Take care! Bye bye!`,
        questions: [
          { q: 'What time of day does the conversation happen?', options: ['Morning', 'Afternoon', 'Evening', 'Night'], answer: 1 },
          { q: 'How does Julia spell her name?', options: ['J-U-L-I-E', 'J-O-O-L-I-A', 'J-U-L-I-A', 'G-U-L-I-A'], answer: 2 },
          { q: 'How is Julia feeling?', options: ['Tired', 'Bad', 'Good', 'Nervous'], answer: 2 },
          { q: 'What does Mark say when Julia leaves?', options: ['Goodbye forever!', 'See you tomorrow!', 'Have a good day! Take care!', 'Come back soon!'], answer: 2 },
        ]
      },
      {
        id: 'r2', title: 'The Greetings — Vocabulary Match', level: 'A1',
        type: 'multiple_choice', lesson: 'The Greetings', phase: 'pre',
        text: `Study these greetings from your class:\n\n🌅 MORNING: "Good morning!" / "Morning!"\n☀️ AFTERNOON: "Good afternoon!" / "Afternoon, people!"\n🌙 EVENING/ARRIVAL: "Good evening!"\n🌛 LEAVING AT NIGHT: "Good night!"\n\nHow to ask how someone is:\n"How are you?" → "I'm good, thanks!"\n"What's up?" → "Not much! And you?"\n"How's it going?" → "Pretty good! And you?"\n"You good?" → "Yeah, all good!"\n\nSaying goodbye:\n"See you later!" / "Take care!" / "Have a good day!"`,
        questions: [
          { q: 'You arrive at a party at 8 PM. What do you say?', options: ['Good morning!', 'Good night!', 'Good evening!', 'Goodbye!'], answer: 2 },
          { q: 'Someone asks "What\'s up?" — what is the best answer?', options: ['I\'m Julia.', 'Not much! And you?', 'Good afternoon!', 'Take care!'], answer: 1 },
          { q: 'You are leaving work late at night. What do you say?', options: ['Good morning!', 'Good evening!', 'Good night!', 'See you!'], answer: 2 },
          { q: '"How\'s it going?" means the same as...', options: ['Where are you going?', 'How are you?', 'What are you doing?', 'When are you leaving?'], answer: 1 },
        ]
      },
      {
        id: 'r3', title: 'Verb To Be — The Greetings', level: 'A1',
        type: 'multiple_choice', lesson: 'The Greetings', phase: 'post',
        text: `Verb TO BE — used in greetings:\n\nI AM → I'm fine. / I am Mark.\nYOU ARE → You are very kind!\nHE IS → He is my friend.\nSHE IS → She is from Brazil.\nIT IS → It is a good day!\nWE ARE → We are students.\nTHEY ARE → They are teachers.\n\nNEGATIVE:\nI am not tired. / She is not here.\nHe isn't late. / They aren't ready.\n\nQUESTIONS:\n"Are you okay?" → "Yes, I am!" / "No, I'm not."\n"Is she your friend?" → "Yes, she is!"\n"How are you?" → "I'm great, thanks!"`,
        questions: [
          { q: 'Complete: "___ she your teacher?" — "Yes, ___ is!"', options: ['Is / she', 'Are / she', 'Am / she', 'Is / her'], answer: 0 },
          { q: 'Which is CORRECT?', options: ['I are fine.', 'He am happy.', 'They is students.', 'We are friends.'], answer: 3 },
          { q: 'Make negative: "I am tired."', options: ['I not am tired.', 'I am not tired.', 'I am no tired.', 'Am I not tired.'], answer: 1 },
          { q: '"How are you?" — best answer:', options: ['"I am Mark."', '"She is fine."', '"I\'m great, thanks! And you?"', '"You are welcome."'], answer: 2 },
        ]
      },
      // ── L3: THE INTRODUCTIONS ─────────────────────────────────────────
      {
        id: 'r4', title: 'Meet John & Elizabeth!', level: 'A1',
        type: 'multiple_choice', lesson: 'The Introductions', phase: 'pre',
        text: `John: Hello hello!\nElizabeth: Hello hello! How are you?\nJohn: I am fine thanks. What about you? I am okay! What's your name?\nElizabeth: My name is Elizabeth. What is your name?\nJohn: My name is John. Nice to meet you, Elizabeth!\nElizabeth: Nice to meet you too, John! How old are you?\nJohn: I am 23 years old. Where are you from, Elizabeth?\nElizabeth: I am from Spain. I am Spanish. I live in Madrid. What about you?\nJohn: I am from the United States of America. I am an American. I live in New York.\nElizabeth: Do you speak Spanish?\nJohn: No, I don't. I speak English and French. I am a businessman. What about you?\nElizabeth: I am a teacher. I teach Spanish in a high school. It has been a pleasure to meet you, John!\nJohn: I am also glad to meet you. I hope to see you soon! Bye!\nElizabeth: See you later! Bye!`,
        questions: [
          { q: 'Where is Elizabeth from?', options: ['The United States', 'France', 'Spain', 'England'], answer: 2 },
          { q: 'What does John do?', options: ['He is a teacher', 'He is a businessman', 'He is a student', 'He is a doctor'], answer: 1 },
          { q: 'Where does John live?', options: ['Madrid', 'Los Angeles', 'London', 'New York'], answer: 3 },
          { q: '"It has been a pleasure to meet you" means:', options: ['I need to leave now', 'I am very happy to have met you', 'Where are you from?', 'See you tomorrow'], answer: 1 },
        ]
      },
      {
        id: 'r5', title: 'Her, His, Here & There — Grammar Focus', level: 'A1',
        type: 'multiple_choice', lesson: 'The Introductions', phase: 'post',
        text: `Key vocabulary from class:\n\nHERE = aqui (perto de você)\n"My book is here." / "Come here!"\n\nOVER THERE = lá, ali (longe de você)\n"The bathroom is over there." / "He is over there!"\n\nWHERE = onde (pergunta)\n"Where are you from?" / "Where is my pen?"\n\nHER NAME IS = o nome dela é\n"Her name is Elizabeth. She is from Spain."\n\nHIS NAME IS = o nome dele é\n"His name is John. He is an American."\n\nYOU'RE WELCOME = de nada\n"Thank you!" → "You're welcome!"`,
        questions: [
          { q: 'Someone is far away. You say: "He is ___ ."', options: ['here', 'where', 'over there', 'welcome'], answer: 2 },
          { q: 'Your friend thanks you. You say:', options: ['"Thank you!"', '"You\'re welcome!"', '"Here you are!"', '"Over there!"'], answer: 1 },
          { q: 'Fill in: "___ name is Maria. She is Brazilian."', options: ['His', 'Her', 'Where', 'Here'], answer: 1 },
          { q: '"Thank you so much!" — "___!"', options: ['Here you are', 'Over there', 'You\'re welcome', 'His name'], answer: 2 },
        ]
      },
      // ── L4: COUNTRIES AND NATIONALITIES ──────────────────────────────
      {
        id: 'r6', title: 'Meet Giulia!', level: 'A1',
        type: 'multiple_choice', lesson: 'Countries and Nationalities', phase: 'pre',
        text: `Hi! My name is Giulia Rossi, and I'm from Florence, Italy. I'm Italian. I'm a teacher and I'm very happy with my job.\n\nNow I live in São Paulo, Brazil, and I love it here! I speak Italian, English and Portuguese. Portuguese is my favorite language, because my mother is from Brazil.\n\nI love Brazil because it is beautiful and the people are very friendly. But sometimes the city is too loud and very crowded!\n\nSee you!`,
        questions: [
          { q: 'Where is Giulia originally from?', options: ['São Paulo, Brazil', 'Rome, Italy', 'Florence, Italy', 'Lisbon, Portugal'], answer: 2 },
          { q: 'What is Giulia\'s nationality?', options: ['Brazilian', 'Portuguese', 'Spanish', 'Italian'], answer: 3 },
          { q: 'Why is Portuguese Giulia\'s favorite language?', options: ['She lives in Brazil', 'Her father is Brazilian', 'Her mother is from Brazil', 'She is a Portuguese teacher'], answer: 2 },
          { q: 'What does Giulia DISLIKE about the city?', options: ['The food', 'The weather', 'The people', 'It is too loud and crowded'], answer: 3 },
        ]
      },
      {
        id: 'r7', title: 'Countries, Nationalities & Verbs', level: 'A1',
        type: 'multiple_choice', lesson: 'Countries and Nationalities', phase: 'post',
        text: `Meet Ana! She is from Brazil, so she is Brazilian. She speaks Portuguese a lot and a little English. She wants to learn more! She lives in Rio de Janeiro. She loves her city because it is beautiful. But she dislikes loud noise and dirty places.\n\nKey verbs from class:\nTo BE → I am / She is / He is\nTo LIVE → I live in... / She lives in...\nTo SPEAK → I speak... / She speaks...\nTo LOVE → I love... / She loves...\nTo DISLIKE → I dislike... / She dislikes...\n\nCountry → Nationality:\nBrazil → Brazilian\nItaly → Italian\nEngland → English\nFrance → French\nJapan → Japanese\nChina → Chinese\nSpain → Spanish`,
        questions: [
          { q: 'Complete: "Ana ___ from Rio de Janeiro."', options: ['am', 'are', 'is', 'be'], answer: 2 },
          { q: 'What is the nationality of someone from Japan?', options: ['Japanian', 'Japanish', 'Japaneese', 'Japanese'], answer: 3 },
          { q: 'Complete: "She ___ Portuguese a lot and a little English."', options: ['speak', 'speaks', 'speaking', 'spoke'], answer: 1 },
          { q: 'Complete: "I ___ loud noise. I prefer quiet places."', options: ['love', 'want', 'dislike', 'speak'], answer: 2 },
        ]
      },
    ]
  },
  listening: {
    label: 'Listening', icon: '🎧', color: '#378add',
    activities: [
      // ── L2: THE GREETINGS ──────────────────────────────────────────────
      {
        id: 'l1', title: 'Jenny at the Hotel', level: 'A1',
        type: 'listening_video', lesson: 'The Greetings', phase: 'pre',
        youtubeId: 'EflkHGJbxnA', startTime: 56, endTime: 286,
        instruction: 'Watch the video from 0:56 to 4:46. Pay attention to how Jenny greets the receptionist, spells her name, and checks in. Then answer the questions below!',
        audioText: `Jenny: Hello. I have a reservation. My name is Jennifer Zielinski.\nReceptionist: Can you spell that, please?\nJenny: Z-I-E-L-I-N-S-K-I.\nReceptionist: For five nights?\nJenny: Yes, that's right.\nReceptionist: Can I have your passport, please?\nJenny: Just a second… here you are.\nReceptionist: Thank you. Can you sign here, please?\nJenny: Sure. Thank you.\nReceptionist: Here's your key — it's room 306 on the third floor. The lift is over there.\nJenny: The lift — oh, the elevator!\nReceptionist: Yes, enjoy your stay, Ms. Zielinski.\nJenny: Thank you!`,
        questions: [
          { q: 'What is Jenny\'s last name?', options: ['Zelinski', 'Zielinski', 'Zielinsky', 'Zielinksi'], answer: 1 },
          { q: 'How many nights is Jenny staying?', options: ['3 nights', '4 nights', '5 nights', '6 nights'], answer: 2 },
          { q: 'What room does Jenny get?', options: ['Room 306', 'Room 360', 'Room 603', 'Room 316'], answer: 0 },
          { q: 'What does "lift" mean?', options: ['Stairs', 'Reception', 'Elevator', 'Exit'], answer: 2 },
        ]
      },
      {
        id: 'l2', title: 'Meet Sarah!', level: 'A1',
        type: 'listening_video', lesson: 'The Greetings', phase: 'pre',
        youtubeId: 'fLYzVdpseSA', startTime: 0, endTime: 60,
        instruction: 'Listen to Sarah introducing herself. Pay attention to how she spells her name, where she is from, her age, and how she is feeling. Then answer the questions below!',
        audioText: `Sarah: Hi! Good morning! My name is Sarah, and it's spelled S-A-R-A-H. Nice to meet you!\nSarah: I'm from New York, but now I live in a different city for work and study. I'm 22 years old, and I really enjoy music, coffee, and meeting new people.\nSarah: Today I'm feeling great, just a little tired because I woke up early this morning.\nSarah: People usually say my name is easy to remember, but I still like spelling it when I meet someone new. What about you? What's your name, and how do you spell it?`,
        questions: [
          { q: 'How does Sarah spell her name?', options: ['S-E-R-A-H', 'S-A-R-A-H', 'S-A-R-R-A-H', 'S-A-R-A'], answer: 1 },
          { q: 'Where is Sarah originally from?', options: ['Los Angeles', 'London', 'New York', 'Chicago'], answer: 2 },
          { q: 'How old is Sarah?', options: ['20 years old', '21 years old', '23 years old', '22 years old'], answer: 3 },
          { q: 'How is Sarah feeling today?', options: ['Sick and tired', 'Great, a little tired', 'Nervous and excited', 'Bored and sleepy'], answer: 1 },
        ]
      },
      {
        id: 'l3', title: 'Where Are You From?', level: 'A1',
        type: 'listening_video', lesson: 'The Greetings', phase: 'post',
        youtubeId: '31y2Bq1RYQA', startTime: 60, endTime: 297,
        instruction: 'Watch Tim, Sian, Buli and Georgie talk about where they are from and where they live. Pay attention to the names, cities and how they describe their homes. Then answer the questions!',
        audioText: `Tim: Hi, I'm Tim. I'm from Oxford.\nSian: I'm from Swansea.\nBuli: I'm from Beijing.\nGeorgie: I'm from Petworth.\nTim: I live in a house in London. And I live with my housemates.\nSian: I live in a house in Brighton. I live with my family.\nBuli: I live in a flat in Cambridge. I live on my own.\nGeorgie: I live in a flat in London. I live with my flatmates.`,
        questions: [
          { q: 'Where is Sian from originally?', options: ['Oxford', 'Beijing', 'Swansea', 'Petworth'], answer: 2 },
          { q: 'Where does Buli live now?', options: ['London', 'Brighton', 'Oxford', 'Cambridge'], answer: 3 },
          { q: 'Who lives in a flat?', options: ['Tim and Sian', 'Sian and Georgie', 'Buli and Georgie', 'Tim and Buli'], answer: 2 },
          { q: 'Who does Sian live with?', options: ['Her flatmates', 'On her own', 'Her housemates', 'Her family'], answer: 3 },
        ]
      },
      // ── L3: THE INTRODUCTIONS ─────────────────────────────────────────
      {
        id: 'l4', title: 'John & Elizabeth — First Meeting', level: 'A1',
        type: 'listening_video', lesson: 'The Introductions', phase: 'pre',
        youtubeId: 'YGTEXtptvGM', startTime: 0, endTime: 182,
        instruction: 'Watch John and Elizabeth meeting for the first time. Pay attention to where they are from, what they do, and how they say goodbye. Then answer the questions!',
        audioText: `John: Hello hello!\nElizabeth: Hello hello! How are you? I am okay! What's your name?\nJohn: My name is John. Nice to meet you, Elizabeth!\nElizabeth: Nice to meet you too! I am from Spain. I am Spanish. I live in Madrid.\nJohn: I am from the United States. I am an American. I live in New York.\nElizabeth: Do you speak Spanish?\nJohn: No, I don't. I speak English and French. I am a businessman.\nElizabeth: I am a teacher. It has been a pleasure to meet you, John!\nJohn: I am also glad to meet you. I hope to see you soon!`,
        questions: [
          { q: 'Where is Elizabeth from?', options: ['The United States', 'France', 'Spain', 'England'], answer: 2 },
          { q: 'What does John do?', options: ['He is a teacher', 'He is a businessman', 'He is a student', 'He is a doctor'], answer: 1 },
          { q: 'What languages does John speak?', options: ['English and Spanish', 'Spanish and French', 'English and French', 'Italian and English'], answer: 2 },
          { q: '"I am glad to meet you" means:', options: ['I am tired of meeting people', 'I am happy to meet you', 'I want to leave now', 'I do not know you'], answer: 1 },
        ]
      },
      {
        id: 'l5', title: 'Introducing Yourself', level: 'A1',
        type: 'listening_video', lesson: 'The Introductions', phase: 'post',
        youtubeId: 'P3VcHnECgbs', startTime: 0, endTime: 75,
        instruction: 'Watch this ESL video about introducing yourself. Pay attention to the key phrases used. Then answer the questions!',
        audioText: `Narrator: How do you introduce yourself in English?\nSpeaker 1: Hi! My name is Anna. Nice to meet you!\nSpeaker 2: Hello! I'm David. Where are you from, Anna?\nAnna: I'm from Brazil. And you?\nDavid: I'm from Canada. What do you do?\nAnna: I'm a student. What about you?\nDavid: I'm an engineer. It's great to meet you!\nAnna: You too! See you around!`,
        questions: [
          { q: '"Nice to meet you" — same meaning:', options: ['See you later!', 'It\'s great to meet you!', 'How are you?', 'Where are you from?'], answer: 1 },
          { q: '"What do you do?" means:', options: ['What are you doing now?', 'What is your hobby?', 'What is your job?', 'What did you do yesterday?'], answer: 2 },
          { q: 'Where is Anna from?', options: ['Canada', 'The United States', 'Brazil', 'Australia'], answer: 2 },
          { q: '"See you around!" means:', options: ['I will never see you again', 'We will probably see each other again', 'Look around you!', 'Let\'s go around'], answer: 1 },
        ]
      },
      // ── L4: COUNTRIES AND NATIONALITIES ──────────────────────────────
      {
        id: 'l6', title: 'Street Interview — Where Are You From?', level: 'A1',
        type: 'listening_video', lesson: 'Countries and Nationalities', phase: 'pre',
        youtubeId: 'qaand6YZhc0', startTime: 0, endTime: 65,
        instruction: 'Watch this real street interview! People talk about where they are from, spell their names, and share personal information. Then answer the questions!',
        audioText: `Doug: Hi, I'm Doug.\nNatalie: Hi, I'm Natalie. This is my husband, Chris.\nChris: Hi, nice to meet you.\nInterviewer: Where are you from?\nNatalie: I'm from Oklahoma and I'm from Bristol in England.\nInterviewer: Hi. What's your name?\nDeepti: My name is Deepti Gupta.\nInterviewer: Could you spell it for me?\nDeepti: Yes. The first name is Deepti — D E E P T I. And the last name is Gupta — G U P T A.\nInterviewer: And are you from the United States?\nDeepti: No, I'm not. I'm from India.`,
        questions: [
          { q: 'Where is Natalie from?', options: ['Oklahoma only', 'Bristol only', 'Oklahoma and Bristol, England', 'India'], answer: 2 },
          { q: 'How do you spell Deepti\'s last name?', options: ['G-U-P-T-A', 'G-O-O-P-T-A', 'G-U-P-T-E', 'G-A-P-T-A'], answer: 0 },
          { q: 'Is Deepti from the United States?', options: ['Yes, she is.', 'No, she is from England.', 'No, she is from India.', 'No, she is from Canada.'], answer: 2 },
          { q: 'Chris is Natalie\'s...', options: ['brother', 'friend', 'husband', 'teacher'], answer: 2 },
        ]
      },
      {
        id: 'l7', title: 'Countries & Nationalities — TV Show', level: 'A1',
        type: 'listening_video', lesson: 'Countries and Nationalities', phase: 'post',
        youtubeId: 'wYbTtiosCFE', startTime: 0, endTime: 112,
        instruction: 'Watch this conversation about countries and nationalities. Pay attention to how they guess nationalities and talk about cities. Then answer the questions!',
        audioText: `Jay: I am happy to introduce the new co-host of our show, Miss Kim Kamal.\nKim: Hello Kim. Good morning, Ray. Oh, I'm sorry, I mean Jay.\nJay: Well, you must be nervous to be next to a celebrity.\nKim: Yes, and I'm also nervous to be on TV. Millions of people watch Good Morning World!\nJay: So tell us about yourself. Where are you from?\nJay: Are you from Canada? Are you Canadian?\nKim: No, I'm not.\nJay: Are you from Brazil? Brazil is a beautiful country.\nKim: Yes it is, but no, I'm not Brazilian.\nJay: Are you from Turkey?\nKim: No, I'm not from Turkey. I'm from Jamaica!\nJay: Whereabouts in Jamaica are you from?\nKim: I'm from Kingston, the capital of Jamaica. It is a big and crowded city which makes it very noisy, but it is also very interesting!`,
        questions: [
          { q: 'Where is Kim from?', options: ['Canada', 'Brazil', 'Turkey', 'Jamaica'], answer: 3 },
          { q: 'What is the capital of Jamaica?', options: ['Montego Bay', 'Kingston', 'Nassau', 'Havana'], answer: 1 },
          { q: 'How does Kim describe Kingston?', options: ['Small and quiet', 'Big, crowded and noisy but interesting', 'Beautiful and peaceful', 'Old and boring'], answer: 1 },
          { q: 'Kim is nervous because...', options: ['She forgot her lines', 'She doesn\'t like Jay', 'She is on TV with millions watching', 'She is from Jamaica'], answer: 2 },
        ]
      },
    ]
  },
  writing: {
    label: 'Writing', icon: '✏️', color: '#7f77dd',
    activities: [
      // ── L2: THE GREETINGS ──────────────────────────────────────────────
      {
        id: 'w1', title: 'Write Your Own Greeting Dialogue', level: 'A1',
        type: 'writing', lesson: 'The Greetings', phase: 'pre',
        prompt: 'Write a short dialogue (conversation) between two people meeting for the first time. Include:\n• A greeting\n• Asking and saying names\n• Spelling at least one name\n• Asking how they are\n• Saying goodbye\n\nUse vocabulary from The Greetings class!',
        minWords: 40,
        tips: [
          'Start with a greeting: "Good morning!" / "Hi!" / "Hey!"',
          'Ask the name: "What\'s your name?" → "I\'m ___."',
          'Spell a name: "How do you spell that?" → "It\'s M-A-R-K."',
          'Ask how they are: "How are you?" → "I\'m good, thanks!"',
          'Say goodbye: "See you later!" / "Take care!" / "Have a good day!"'
        ],
        feedback: { excellent: "Excellent dialogue! 🌟", good: "Good job!", needsWork: "Nice start! Add more expressions." }
      },
      {
        id: 'w2', title: 'How Are You? — Write Your Answers', level: 'A1',
        type: 'writing', lesson: 'The Greetings', phase: 'pre',
        prompt: 'Someone asks you these 3 questions. Write a natural answer for each one:\n\n1. "How are you today?"\n2. "What\'s up?"\n3. "How\'s everything?"\n\nThen write 2 more sentences about your day using "I am" or "I\'m".',
        minWords: 35,
        tips: [
          'Use different answers for each question!',
          'For "How are you?" try: "I\'m good, thanks! And you?"',
          'For "What\'s up?" try: "Not much! Pretty good day!"',
          'Add details: "I\'m a little tired but happy!"',
        ],
        feedback: { excellent: "Wonderful! 🌟", good: "Good work!", needsWork: "Answer each of the 3 questions!" }
      },
      {
        id: 'w3', title: 'Formal or Informal? — Rewrite It!', level: 'A1',
        type: 'writing', lesson: 'The Greetings', phase: 'post',
        prompt: 'Rewrite these sentences. Make them the OPPOSITE style:\n\n1. INFORMAL → make it FORMAL:\n"Hey! What\'s up? You good?"\n\n2. FORMAL → make it INFORMAL:\n"Good morning. How do you do? It is a pleasure to meet you."\n\n3. Write 3 sentences to say goodbye — 1 formal, 1 informal, 1 your choice!',
        minWords: 40,
        tips: [
          'Formal = professional, polite: "Good morning. How are you?"',
          'Informal = relaxed, friendly: "Hey! What\'s up?"',
          'Formal goodbye: "It was a pleasure. Have a wonderful day."',
          'Informal goodbye: "See ya! Take care! Bye!"',
        ],
        feedback: { excellent: "Perfect! 🌟", good: "Good!", needsWork: "Check the formal/informal difference!" }
      },
      // ── L3: THE INTRODUCTIONS ─────────────────────────────────────────
      {
        id: 'w4', title: 'Introduce Yourself in Writing', level: 'A1',
        type: 'writing', lesson: 'The Introductions', phase: 'pre',
        prompt: 'Write a short self-introduction in English! Include:\n• Your name\n• Where you are from\n• Your age\n• What you do (job or study)\n• One thing you like\n\nUse the words from class: here, where, his/her name is.',
        minWords: 15,
        tips: [
          '"My name is ___. Nice to meet you!"',
          '"I am from ___. I live in ___."',
          '"I am ___ years old."',
          '"I am a student / teacher / ___."',
          '"I like ___ and ___."',
        ],
        feedback: { excellent: "Fantastic introduction! 🌟", good: "Good job!", needsWork: "Include name, where from, age and what you do!" }
      },
      {
        id: 'w5', title: 'Describe Someone You Know', level: 'A1',
        type: 'writing', lesson: 'The Introductions', phase: 'post',
        prompt: 'Write about someone you know — a friend, family member or classmate. Use:\n• His name is / Her name is\n• He is / She is (age, job, where from)\n• He lives / She lives\n• He likes / She likes\n\nMinimum 20 words. Try to use "here", "where" and "there" in your sentences!',
        minWords: 20,
        tips: [
          '"Her name is Ana. She is my friend."',
          '"His name is Carlos. He is 25 years old."',
          '"She is from Rio. She lives here in São Paulo."',
          '"He works over there, near the school."',
        ],
        feedback: { excellent: "Excellent! 🌟", good: "Good work!", needsWork: "Use 'His/Her name is' and 'here/there'!" }
      },
      // ── L4: COUNTRIES AND NATIONALITIES ──────────────────────────────
      {
        id: 'w6', title: 'Where Are You From? — Write It!', level: 'A1',
        type: 'writing', lesson: 'Countries and Nationalities', phase: 'pre',
        prompt: 'Write about yourself using what you learned in class! Answer these questions in full sentences:\n\n1. Where are you from?\n2. What is your nationality?\n3. Where do you live today?\n4. What language(s) do you speak?\n5. Do you love where you live? Why?\n\nUse: I am from / I am ___ (nationality) / I live in / I speak / I love it because...',
        minWords: 30,
        tips: [
          '"I am from ___. I am ___ (nationality)."',
          '"Now I live in ___ and I love/like it!"',
          '"I speak ___ a lot and a little English."',
          '"I love my city because it is ___."',
          '"I dislike ___ because it is too ___."',
        ],
        feedback: { excellent: "Excellent! You used all the vocabulary perfectly! 🌟", good: "Good! Try to add your nationality and why you love your city!", needsWork: "Use: I am from, I am (nationality), I live in, I speak!" }
      },
      {
        id: 'w7', title: 'My Country & City — Describe It!', level: 'A1',
        type: 'writing', lesson: 'Countries and Nationalities', phase: 'post',
        prompt: 'Write a paragraph presenting your country and city to a foreign friend. Include:\n\n• Your country and nationality\n• Where you live today\n• The language(s) spoken there\n• What you love about it\n• What you dislike about it\n• One interesting fact\n\nUse the verbs from class: to be, to live, to speak, to love, to dislike.',
        minWords: 40,
        tips: [
          '"I am from Brazil, so I am Brazilian. I speak Portuguese."',
          '"I live in ___ and it is ___ (beautiful/big/noisy/crowded)."',
          '"I love it because there is/are ___."',
          '"I dislike ___ because it is too ___ (loud/dirty/crowded)."',
          '"An interesting fact: ___ is more than ___ years old!"',
        ],
        feedback: { excellent: "Wonderful description! Your verbs and vocabulary are spot on! 🌟", good: "Good paragraph! Try to add what you dislike too — it makes it more interesting!", needsWork: "Include: nationality, language, what you love AND dislike about your city!" }
      },
    ]
  },
  speaking: {
    label: 'Speaking', icon: '🎙️', color: '#d4537e',
    activities: [
      // ── L2: THE GREETINGS ──────────────────────────────────────────────
      {
        id: 's1', title: 'Introduce Yourself!', level: 'A1',
        type: 'speaking', lesson: 'The Greetings', phase: 'pre',
        prompt: 'Record a short introduction! Say:\n1. A greeting (Good morning! / Hi! / Hey!)\n2. Your name\n3. How you are feeling today\n4. One thing about your day\n5. A goodbye',
        tips: [
          '"Good morning! / Hi everyone! / Hey!"',
          '"My name is ___. Nice to meet you!"',
          '"I am feeling ___ today because ___."',
          'End with: "See you later! / Take care! / Bye!"',
        ],
        phrases: ['Good morning!', 'My name is...', 'Nice to meet you!', 'I am feeling...', 'See you later!', 'Take care!']
      },
      {
        id: 's2', title: 'How Are You? — 5 Different Ways', level: 'A1',
        type: 'speaking', lesson: 'The Greetings', phase: 'pre',
        prompt: 'Record yourself answering "How are you?" in 5 DIFFERENT ways! Each answer must be different. Use the expressions from class:\n\n1. Answer formally\n2. Answer informally\n3. Answer with a feeling + reason\n4. Answer with a question back\n5. Answer with one word + more info',
        tips: [
          'Formal: "I am very well, thank you!"',
          'Informal: "Pretty good! Not much going on!"',
          'Feeling + reason: "I\'m tired because I woke up early!"',
          'Question back: "I\'m great! And you?"',
          'One word: "Fantastic! It is a beautiful day!"',
        ],
        phrases: ['I am very well, thank you.', 'Not much!', 'Pretty good!', 'I\'m tired because...', 'And you?', 'Fantastic!', 'Not too bad!']
      },
      {
        id: 's3', title: 'Role Play — Hotel Check-in', level: 'A1',
        type: 'speaking', lesson: 'The Greetings', phase: 'post',
        prompt: 'You are Jenny from the listening exercise! Check into a hotel. Record yourself playing Jenny\'s part:\n\n1. Greet the receptionist\n2. Say you have a reservation\n3. Say your name and spell your last name\n4. Confirm your details\n5. Thank the receptionist and say goodbye politely',
        tips: [
          'Start with: "Hello! Good evening."',
          '"I have a reservation. My name is ___."',
          'Spell: "My last name is ___, it\'s spelled ___."',
          '"Yes, that\'s right." / "Here you are."',
          '"Thank you very much! Have a good evening!"',
        ],
        phrases: ['Hello! Good evening.', 'I have a reservation.', 'My name is... it\'s spelled...', 'Yes, that\'s right.', 'Here you are.', 'Thank you very much!', 'Have a good evening!']
      },
      // ── L3: THE INTRODUCTIONS ─────────────────────────────────────────
      {
        id: 's4', title: 'Introduce Yourself!', level: 'A1',
        type: 'speaking', lesson: 'The Introductions', phase: 'pre',
        prompt: 'Record yourself doing a complete self-introduction — just like John and Elizabeth! Say:\n\n1. Your name and where you are from\n2. Your age\n3. What you do (job or studies)\n4. A language you speak\n5. One thing you like\n\nSpeak for at least 30 seconds!',
        tips: [
          '"Hi! My name is ___. Nice to meet you!"',
          '"I am from ___. I live in ___."',
          '"I am ___ years old."',
          '"I am a student / I work as a ___."',
          '"I like ___ a lot. What about you?"',
        ],
        phrases: ['My name is...', 'I am from...', 'I live in...', 'I am ___ years old.', 'I am a student.', 'Nice to meet you!', 'It has been a pleasure!']
      },
      {
        id: 's5', title: 'Where Are You From? — Key Vocab', level: 'A1',
        type: 'speaking', lesson: 'The Introductions', phase: 'post',
        prompt: 'Practice the key vocabulary! Record yourself using each of these words in a real sentence:\n\n1. HERE — say where something is\n2. OVER THERE — point to something far\n3. WHERE — ask a question\n4. HIS NAME IS — talk about a man you know\n5. HER NAME IS — talk about a woman you know\n6. YOU\'RE WELCOME — respond to a thank you',
        tips: [
          '"My bag is here. The door is over there."',
          '"Where are you from? Where do you live?"',
          '"His name is ___. He is my friend."',
          '"Her name is ___. She is my teacher."',
          '"Thank you!" → "You\'re welcome!"',
        ],
        phrases: ['Here!', 'Over there!', 'Where are you from?', 'His name is...', 'Her name is...', 'You\'re welcome!', 'It\'s right here!', 'It\'s over there!']
      },
      // ── L4: COUNTRIES AND NATIONALITIES ──────────────────────────────
      {
        id: 's6', title: 'Where Are You From? Tell Me Everything!', level: 'A1',
        type: 'speaking', lesson: 'Countries and Nationalities', phase: 'pre',
        prompt: 'Record yourself talking about where you are from and where you live today! Say:\n\n1. Your name and where you are from\n2. Your nationality\n3. Where you live now\n4. One language you speak\n5. One thing you love about where you live',
        tips: [
          '"My name is ___. I am from ___, so I am ___." (nationality)',
          '"Now I live in ___ and I love/like it because..."',
          '"I speak ___ and a little English!"',
          '"My city is ___ and it is beautiful/big/noisy."',
        ],
        phrases: ['I am from...', 'I am ___ (nationality)', 'Now I live in...', 'I speak...', 'I love it because...', 'My city is...', 'It is beautiful!']
      },
      {
        id: 's7', title: 'My Country & City — Tell Me More!', level: 'A1',
        type: 'speaking', lesson: 'Countries and Nationalities', phase: 'post',
        prompt: 'Go deeper! Record yourself talking about your country and city for at least 45 seconds:\n\n1. Where you are from and your nationality\n2. Where you live today and if you like it\n3. The language(s) you speak\n4. What you LOVE about your city\n5. What you DISLIKE about your city',
        tips: [
          '"I love my city because it is ___ and there is/are ___."',
          '"I dislike ___ because it is too noisy / dirty / crowded."',
          '"I speak ___ a lot and I want to learn English!"',
          '"I live here now, but I am originally from ___."',
        ],
        phrases: ['I am originally from...', 'I love it because...', 'I dislike...', 'It is too...', 'There is/are...', 'I speak... a lot', 'I want to learn...']
      },
    ]
  }
};

export default function Practice({ user, student, onLogout }) {
  const { skill } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skillData = SKILLS[skill] || SKILLS.reading;

  // Filter activities by lesson if provided
  const lessonParam = searchParams.get('lesson') || null;
  const filteredActivities = lessonParam
    ? skillData.activities.filter(a => a.lesson === lessonParam)
    : skillData.activities;

  const [activityIndex, setActivityIndex] = useState(() => {
    const idx = parseInt(searchParams.get('activity') || '0');
    // Find index within filtered activities
    if (lessonParam) {
      const allIdx = isNaN(idx) ? 0 : idx;
      const filtered = skillData.activities.filter(a => a.lesson === lessonParam);
      const pos = filtered.findIndex((_, i) => skillData.activities.indexOf(filtered[i]) === allIdx);
      return pos >= 0 ? pos : 0;
    }
    return isNaN(idx) ? 0 : idx;
  });

  const activity = filteredActivities[activityIndex] || filteredActivities[0];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [score, setScore] = useState(0);
  const [showAudio, setShowAudio] = useState(false);

  // Speaking / recording state
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [speakingFeedback, setSpeakingFeedback] = useState(null);
  const [speakingLoading, setSpeakingLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true } 
      });

      // Pick best supported format — prefer mp4 for broader Whisper support
      const mimeTypes = [
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ];
      const mimeType = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
      console.log('[recording] Using format:', mimeType || 'browser default');

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const usedMime = mediaRecorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: usedMime });
        console.log('[recording] Blob:', blob.size, 'bytes | type:', usedMime);
        await transcribeAudio(blob);
      };

      mediaRecorder.start(500); // collect every 500ms
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      console.error('Mic error:', err);
      alert('Could not access microphone. Please allow microphone access in your browser settings and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const transcribeAudio = async (blob) => {
    setSpeakingLoading(true);

    if (blob.size < 500) {
      setSpeakingFeedback({
        score: 0,
        positive: '🎤 Audio not captured.',
        tip: 'Allow microphone access in your browser and try again.',
        suggestions: ['Tap the 🔒 icon in your browser address bar', 'Enable microphone permission', 'Try recording again'],
        overall: 'Check microphone permissions and try again! 🔧'
      });
      setSpeakingLoading(false);
      setSubmitted(true);
      return;
    }

    try {
      // Send raw binary with correct content-type — works on all platforms
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'audio/webm' },
        body: blob,
      });

      const data = await res.json();
      console.log('[speaking] API response:', data);

      if (data.error === 'no_api_key') {
        setSpeakingFeedback({
          score: 0,
          positive: '⚙️ Server configuration issue.',
          tip: 'The OpenAI API key is not configured. Please contact Denise.',
          suggestions: ['Contact Denise to fix the server setup', 'Try the writing activity instead'],
          overall: 'Server setup needed — contact Denise! 🔧'
        });
        setSpeakingLoading(false); setSubmitted(true); return;
      }
      if (data.error === 'invalid_api_key') {
        setSpeakingFeedback({
          score: 0,
          positive: '🔑 Invalid API key.',
          tip: 'The OpenAI API key is invalid or expired. Contact Denise to fix this.',
          suggestions: ['Contact Denise to update the API key', 'Try again after it is fixed'],
          overall: 'API key needs updating — contact Denise! 🔧'
        });
        setSpeakingLoading(false); setSubmitted(true); return;
      }
      if (data.error === 'quota_exceeded') {
        setSpeakingFeedback({
          score: 0,
          positive: '💳 Usage limit reached.',
          tip: 'The OpenAI account has reached its monthly limit. Contact Denise.',
          suggestions: ['Contact Denise to renew OpenAI credits', 'Try the writing activity instead', 'Try again tomorrow'],
          overall: 'Credits limit reached — contact Denise! 💬'
        });
        setSpeakingLoading(false); setSubmitted(true); return;
      }

      const text = (data.text || '').trim();

      if (!text || text.length < 2) {
        setSpeakingFeedback({
          score: 0,
          positive: '🎤 We could not hear you clearly.',
          tip: 'Speak louder, slower and closer to the microphone.',
          suggestions: [
            '📍 Find a quiet place with no background noise',
            '🎙️ Hold your phone very close to your mouth',
            '🔊 Speak clearly at a normal pace — not too fast!'
          ],
          overall: 'Give it another try! You can do it! 💪'
        });
        setSpeakingLoading(false); setSubmitted(true); return;
      }

      setTranscript(text);
      await getFeedback(text);

    } catch (err) {
      console.error('[speaking] Error:', err);
      setSpeakingFeedback({
        score: 0,
        positive: '🌐 Connection error.',
        tip: 'Check your internet connection and try again.',
        suggestions: ['Check your Wi-Fi or mobile data', 'Try again in a few seconds', 'Contact Denise if it persists'],
        overall: 'Connection issue — try again! 🔄'
      });
      setSpeakingLoading(false);
      setSubmitted(true);
    }
  };

  const getFeedback = async (text) => {
    try {
      const res = await fetch('/api/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          prompt: activity.prompt,
          level: student?.nivel || 'A1',
          keywords: activity.phrases,
        }),
      });
      const feedback = await res.json();
      setSpeakingFeedback(feedback);
      const xpGain = (feedback.score || 5) >= 8 ? 25 : (feedback.score || 5) >= 6 ? 15 : 8;
      saveProgress('speaking', activity.title, (feedback.score || 5) * 10, xpGain);
    } catch {
      setSpeakingFeedback({ score: 7, positive: "Good effort!", tip: "Keep practicing!", overall: "Well done! 🌟" });
    }
    setSpeakingLoading(false);
    setSubmitted(true);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // Central function: saves XP, activity, updates streak, fires storage event
  const saveProgress = (skillKey, title, score, xpGain) => {
    const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
    localStorage.setItem('ewd_xp', currentXp + xpGain);

    const acts = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
    acts.push({ skill: skillKey, title, score, time: 'Just now' });
    localStorage.setItem('ewd_activities', JSON.stringify(acts));

    // Update streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastActive = localStorage.getItem('ewd_last_active') || '';
    let streak = parseInt(localStorage.getItem('ewd_streak') || '0');
    if (lastActive !== today) {
      streak = lastActive === yesterday ? streak + 1 : 1;
      const best = parseInt(localStorage.getItem('ewd_best_streak') || '0');
      if (streak > best) localStorage.setItem('ewd_best_streak', streak);
      localStorage.setItem('ewd_streak', streak);
      localStorage.setItem('ewd_last_active', today);
    }

    // Fire storage event so Dashboard updates reactively
    window.dispatchEvent(new Event('storage'));
  };

  const handleAnswer = (qi, ai) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const [writingFeedback, setWritingFeedback] = useState(null);

  const handleSubmit = async () => {
    if (activity.type === 'multiple_choice' || activity.type === 'listening_video') {
      const correct = activity.questions.filter((q, i) => answers[i] === q.answer).length;
      const pct = Math.round((correct / activity.questions.length) * 100);
      setScore(pct);

      const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
      saveProgress(skill, activity.title, pct, xpGain);
    } else if (activity.type === 'writing') {
      const words = writingText.trim().split(/\s+/).filter(Boolean).length;
      if (words < activity.minWords) {
        setScore(30);
        setWritingFeedback({ score: 3, positive: 'Good start!', tip: `Write at least ${activity.minWords} words to get full AI feedback.`, corrections: [], suggestions: ['Add more details to your response', 'Use vocabulary from your class material', 'Expand your ideas with examples'], overall: 'Keep writing! ✍️' });
        setSubmitted(true);
        return;
      }
      try {
        const fbRes = await fetch('/api/writing-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: writingText, prompt: activity.prompt, level: student?.nivel || 'A1' })
        });
        const fb = await fbRes.json();
        setWritingFeedback(fb);
        const pct = (fb.score || 5) * 10;
        setScore(pct);
        const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
        saveProgress(skill, activity.title, pct, xpGain);
      } catch {
        setWritingFeedback({ score: 7, positive: 'Good writing effort!', tip: 'Keep practicing!', corrections: [], suggestions: ['Write every day', 'Read your text aloud', 'Check your grammar'], overall: 'Well done! 🌟' });
        setScore(70);
      }
    }
    setSubmitted(true);
  };

  const wordCount = writingText.trim().split(/\s+/).filter(Boolean).length;

  // Renders prompt text with proper formatting — splits on \n and numbers lines starting with numbers
  const renderPrompt = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
      // Numbered item like "1. something"
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={i} className="prompt-numbered-item">
            <span className="prompt-num">{line.match(/^(\d+)/)[1]}</span>
            <span>{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Bullet with •
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="prompt-bullet">
            <span className="prompt-bullet-dot">•</span>
            <span>{line.replace(/^[•\-]\s*/, '')}</span>
          </div>
        );
      }
      return <div key={i} className="prompt-line">{line}</div>;
    });
  };
  const renderDialogue = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && colonIdx < 25 && !line.startsWith('http')) {
        const name = line.substring(0, colonIdx).trim();
        const speech = line.substring(colonIdx + 1).trim();
        return (
          <div key={i} className="dialogue-line">
            <span className="dialogue-name">{name}:</span>
            <span className="dialogue-speech"> {speech}</span>
          </div>
        );
      }
      return line ? <div key={i} className="dialogue-narration">{line}</div> : <div key={i} style={{height: 8}} />;
    });
  };

  return (
    <div className="practice-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="practice-content">
        {/* Skill tabs */}
        <div className="skill-tabs">
          {Object.entries(SKILLS).map(([key, s]) => (
            <div key={key} className={`skill-tab ${skill === key ? 'active' : ''}`}
              onClick={() => {
                const params = lessonParam ? `?lesson=${encodeURIComponent(lessonParam)}` : '';
                navigate(`/practice/${key}${params}`);
                setSubmitted(false); setAnswers({}); setWritingText('');
                setTranscript(''); setSpeakingFeedback(null); setWritingFeedback(null);
                setRecordingTime(0); setActivityIndex(0);
              }}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        {/* Activity selector */}
        <div className="activity-selector">
          <div className="activity-lesson-tag">📚 {activity?.lesson || lessonParam}</div>
          <div className="activity-tabs">
            {filteredActivities.map((a, i) => (
              <div key={i}
                className={`activity-tab ${activityIndex === i ? 'active' : ''}`}
                onClick={() => {
                  setActivityIndex(i);
                  setSubmitted(false); setAnswers({}); setWritingText('');
                  setTranscript(''); setSpeakingFeedback(null); setWritingFeedback(null);
                  setRecordingTime(0);
                }}>
                Activity {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="practice-card fade-up fade-up-1">
          {/* Header */}
          <div className="practice-header">
            <div className="practice-header-left">
              <div className="practice-skill-label" style={{ color: skillData.color }}>{skillData.icon} {skillData.label}</div>
              <h2 className="practice-title">{activity.title}</h2>
              <div className="practice-meta-row">
                <span className="practice-level">{activity.level}</span>
                {activity.phase && (
                  <span className={`practice-phase ${activity.phase}`}>
                    {activity.phase === 'pre' ? '📚 Pré-aula' : '✅ Pós-aula'}
                  </span>
                )}
              </div>
            </div>
            {!submitted && (
              <div className="practice-xp-preview">
                +{skill === 'speaking' ? 25 : 20} XP
              </div>
            )}
          </div>

          {/* Reading activity */}
          {activity.type === 'multiple_choice' && skill === 'reading' && (
            <div className="reading-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">📖</span>
                <div>
                  <div className="instr-title">Read the text below</div>
                  <div className="instr-sub">Then answer the questions at the bottom.</div>
                </div>
              </div>
              <div className="reading-text">{renderDialogue(activity.text)}</div>
              <div className="questions-section">
                {activity.questions.map((q, qi) => (
                  <div key={qi} className="question-block">
                    <div className="question-text">{qi + 1}. {q.q}</div>
                    <div className="options-grid">
                      {q.options.map((opt, ai) => {
                        let cls = 'option';
                        if (submitted) {
                          if (ai === q.answer) cls += ' correct';
                          else if (answers[qi] === ai && ai !== q.answer) cls += ' wrong';
                        } else if (answers[qi] === ai) cls += ' selected';
                        return (
                          <div key={ai} className={cls} onClick={() => handleAnswer(qi, ai)}>
                            <span className="option-letter">{['A','B','C','D'][ai]}</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listening with YouTube video */}
          {activity.type === 'listening_video' && (
            <div className="listening-section">
              <div className="video-instruction">
                <span className="video-instruction-icon">🎬</span>
                <div>
                  <div className="video-instruction-title">Watch & Listen</div>
                  <div className="video-instruction-text">{activity.instruction}</div>
                </div>
              </div>
              <div className="video-timestamp-badge">
                ▶ {Math.floor(activity.startTime/60)}:{String(activity.startTime%60).padStart(2,'0')} → {Math.floor(activity.endTime/60)}:{String(activity.endTime%60).padStart(2,'0')}
              </div>
              <div className="youtube-wrap">
                <iframe
                  className="youtube-iframe"
                  src={`https://www.youtube.com/embed/${activity.youtubeId}?start=${activity.startTime}&end=${activity.endTime}&rel=0&modestbranding=1`}
                  title="Listening activity"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activity.audioText && (
                <div className="transcript-toggle-wrap">
                  <button className="transcript-toggle-btn" onClick={() => setShowAudio(!showAudio)}>
                    {showAudio ? '🙈 Hide transcript' : '📄 Show transcript'}
                  </button>
                  {showAudio && (
                    <div className="transcript-box" style={{ marginTop: 12 }}>
                      <div className="transcript-header">📝 Transcript</div>
                      {renderDialogue(activity.audioText)}
                    </div>
                  )}
                </div>
              )}
              <div className="questions-section">
                {activity.questions.map((q, qi) => (
                  <div key={qi} className="question-block">
                    <div className="question-text">{qi + 1}. {q.q}</div>
                    <div className="options-grid">
                      {q.options.map((opt, ai) => {
                        let cls = 'option';
                        if (submitted) {
                          if (ai === q.answer) cls += ' correct';
                          else if (answers[qi] === ai && ai !== q.answer) cls += ' wrong';
                        } else if (answers[qi] === ai) cls += ' selected';
                        return (
                          <div key={ai} className={cls} onClick={() => handleAnswer(qi, ai)}>
                            <span className="option-letter">{['A','B','C','D'][ai]}</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listening with transcript */}
          {activity.type === 'multiple_choice' && skill === 'listening' && (
            <div className="listening-section">
              <div className="audio-prompt">
                <div className="audio-icon">🎧</div>
                <div>
                  <div className="audio-label">Listen to the conversation</div>
                  <div className="audio-sub">Read the transcript below, then answer the questions</div>
                </div>
                <button className="show-transcript-btn" onClick={() => setShowAudio(!showAudio)}>
                  {showAudio ? 'Hide' : 'Show'} transcript
                </button>
              </div>
              {showAudio && (
                <div className="transcript-box">
                  {renderDialogue(activity.audioText)}
                </div>
              )}
              <div className="questions-section">
                {activity.questions.map((q, qi) => (
                  <div key={qi} className="question-block">
                    <div className="question-text">{qi + 1}. {q.q}</div>
                    <div className="options-grid">
                      {q.options.map((opt, ai) => {
                        let cls = 'option';
                        if (submitted) {
                          if (ai === q.answer) cls += ' correct';
                          else if (answers[qi] === ai && ai !== q.answer) cls += ' wrong';
                        } else if (answers[qi] === ai) cls += ' selected';
                        return (
                          <div key={ai} className={cls} onClick={() => handleAnswer(qi, ai)}>
                            <span className="option-letter">{['A','B','C','D'][ai]}</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writing activity */}
          {activity.type === 'writing' && (
            <div className="writing-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">✏️</span>
                <div>
                  <div className="instr-title">Write your answer below</div>
                  <div className="instr-sub">Minimum {activity.minWords} words. AI will give you detailed feedback.</div>
                </div>
              </div>
              <div className="writing-prompt-box">
                <div className="writing-prompt-label">📝 Your task</div>
                <div className="writing-prompt-text">{renderPrompt(activity.prompt)}</div>
              </div>
              <div className="writing-tips-title">💡 Tips</div>
              <div className="writing-tips">
                {activity.tips?.map((tip, i) => (
                  <div key={i} className="writing-tip">{tip}</div>
                ))}
              </div>
              <textarea
                className="writing-textarea"
                placeholder="Start writing here..."
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                disabled={submitted}
                rows={8}
              />
              <div className="word-count" style={{ color: wordCount >= activity.minWords ? '#1d9e75' : '#aaa' }}>
                {wordCount} / {activity.minWords} words minimum {wordCount >= activity.minWords ? '✓' : ''}
              </div>
            </div>
          )}

          {/* Speaking activity */}
          {activity.type === 'speaking' && (
            <div className="speaking-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">🎙️</span>
                <div>
                  <div className="instr-title">Record yourself speaking</div>
                  <div className="instr-sub">Press Start, speak clearly, then Stop. AI will transcribe and give feedback.</div>
                </div>
              </div>
              <div className="speaking-prompt-box">
                <div className="speaking-prompt-label">📋 Your task</div>
                <div className="speaking-prompt-text">{renderPrompt(activity.prompt)}</div>
              </div>
              {activity.tips?.length > 0 && (
                <>
                  <div className="speaking-tips-title">💡 Tips</div>
                  <div className="speaking-tips-list">
                    {activity.tips.map((tip, i) => (
                      <div key={i} className="speaking-tip-item">{tip}</div>
                    ))}
                  </div>
                </>
              )}
              {activity.phrases?.length > 0 && (
                <div className="speaking-phrases-box">
                  <div className="phrases-label">🗣️ Useful phrases</div>
                  <div className="phrases-grid">
                    {activity.phrases.map((p, i) => (
                      <div key={i} className="phrase-chip">"{p}"</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recorder */}
              {!submitted && !speakingLoading && (
                <div className="recorder-area">
                  {!recording && !transcript && (
                    <>
                      <button className="record-btn" onClick={startRecording}>
                        🎙️ Start Recording
                      </button>
                      <p className="recorder-note">🔒 Your audio is processed securely and not stored.</p>
                    </>
                  )}
                  {recording && (
                    <div className="recording-active">
                      <div className="recording-pulse-wrap">
                        <div className="recording-pulse" />
                        <span className="recording-live">● REC</span>
                        <span className="recording-time">{formatTime(recordingTime)}</span>
                      </div>
                      <button className="stop-btn" onClick={stopRecording}>⏹ Stop & Submit</button>
                    </div>
                  )}
                </div>
              )}

              {/* Loading */}
              {speakingLoading && (
                <div className="speaking-loading">
                  <div className="speaking-loading-steps">
                    <div className="loading-step">
                      <div className="spinner" />
                      <div>
                        <div className="loading-title">Processing your audio...</div>
                        <div className="loading-sub">Transcribing with Whisper AI, then generating feedback with GPT-4o</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript preview */}
              {transcript && !speakingLoading && !submitted && (
                <div className="transcript-result">
                  <div className="transcript-label">📝 What we heard:</div>
                  <div className="transcript-text">"{transcript}"</div>
                </div>
              )}
            </div>
          )}

          {/* Submit / Feedback */}
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit}
              disabled={( activity.type === 'multiple_choice' || activity.type === 'listening_video') && Object.keys(answers).length < activity.questions?.length}>
              Submit answers ✓
            </button>
          ) : (
            <div className="feedback-section">
              {activity.type === 'multiple_choice' && (
                <>
                  <div className={`score-display ${score >= 80 ? 'great' : score >= 50 ? 'ok' : 'low'}`}>
                    <div className="score-num">{score}%</div>
                    <div className="score-label">{score >= 80 ? '🌟 Excellent!' : score >= 50 ? '👍 Good job!' : '💪 Keep practicing!'}</div>
                    <div className="score-detail">
                      {activity.questions.filter((q, i) => answers[i] === q.answer).length} / {activity.questions.length} correct
                    </div>
                  </div>
                  <div className="xp-earned">+{score >= 80 ? 20 : score >= 50 ? 10 : 5} XP earned! 🎉</div>
                </>
              )}
              {activity.type === 'writing' && (
                <div className={`score-display ${score >= 80 ? 'great' : score >= 50 ? 'ok' : 'low'}`}>
                  {writingFeedback ? (
                    <>
                      <div className="score-num">{writingFeedback.score}<span style={{fontSize:20,color:'#aaa'}}>/10</span></div>
                      <div className="fb-box positive" style={{textAlign:'left',marginTop:12}}>
                        <div className="fb-label">✅ What you did well</div>
                        <div className="fb-text">{writingFeedback.positive}</div>
                      </div>
                      {writingFeedback.errors?.length > 0 && (
                        <div className="fb-box errors" style={{textAlign:'left',marginTop:8}}>
                          <div className="fb-label">🔧 Errors to fix</div>
                          {writingFeedback.errors.map((e,i) => (
                            <div key={i} className="fb-error-item">{e}</div>
                          ))}
                        </div>
                      )}
                      {writingFeedback.suggestions?.length > 0 && (
                        <div className="speaking-suggestions" style={{marginTop:8}}>
                          <div className="fb-label" style={{marginBottom:8}}>🎯 Your 3 practice exercises</div>
                          {writingFeedback.suggestions.map((s,i) => <div key={i} className="suggestion-item">{s}</div>)}
                        </div>
                      )}
                      <div className="xp-earned" style={{marginTop:12}}>{writingFeedback.overall}</div>
                    </>
                  ) : (
                    <div className="score-label">{score >= 80 ? activity.feedback?.excellent : score >= 50 ? activity.feedback?.good : activity.feedback?.needsWork}</div>
                  )}
                </div>
              )}
              {activity.type === 'speaking' && speakingFeedback && (
                <div className="speaking-feedback">
                  <div className="speaking-score-row">
                    <div className="speaking-score">{speakingFeedback.score}<span>/10</span></div>
                    <div className="speaking-overall">{speakingFeedback.overall}</div>
                  </div>
                  <div className="speaking-feedback-box positive">
                    <div className="fb-label">✅ What you did well</div>
                    <div className="fb-text">{speakingFeedback.positive}</div>
                  </div>
                  {speakingFeedback.errors?.length > 0 && (
                    <div className="fb-box errors" style={{marginTop:10}}>
                      <div className="fb-label">🔧 Errors to fix</div>
                      {speakingFeedback.errors.map((e,i) => (
                        <div key={i} className="fb-error-item">{e}</div>
                      ))}
                    </div>
                  )}
                  <div className="speaking-feedback-box tip" style={{marginTop:10}}>
                    <div className="fb-label">💡 Main area to improve</div>
                    <div className="fb-text">{speakingFeedback.tip}</div>
                  </div>
                  {speakingFeedback.suggestions?.length > 0 && (
                    <div className="speaking-suggestions">
                      <div className="fb-label" style={{ marginBottom: 10 }}>🎯 Your 3 practice exercises</div>
                      {speakingFeedback.suggestions.map((s, i) => (
                        <div key={i} className="suggestion-item">{s}</div>
                      ))}
                    </div>
                  )}
                  <div className="xp-earned">+{(speakingFeedback.score || 5) >= 8 ? 25 : (speakingFeedback.score || 5) >= 6 ? 15 : 8} XP earned! 🎉</div>
                </div>
              )}
              <button className="try-again-btn" onClick={() => { setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setWritingFeedback(null); setRecordingTime(0); }}>
                Try another activity →
              </button>
              <button className="back-btn" onClick={() => navigate(`/hub?skill=${skill}`)}>← Back to Practice Hub</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
