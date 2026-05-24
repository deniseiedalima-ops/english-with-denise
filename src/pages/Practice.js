import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Practice.css';

const SKILLS = {
  reading: {
    label: 'Reading', icon: '📖', color: '#1d9e75',
    activities: [
      {
        id: 'r1', title: 'The Greetings — Mark & Julia', level: 'A1',
        type: 'multiple_choice',
        lesson: 'The Greetings',
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
        type: 'multiple_choice',
        lesson: 'The Greetings',
        text: `Study these greetings from your class:\n\n🌅 MORNING: "Good morning!" / "Morning!"\n☀️ AFTERNOON: "Good afternoon!" / "Afternoon, people!"\n🌙 EVENING/ARRIVAL: "Good evening!"\n🌛 LEAVING AT NIGHT: "Good night!"\n\nHow to ask how someone is:\n"How are you?" → "I'm good, thanks!"\n"What's up?" → "Not much! And you?"\n"How's it going?" → "Pretty good! And you?"\n"You good?" → "Yeah, all good!"\n\nSaying goodbye:\n"See you later!" / "Take care!" / "Have a good day!"`,
        questions: [
          { q: 'You arrive at a party at 8 PM. What do you say?', options: ['Good morning!', 'Good night!', 'Good evening!', 'Goodbye!'], answer: 2 },
          { q: 'Someone asks "What\'s up?" — what is the best answer?', options: ['I\'m Julia.', 'Not much! And you?', 'Good afternoon!', 'Take care!'], answer: 1 },
          { q: 'You are leaving work late at night. What do you say?', options: ['Good morning!', 'Good evening!', 'Good night!', 'See you!'], answer: 2 },
          { q: 'Which greeting is INFORMAL?', options: ['Good afternoon.', 'How do you do?', 'Morning!', 'Good evening, sir.'], answer: 2 },
        ]
      },
      {
        id: 'r3', title: 'The Greetings — Verb To Be', level: 'A1',
        type: 'multiple_choice',
        lesson: 'The Greetings',
        text: `From your class material, review the verb TO BE:\n\nI am → eu sou / eu estou\nYou are → você é / você está\nHe is → ele é / ele está\nShe is → ela é / ela está\nIt is → a coisa é / está\nThey are → eles/elas são/estão\n\nExamples in greetings:\n"I'm Julia." (I am Julia)\n"I'm good, thanks!" (I am good)\n"I'm from New York." (I am from New York)\n"She is the assistant editor." (She is = ela é)`,
        questions: [
          { q: 'Complete: "___ Mark. Nice to meet you!"', options: ['He am', 'I\'m', 'She is', 'They are'], answer: 1 },
          { q: 'Complete: "How ___ you?"', options: ['am', 'is', 'are', 'be'], answer: 2 },
          { q: '"I\'m good" is a short form of...', options: ['I were good', 'I is good', 'I am good', 'I be good'], answer: 2 },
          { q: 'Which sentence is CORRECT?', options: ['She am happy.', 'They is fine.', 'He are Mark.', 'I am Julia.'], answer: 3 },
        ]
      },
      // ─── L3: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'r4', title: 'Meet Elizabeth & John', level: 'A1',
        type: 'multiple_choice',
        lesson: 'The Introductions',
        text: `Elizabeth: Hello! My name is Elizabeth. Nice to meet you!\nJohn: Nice to meet you too! I'm John. Where are you from, Elizabeth?\nElizabeth: I'm from Spain. My teacher is over there — her name is Ms. Garcia.\nJohn: Oh, is that her bag on the desk here?\nElizabeth: Yes! That's her bag. And his name is Carlos — he's a student too.\nJohn: Where is the classroom?\nElizabeth: It's over there, on the left. You're welcome to sit here!\nJohn: Thank you! His name is Carlos, you said? And her name is Ms. Garcia?\nElizabeth: That's right! Welcome to our class, John!`,
        questions: [
          { q: 'Where is Elizabeth from?', options: ['Brazil', 'Spain', 'France', 'The USA'], answer: 1 },
          { q: '"Her name is Ms. Garcia" — what does HER mean here?', options: ['The student\'s (male)', 'The teacher\'s (female)', 'John\'s', 'Elizabeth\'s brother\'s'], answer: 1 },
          { q: 'What does "It\'s over there" mean?', options: ['It\'s very close', 'It\'s in that direction (far)', 'It\'s here with us', 'It\'s lost'], answer: 1 },
          { q: '"You\'re welcome to sit here" — what does HERE mean?', options: ['Far away', 'In this place, close to me', 'Somewhere else', 'Outside the classroom'], answer: 1 },
        ]
      },
      {
        id: 'r5', title: 'Here, There & Whose? — Grammar Focus', level: 'A1',
        type: 'multiple_choice',
        lesson: 'The Introductions',
        text: `FROM YOUR CLASS — Key vocabulary:\n\nHERE = aqui (close to the speaker)\nTHERE / OVER THERE = lá, ali (far from the speaker)\nWHERE = onde (question word)\n\nHIS = dele (for men/boys)\nHER = dela (for women/girls)\n\nExamples:\nHer name is Elizabeth. (the girl's name)\nHis name is John. (the boy's name)\nThe classroom is over there. (pointing far)\nCome here! (pointing close)\nWhere are you from? (asking location)\n\nYou're welcome = de nada (response to "thank you")`,
        questions: [
          { q: 'Complete: "___ name is Carlos. He\'s a student."', options: ['Her', 'Their', 'His', 'Where'], answer: 2 },
          { q: 'Complete: "The bathroom is ___ , at the end of the hall."', options: ['here', 'over there', 'welcome', 'his'], answer: 1 },
          { q: '"Where are you from?" — what kind of word is WHERE?', options: ['A name', 'A question word', 'A pronoun', 'An article'], answer: 1 },
          { q: '"Thank you so much!" — "___!"', options: ['Here you are', 'Over there', 'You\'re welcome', 'His name'], answer: 2 },
        ]
      },
    ]
  },
  listening: {
    label: 'Listening', icon: '🎧', color: '#378add',
    activities: [
      {
        id: 'l1', title: 'Jenny at the Hotel', level: 'A1',
        type: 'listening_video',
        lesson: 'The Greetings',
        youtubeId: 'EflkHGJbxnA',
        startTime: 56,
        endTime: 286,
        instruction: 'Watch the video from 0:56 to 4:46. Pay attention to how Jenny greets the receptionist, spells her name, and checks in. Then answer the questions below!',
        questions: [
          { q: 'What is Jenny\'s last name?', options: ['Zelinski', 'Zielinski', 'Zielinsky', 'Zielinksi'], answer: 1 },
          { q: 'How many nights is Jenny staying?', options: ['3 nights', '4 nights', '5 nights', '6 nights'], answer: 2 },
          { q: 'What room does Jenny get?', options: ['Room 306', 'Room 360', 'Room 603', 'Room 316'], answer: 0 },
          { q: 'What does "lift" mean?', options: ['Stairs', 'Reception', 'Elevator', 'Exit'], answer: 2 },
        ]
      },
      {
        id: 'l2', title: 'Meet Sarah!', level: 'A1',
        type: 'listening_video',
        lesson: 'The Greetings',
        youtubeId: 'fLYzVdpseSA',
        startTime: 0,
        endTime: 60,
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
        type: 'listening_video',
        lesson: 'The Greetings',
        youtubeId: '31y2Bq1RYQA',
        startTime: 60,
        endTime: 297,
        instruction: 'Watch Tim, Sian, Buli and Georgie talk about where they are from and where they live. Pay attention to the names, cities and how they describe their homes. Then answer the questions!',
        audioText: `Tim: Hi, I'm Tim. I'm from Oxford.\nSian: I'm from Swansea.\nBuli: I'm from Beijing.\nGeorgie: I'm from Petworth.\nTim: I live in a house in London. And I live with my housemates.\nSian: I live in a house in Brighton. I live with my family.\nBuli: I live in a flat in Cambridge. I live on my own.\nGeorgie: I live in a flat in London. I live with my flatmates.`,
        questions: [
          { q: 'Where is Sian from originally?', options: ['Oxford', 'Beijing', 'Swansea', 'Petworth'], answer: 2 },
          { q: 'Where does Buli live now?', options: ['London', 'Brighton', 'Oxford', 'Cambridge'], answer: 3 },
          { q: 'Who lives in a flat?', options: ['Tim and Sian', 'Sian and Georgie', 'Buli and Georgie', 'Tim and Buli'], answer: 2 },
          { q: 'Who does Sian live with?', options: ['Her flatmates', 'On her own', 'Her housemates', 'Her family'], answer: 3 },
        ]
      },
      // ─── L3: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'l4', title: 'Elizabeth & John — Full Introduction', level: 'A1',
        type: 'listening_video',
        lesson: 'The Introductions',
        youtubeId: 'YGTEXtptvGM',
        startTime: 0,
        endTime: 182,
        instruction: 'Watch Elizabeth and John introduce themselves. Pay attention to their names, ages, countries, jobs and hobbies. Then answer the questions!',
        audioText: `Elizabeth: Hello hello!\nJohn: Hello hello!\nElizabeth: How are you?\nJohn: I am fine thanks. What about you?\nElizabeth: I am okay! What's your name?\nJohn: My name is John. What is your name?\nElizabeth: My name is Elizabeth. Nice to meet you, John!\nJohn: Nice to meet you too, Elizabeth! How old are you?\nElizabeth: I am 21 years old. What about you?\nJohn: I am 23 years old. Where are you from, Elizabeth?\nElizabeth: I am from Spain. I am Spanish. I live in Madrid. What about you?\nJohn: I am from the United States of America. I am an American. I live in New York.\nElizabeth: Do you speak Spanish?\nJohn: No, I don't speak Spanish. I speak English and French. Do you speak French?\nElizabeth: Really? I also speak French!\nJohn: I am a businessman. What about you?\nElizabeth: I am a teacher. I teach Spanish in a high school. What's your favorite sport?\nJohn: I like football. I am a big fan of Real Madrid football club. What about you?\nElizabeth: My favorite sport is baseball. I am a big fan of New York Yankees. I also play baseball with my friends on weekends.\nJohn: That sounds nice! It has been a pleasure to meet you, Elizabeth!\nElizabeth: I am also glad to meet you. I hope to see you soon! Bye!\nJohn: See you later! Bye!`,
        questions: [
          { q: 'How old is Elizabeth?', options: ['19 years old', '21 years old', '23 years old', '25 years old'], answer: 1 },
          { q: 'Where is John from?', options: ['Spain', 'France', 'The United States', 'England'], answer: 2 },
          { q: 'What is Elizabeth\'s job?', options: ['A businesswoman', 'A doctor', 'A teacher', 'A student'], answer: 2 },
          { q: 'What is John\'s favorite sport?', options: ['Baseball', 'Football', 'Basketball', 'Tennis'], answer: 1 },
        ]
      },
      {
        id: 'l5', title: 'Introducing Yourself — ESL Practice', level: 'A1',
        type: 'listening_video',
        lesson: 'The Introductions',
        youtubeId: 'P3VcHnECgbs',
        startTime: 0,
        endTime: 75,
        instruction: 'Watch this ESL video about introducing yourself. Pay attention to the key phrases and expressions used. Then answer the questions!',
        audioText: `Narrator: How do you introduce yourself in English?\nSpeaker 1: Hi! My name is Anna. Nice to meet you!\nSpeaker 2: Hello! I'm David. Where are you from, Anna?\nAnna: I'm from Brazil. And you?\nDavid: I'm from Canada. What do you do?\nAnna: I'm a student. What about you?\nDavid: I'm an engineer. It's great to meet you!\nAnna: You too! See you around!`,
        questions: [
          { q: 'What phrase means the same as "Nice to meet you"?', options: ['See you later!', 'It\'s great to meet you!', 'How are you?', 'Where are you from?'], answer: 1 },
          { q: 'What does "What do you do?" mean?', options: ['What are you doing right now?', 'What is your hobby?', 'What is your job?', 'What did you do yesterday?'], answer: 2 },
          { q: '"I\'m a student" uses the article "a" because...', options: ['Student starts with "s"', 'Student is a consonant sound', 'Student is a vowel sound', 'There is no rule'], answer: 1 },
          { q: 'What is the correct way to ask where someone is from?', options: ['"Where you are from?"', '"Where are from you?"', '"Where are you from?"', '"You are from where?"'], answer: 2 },
        ]
      },
    ]
  },
  writing: {
    label: 'Writing', icon: '✏️', color: '#7f77dd',
    activities: [
      {
        id: 'w1', title: 'Write Your Own Greeting Dialogue', level: 'A1',
        type: 'writing',
        lesson: 'The Greetings',
        prompt: 'Write a short dialogue (conversation) between two people meeting for the first time. Include: a greeting, asking and saying names, spelling at least one name, asking how they are, and saying goodbye. Use vocabulary from The Greetings class!',
        minWords: 40,
        tips: [
          'Start with a greeting: "Good morning!" / "Hi!" / "Hey!"',
          'Ask the name: "What\'s your name?" → "I\'m ___."',
          'Spell a name: "How do you spell that?" → "It\'s M-A-R-K."',
          'Ask how they are: "How are you?" → "I\'m good, thanks!"',
          'Say goodbye: "See you later!" / "Take care!" / "Have a good day!"'
        ],
        feedback: {
          excellent: "Excellent dialogue! You used greetings, introductions and farewells perfectly. Your English is growing! 🌟",
          good: "Good job! Your dialogue flows naturally. Try to add more expressions from class next time!",
          needsWork: "Nice start! Make sure to include a greeting, name exchange, and goodbye. Check your class material for ideas!"
        }
      },
      {
        id: 'w2', title: 'How Are You? — Write Your Answers', level: 'A1',
        type: 'writing',
        lesson: 'The Greetings',
        prompt: 'Someone asks you these 3 questions. Write a natural answer for each one using expressions from your class:\n1. "How are you today?"\n2. "What\'s up?"\n3. "How\'s everything?"\n\nThen write 2 more sentences about your day using "I am" or "I\'m".',
        minWords: 35,
        tips: [
          'Use different answers — don\'t repeat the same one!',
          'For "How are you?" try: "I\'m good, thanks! And you?"',
          'For "What\'s up?" try: "Not much! Pretty good day!"',
          'Add details: "I\'m a little tired but happy!"',
          'Remember: I am = I\'m (contraction)'
        ],
        feedback: {
          excellent: "Wonderful! You used a great variety of expressions and the verb TO BE correctly. Keep it up! 🌟",
          good: "Good work! You answered naturally. Try to vary your expressions even more next time!",
          needsWork: "Good try! Remember to answer each of the 3 questions and use I'm/I am in your sentences."
        }
      },
      {
        id: 'w3', title: 'Formal or Informal? — Rewrite It!', level: 'A1',
        type: 'writing',
        lesson: 'The Greetings',
        prompt: 'Rewrite these sentences. Make them the OPPOSITE style:\n\n1. INFORMAL → make it FORMAL:\n"Hey! What\'s up? You good?"\n\n2. FORMAL → make it INFORMAL:\n"Good morning. How do you do? It is a pleasure to meet you."\n\n3. Write 3 sentences to say goodbye — 1 formal, 1 informal, 1 your choice!',
        minWords: 30,
        tips: [
          'FORMAL: "Good morning", "How do you do?", "It\'s a pleasure"',
          'INFORMAL: "Hey!", "What\'s up?", "You good?", "Later!", "See ya!"',
          'Formal goodbye: "Have a good day. Goodbye."',
          'Informal goodbye: "Later! Take care! See ya!"',
          'Think about WHERE you use each — office vs. friends'
        ],
        feedback: {
          excellent: "Excellent! You perfectly understand the difference between formal and informal English. This is so important! 🌟",
          good: "Good job! You're getting the hang of formal vs informal. Practice more to make it feel natural!",
          needsWork: "Good try! Remember: formal = complete sentences and polite words. Informal = short, casual, relaxed!"
        }
      },
      // ─── L3: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'w4', title: 'Introduce Yourself in Writing', level: 'A1',
        type: 'writing',
        lesson: 'The Introductions',
        prompt: 'Write a short self-introduction in English! Include:\n• Your name\n• Where you are from\n• Your age\n• What you do (job or study)\n• One thing you like\n\nUse the words from class: here, where, his/her name is. Minimum 15 words.',
        minWords: 15,
        tips: [
          '"My name is ___. Nice to meet you!"',
          '"I am from ___. I live in ___."',
          '"I am ___ years old."',
          '"I am a student / teacher / ___."',
          '"I like ___ and ___."',
        ],
        feedback: {
          excellent: "Fantastic introduction! You used the vocabulary perfectly and your sentences are clear and natural! 🌟",
          good: "Good job! Your introduction is clear. Try to add more details using 'here', 'where' and 'his/her name is'!",
          needsWork: "Good start! Remember to include your name, where you're from, your age and what you do. Check the tips!"
        }
      },
      {
        id: 'w5', title: 'Describe Someone You Know', level: 'A1',
        type: 'writing',
        lesson: 'The Introductions',
        prompt: 'Write about someone you know — a friend, family member or classmate. Use:\n• His name is / Her name is\n• He is / She is (age, job, where from)\n• He lives / She lives\n• He likes / She likes\n\nMinimum 20 words. Try to use "here", "where" and "there" in your sentences!',
        minWords: 20,
        tips: [
          '"Her name is Ana. She is my friend."',
          '"His name is Carlos. He is 25 years old."',
          '"She is from Rio. She lives here in São Paulo."',
          '"He works over there, near the school."',
          '"Where is she from? She is from ___."',
        ],
        feedback: {
          excellent: "Excellent! You used his/her, here/there perfectly and your description is vivid and clear! 🌟",
          good: "Good work! Try to include 'here', 'there' or 'where' to practice the target vocabulary from class!",
          needsWork: "Good try! Remember: use 'His name is' for men and 'Her name is' for women. Add where they are from!"
        }
      },
          '"I am a student / teacher / doctor..."',
          '"I like / I enjoy ___."',
        ],
        feedback: {
          excellent: 'Excellent introduction! You used vocabulary from class naturally. 🌟',
          good: 'Good job! Try to add more details — where are you from? What do you like?',
          needsWork: 'Good start! Remember to include your name, where you\'re from, and something about yourself.',
        }
      },
      {
        id: 'w5', title: 'His, Her & Where — Write It Right', level: 'A1',
        type: 'writing',
        lesson: 'The Introductions',
        prompt: 'Write 4 sentences using HIS and HER correctly, then write 2 sentences using HERE and OVER THERE. Finally, write a short dialogue where someone asks WHERE you are from and you answer. Minimum 20 words.\n\nExample:\n"Her name is Ana. His name is Pedro.\nThe book is here. The door is over there.\nA: Where are you from? B: I\'m from Brazil!"',
        minWords: 20,
        tips: [
          'HIS = for men/boys: "His name is John."',
          'HER = for women/girls: "Her name is Maria."',
          'HERE = close to you: "The pen is here."',
          'OVER THERE = far: "The board is over there."',
          'WHERE = question: "Where are you from?"',
        ],
        feedback: {
          excellent: 'Perfect! You used his/her, here/there and where correctly. Great work! 🌟',
          good: 'Good! Check your his/her — remember: HIS for men, HER for women.',
          needsWork: 'Keep practicing! HIS = dele, HER = dela, HERE = aqui, THERE = lá.',
        }
      },
        prompt: 'Write a dialogue between two students meeting at school for the first time. Include: names and nicknames, spelling of at least one name, asking if they\'re in the same class, the teacher\'s name, and where the classroom is. Use vocabulary from The Introductions class! Minimum 50 words.',
        minWords: 50,
        tips: [
          '"Excuse me, hi! My name is ___."',
          '"My friends call me ___." — add a nickname!',
          '"Are you a student here? / Yes, I am!"',
          '"She is my teacher too! You are in my class!"',
          '"Where is our class?" / "It\'s over there!"'
        ],
        feedback: {
          excellent: "Excellent! Your dialogue sounds natural and includes all the key vocabulary. You're making great progress! 🌟",
          good: "Good job! Your dialogue has good structure. Try to add more details like spelling names or asking about the classroom!",
          needsWork: "Good start! Remember to include: names, class info, and where the classroom is. Use the Molly & Peter dialogue as a model!"
        }
      },
      {
        id: 'w5', title: 'Verb To Be — Complete & Create', level: 'A1',
        type: 'writing',
        lesson: 'The Introductions',
        prompt: 'Complete these sentences with the correct form of TO BE (am/is/are), then make them negative. Finally, write 4 original sentences about yourself using TO BE:\n\n1. She ___ a doctor.\n2. They ___ very happy today.\n3. I ___ at home right now.\n4. He ___ from Brazil.\n\nNow make sentences 1-4 negative. Then write 4 sentences about yourself!',
        minWords: 45,
        tips: [
          'I → am / She/He/It → is / You/We/They → are',
          'Negative: am not / isn\'t / aren\'t',
          '"She is a doctor." → "She is not a doctor." / "She isn\'t a doctor."',
          'For yourself: "I am a student." / "I am from ___." / "I am not tired."'
        ],
        feedback: {
          excellent: "Perfect! You mastered the verb TO BE in affirmative and negative. Your personal sentences are creative! 🌟",
          good: "Good work! Check your negatives — remember: isn\'t = is not, aren\'t = are not. Keep practicing!",
          needsWork: "Good try! Remember: I=am, He/She/It=is, You/We/They=are. Try again with the negatives!"
        }
      },
      {
        id: 'w6', title: 'A or AN? — Write Your Own Sentences', level: 'A1',
        type: 'writing',
        lesson: 'The Introductions',
        prompt: 'Write 8 sentences using A or AN correctly. Use professions and nouns from your class:\n\nProfessions to use: teacher, doctor, actor, nurse, engineer, astronaut, artist, student\n\nExample: "She is a teacher." / "He is an actor."\n\nThen write 3 sentences about people you know using "His/Her name is ___ and he/she is ___."',
        minWords: 40,
        tips: [
          'A + consonant sound: a teacher, a doctor, a nurse, a student',
          'AN + vowel sound: an actor, an artist, an engineer, an astronaut',
          '"His name is João and he is a doctor."',
          '"Her name is Ana and she is an engineer."',
          'Check: does the next word start with a vowel sound (a,e,i,o,u)?'
        ],
        feedback: {
          excellent: "Excellent! You used A and AN perfectly. Your sentences about people you know are wonderful! 🌟",
          good: "Good job! Check your A/AN choices — remember it\'s about the SOUND, not just the letter. Keep it up!",
          needsWork: "Good try! Remember: use AN before vowel sounds (actor, artist, engineer). Use A before consonant sounds (teacher, doctor)."
        }
      },
    ]
  },
  speaking: {
    label: 'Speaking', icon: '🎙️', color: '#d4537e',
    activities: [
      {
        id: 's1', title: 'Introduce Yourself!', level: 'A1',
        type: 'speaking',
        lesson: 'The Greetings',
        prompt: 'Imagine you are meeting someone new. Record yourself doing a complete greeting: say hello, give your name, spell it, say where you are from, ask how they are, and say goodbye. Speak naturally — like in the Mark & Julia dialogue from class!',
        tips: [
          'Start with a greeting: "Good morning!" or "Hi!"',
          'Say your name: "My name is ___ / I\'m ___"',
          'Spell it: "It\'s spelled ___"',
          'Ask: "How are you?" and answer back',
          'End with: "Nice to meet you! Have a good day!"'
        ],
        phrases: ['Good morning! My name is...', 'It\'s spelled...', 'Nice to meet you!', 'How are you?', 'I\'m good, thanks! And you?', 'Have a good day! Take care!']
      },
      {
        id: 's2', title: 'How Are You? — 5 Different Ways!', level: 'A1',
        type: 'speaking',
        lesson: 'The Greetings',
        prompt: 'Record yourself saying 5 different ways to ask "how are you?" and 5 different ways to answer. Use the vocabulary from your class! Try to sound natural — not like you\'re reading a list. Imagine you\'re texting a friend, then talking to your boss!',
        tips: [
          'Formal ways: "How are you today?" / "How have you been?"',
          'Informal ways: "What\'s up?" / "You good?" / "All good?"',
          'Formal answers: "I\'m well, thank you. And you?"',
          'Informal answers: "Not bad!" / "Pretty good!" / "All good!"',
          'Try to sound natural — smile while you speak!'
        ],
        phrases: ['How are you today?', 'What\'s up?', 'How\'s everything?', 'I\'m good, thanks!', 'Pretty good! And you?', 'Not much! You?', 'All good!', 'Doing well, thanks!']
      },
      {
        id: 's3', title: 'Role Play — Checking In at a Hotel', level: 'A1',
        type: 'speaking',
        lesson: 'The Greetings',
        prompt: 'You are Jenny from the listening exercise. You are checking into a hotel. Record yourself playing Jenny\'s part in the conversation: greet the receptionist, say your name, spell it, confirm your reservation, and thank them. Use "here you are", "that\'s right", and "thank you"!',
        tips: [
          'Start with: "Hello! Good evening."',
          'Say: "I have a reservation. My name is ___."',
          'Spell your name letter by letter',
          'Confirm details: "Yes, that\'s right."',
          'Be polite: "Here you are." / "Thank you very much!"'
        ],
        phrases: ['Hello! Good evening.', 'I have a reservation.', 'My name is... it\'s spelled...', 'Yes, that\'s right.', 'Here you are.', 'Thank you very much!', 'Have a good evening!']
      },

      // ─── L3: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 's4', title: 'Introduce Yourself!', level: 'A1',
        type: 'speaking',
        lesson: 'The Introductions',
        prompt: 'Record yourself doing a complete self-introduction in English — just like John and Elizabeth in the video! Say your name, where you are from, your age, what you do, and one thing you like. Speak for at least 30 seconds. Try to sound natural!',
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
        id: 's5', title: 'Where Are You From?', level: 'A1',
        type: 'speaking',
        lesson: 'The Introductions',
        prompt: 'Practice the key vocabulary from class! Record yourself using each of these words in a sentence:\n\n1. HERE — say where something is\n2. OVER THERE — point to something far\n3. WHERE — ask a question\n4. HIS NAME IS — talk about a man you know\n5. HER NAME IS — talk about a woman you know\n6. YOU\'RE WELCOME — respond to a thank you\n\nSpeak clearly and try to create real, natural sentences!',
        tips: [
          '"My bag is here. The door is over there."',
          '"Where are you from? Where do you live?"',
          '"His name is ___ . He is my friend."',
          '"Her name is ___. She is my teacher."',
          '"Thank you!" → "You\'re welcome!"',
        ],
        phrases: ['Here!', 'Over there!', 'Where are you from?', 'His name is...', 'Her name is...', 'You\'re welcome!', 'It\'s right here!', 'It\'s over there!']
      },
          'HER = about a woman or girl you know',
          'Speak slowly and clearly!',
        ],
        phrases: ['___ is here.', '___ is over there.', 'His name is...', 'Her name is...', 'Where is the ___?', 'It\'s over there!']
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      alert('Could not access microphone. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const transcribeAudio = async (blob) => {
    setSpeakingLoading(true);
    console.log('Audio blob size:', blob.size, 'type:', blob.type);
    
    try {
      if (blob.size < 1000) {
        setTranscript('');
        setSpeakingFeedback({ 
          score: 0, 
          positive: '🎤 Audio not captured!', 
          tip: 'Make sure your microphone is allowed in the browser. Click the 🔒 icon in the address bar and allow microphone access, then try again!', 
          overall: 'Microphone issue — please check your settings!' 
        });
        setSpeakingLoading(false);
        setSubmitted(true);
        return;
      }

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'audio/webm' },
        body: blob,
      });
      const data = await res.json();
      console.log('Transcription result:', data);
      
      const text = data.text || '';
      
      if (!text || text.trim().length < 2) {
        setTranscript('');
        setSpeakingFeedback({ 
          score: 0, 
          positive: '🎤 We could not hear anything!', 
          tip: 'Speak louder and closer to the microphone. Make sure there is no background noise. Try again!', 
          overall: 'No speech detected — give it another try! 💪' 
        });
        setSpeakingLoading(false);
        setSubmitted(true);
        return;
      }

      setTranscript(text);
      await getFeedback(text);
    } catch (err) {
      console.error('Transcription error:', err);
      setTranscript('');
      setSpeakingFeedback({ 
        score: 0, 
        positive: 'Connection error.', 
        tip: 'Check your internet connection and try again.', 
        overall: 'Something went wrong — please try again! 🔄' 
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

  // Helper: renders dialogue text with bold character names
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
            <div>
              <div className="practice-skill-label" style={{ color: skillData.color }}>{skillData.icon} {skillData.label}</div>
              <h2 className="practice-title">{activity.title}</h2>
              <span className="practice-level">{activity.level}</span>
            </div>
            {!submitted && (
              <div className="practice-xp-preview">+20 XP</div>
            )}
          </div>

          {/* Reading activity */}
          {activity.type === 'multiple_choice' && skill === 'reading' && (
            <div className="reading-section">
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
              <div className="writing-prompt-box">
                <div className="writing-prompt-label">📝 Your task</div>
                <div className="writing-prompt-text">{activity.prompt}</div>
              </div>
              <div className="writing-tips">
                {activity.tips.map((tip, i) => (
                  <div key={i} className="writing-tip">💡 {tip}</div>
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
              <div className="speaking-prompt-box">
                <div className="speaking-prompt-label">🎙️ Your task</div>
                <div className="speaking-prompt-text">{activity.prompt}</div>
              </div>
              <div className="speaking-phrases">
                <div className="phrases-label">Useful phrases:</div>
                {activity.phrases.map((p, i) => (
                  <div key={i} className="phrase-item">"{p}"</div>
                ))}
              </div>
              <div className="speaking-tips">
                {activity.tips.map((tip, i) => (
                  <div key={i} className="writing-tip">💡 {tip}</div>
                ))}
              </div>

              {/* Recorder */}
              {!submitted && !speakingLoading && (
                <div className="recorder-area">
                  {!recording && !transcript && (
                    <button className="record-btn" onClick={startRecording}>
                      <span className="record-dot" />
                      Start Recording
                    </button>
                  )}
                  {recording && (
                    <div className="recording-active">
                      <div className="recording-pulse" />
                      <span className="recording-time">{formatTime(recordingTime)}</span>
                      <button className="stop-btn" onClick={stopRecording}>⏹ Stop</button>
                    </div>
                  )}
                  <p className="recorder-note">🔒 Your audio is processed securely and not stored.</p>
                </div>
              )}

              {/* Loading */}
              {speakingLoading && (
                <div className="speaking-loading">
                  <div className="spinner" />
                  <span>Analyzing your speaking... ✨</span>
                </div>
              )}

              {/* Transcript */}
              {transcript && !speakingLoading && (
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
                      {writingFeedback.corrections?.length > 0 && (
                        <div className="fb-box tip" style={{textAlign:'left',marginTop:8}}>
                          <div className="fb-label">🔧 Corrections</div>
                          {writingFeedback.corrections.map((c,i) => <div key={i} className="fb-text" style={{fontFamily:'monospace',fontSize:12,marginTop:4}}>{c}</div>)}
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
                  <div className="speaking-feedback-box tip">
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
