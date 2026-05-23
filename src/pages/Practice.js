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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
        text: `From your class material, review the verb TO BE:\n\nI am → eu sou / eu estou\nYou are → você é / você está\nHe is → ele é / ele está\nShe is → ela é / ela está\nIt is → a coisa é / está\nThey are → eles/elas são/estão\n\nExamples in greetings:\n"I'm Julia." (I am Julia)\n"I'm good, thanks!" (I am good)\n"I'm from New York." (I am from New York)\n"She is the assistant editor." (She is = ela é)`,
        questions: [
          { q: 'Complete: "___ Mark. Nice to meet you!"', options: ['He am', 'I\'m', 'She is', 'They are'], answer: 1 },
          { q: 'Complete: "How ___ you?"', options: ['am', 'is', 'are', 'be'], answer: 2 },
          { q: '"I\'m good" is a short form of...', options: ['I were good', 'I is good', 'I am good', 'I be good'], answer: 2 },
          { q: 'Which sentence is CORRECT?', options: ['She am happy.', 'They is fine.', 'He are Mark.', 'I am Julia.'], answer: 3 },
        ]
      },
      // ─── L4: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'r4', title: 'Molly & Peter at School', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        text: `Molly: Excuse me, hi, my name is Molly. What's your name?\nPeter: I'm Peter! My friends call me Pete.\nMolly: My friends call me… Molly! Haha. Hi Pete, it's nice to meet you!\nPeter: It's nice to meet you too.\nMolly: Are you a student here?\nPeter: Yes, I am! My class is at 9 o'clock with Miss Taylor.\nMolly: Miss Taylor! She is my teacher! You are in my class!\nPeter: Great!\nMolly: Where is our class?\nPeter: It's over there…\nPeter: Hi! I'm Peter. Peter Crumb! I'm in your class!\nMs. Smith: Hi Peter, nice to meet you! Hello, what's your name?\nMolly: I'm Molly! I'm in your class too!\nMs. Smith: Hello, Holly! Is that H-O-L-L-Y?\nMolly: No, it's Molly, M-O-L-L-Y.\nMs. Smith: M-O-L-L-Y, Molly! What's your last name Molly?\nMolly: LIN! L-I-N.\nPeter: Excuse me… are you Miss Taylor?\nMs. Smith: No I'm not! I'm Miss Smith. Miss Taylor is in room 203 over there.\nPeter: Oh, thanks! Goodbye!\nMs. Smith: Have a good day!`,
        questions: [
          { q: 'What does Peter\'s friends call him?', options: ['Peter', 'Pete', 'Pat', 'Pierre'], answer: 1 },
          { q: 'What time is Peter\'s class?', options: ['8 o\'clock', '10 o\'clock', '9 o\'clock', '11 o\'clock'], answer: 2 },
          { q: 'How does Molly spell her last name?', options: ['L-Y-N', 'L-I-N-N', 'L-I-N', 'L-E-N'], answer: 2 },
          { q: 'Who is Miss Smith?', options: ['Molly\'s teacher', 'Peter\'s sister', 'Not their teacher — wrong room!', 'The school principal'], answer: 2 },
        ]
      },
      {
        id: 'r5', title: 'Verb To Be — Introductions Context', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        text: `From your class material — Verb TO BE used in introductions:\n\nAffirmative:\nI am a student. / She is my teacher. / He is Peter Crumb.\nThey are in my class. / We are students.\n\nNegative:\nI am not late. / She is not Miss Taylor — she is Miss Smith!\nHe is not a doctor. He is a professor.\nThey are not ready.\n\nQuestions:\nAre you a student here? → Yes, I am! / No, I'm not.\nIs she your teacher? → Yes, she is! / No, she isn't.\nWhere is our class? → It's over there!\nWhat is your last name? → It's LIN.\n\nWith names:\nMy name is → meu nome é\nHer name is → o nome dela é\nHis name is → o nome dele é`,
        questions: [
          { q: 'Complete: "___ you a student here?" — Peter asks Molly.', options: ['Am', 'Is', 'Are', 'Be'], answer: 2 },
          { q: 'Ms. Smith said "Hello, Holly!" — Molly corrected her. What did Molly say?', options: ['"I am not Holly. I is Molly."', '"No, it\'s Molly, M-O-L-L-Y."', '"My name are Molly."', '"She is Molly!"'], answer: 1 },
          { q: 'Complete: "Miss Taylor ___ in room 203 over there."', options: ['am', 'are', 'be', 'is'], answer: 3 },
          { q: 'Which sentence is CORRECT?', options: ['He am a student.', 'They is happy.', 'We are in your class!', 'She are my teacher.'], answer: 2 },
        ]
      },
      {
        id: 'r6', title: 'A/An — Articles in Introductions', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        text: `From your class — when to use A or AN:\n\nUse A before consonant sounds:\n• a teacher → uma professora\n• a doctor → um médico\n• a nurse → uma enfermeira\n• a process → um processo\n• a student → um estudante\n\nUse AN before vowel sounds:\n• an actor → um ator\n• an artist → um artista\n• an engineer → um engenheiro\n• an astronaut → um astronauta\n• an apple → uma maçã\n\nFrom the dialogue:\n"I'm an actor. I have a process." — Phoebe\n"I'm not an actor. I'm a professor of paleontology." — Ross`,
        questions: [
          { q: 'Choose the correct article: "She is ___ engineer."', options: ['a', 'an', 'the', 'no article'], answer: 1 },
          { q: 'Choose the correct article: "He is ___ doctor."', options: ['an', 'the', 'a', 'no article'], answer: 2 },
          { q: 'Phoebe says "I\'m ___ actor." Which is correct?', options: ['a', 'an', 'the', 'one'], answer: 1 },
          { q: 'Which sentence is CORRECT?', options: ['She is a artist.', 'He is an nurse.', 'I am an astronaut.', 'We are a engineers.'], answer: 2 },
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
      // ─── L4: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'l4', title: 'Friends Cast — Introductions', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        audioText: `Phoebe: I can't do that. I'm an actor. I have a process.\nPessoa 1: Nice to meet you! So, what show are you on?\nRoss: Oh, I'm not an actor. I'm a professor of paleontology.\nMonica: I hope you're hungry.\nPessoa 2: So, who are you?\nChandler: Well, our names really are Monica and Chandler. We're from New York.\nJulie: Thank you. I'm from New York!\nPessoa 3: Forget it. We're just hungry. We haven't had lunch.\nPessoa 4: Are you hungry? How about that sushi place you love?`,
        instruction: 'Read the transcript from your Listening 3 class material. Pay attention to how the characters introduce themselves and describe their professions. Then answer the questions!',
        questions: [
          { q: 'What is Phoebe\'s profession?', options: ['A professor', 'A doctor', 'An actor', 'A nurse'], answer: 2 },
          { q: 'What does Ross do?', options: ['He is an actor', 'He is a professor of paleontology', 'He is a doctor', 'He is a chef'], answer: 1 },
          { q: 'Where are Monica and Chandler from?', options: ['Los Angeles', 'Chicago', 'Boston', 'New York'], answer: 3 },
          { q: 'What does "How about that sushi place you love?" mean?', options: ['Do you like sushi?', 'Shall we go to your favourite sushi restaurant?', 'Where is the sushi place?', 'I love sushi too!'], answer: 1 },
        ]
      },
      {
        id: 'l5', title: 'Molly & Peter — Listen & Follow', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        audioText: `Molly: Excuse me, hi, my name is Molly. What's your name?\nPeter: I'm Peter! My friends call me Pete.\nMolly: Hi Pete, it's nice to meet you!\nPeter: It's nice to meet you too.\nMolly: Are you a student here?\nPeter: Yes, I am! My class is at 9 o'clock with Miss Taylor.\nMolly: Miss Taylor! She is my teacher! You are in my class!\nMs. Smith: Hello, what's your name?\nMolly: I'm Molly! I'm in your class too!\nMs. Smith: Hello, Holly! Is that H-O-L-L-Y?\nMolly: No, it's Molly, M-O-L-L-Y. My last name is LIN. L-I-N.\nPeter: Excuse me… are you Miss Taylor?\nMs. Smith: No I'm not! I'm Miss Smith. Miss Taylor is in room 203 over there.`,
        instruction: 'Read this transcript from The Introductions class. Focus on how Molly and Peter introduce themselves, spell names, and find their classroom. Then answer the questions!',
        questions: [
          { q: 'How does Peter prefer to be called?', options: ['Peter', 'Pete', 'Pat', 'PJ'], answer: 1 },
          { q: 'The teacher called Molly "Holly". How did Molly correct her?', options: ['"I am not Holly."', '"No, it\'s Molly, M-O-L-L-Y."', '"My name are Molly."', '"Call me Mol!"'], answer: 1 },
          { q: 'Where is Miss Taylor\'s classroom?', options: ['Room 102', 'Room 302', 'Room 230', 'Room 203'], answer: 3 },
          { q: 'What does "It\'s over there" mean?', options: ['It\'s very far away', 'It\'s finished', 'It\'s in that direction', 'It\'s above us'], answer: 2 },
        ]
      },
      {
        id: 'l6', title: 'A or AN? — Listen & Choose', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE INTRODUCTIONS',
        audioText: `From your class vocabulary:\n\nWith A (consonant sound):\nShe is a teacher.\nHe is a doctor.\nShe is a nurse.\nIt is a process.\nHe is a student.\nIt is a sushi place.\n\nWith AN (vowel sound):\nShe is an actor.\nHe is an artist.\nShe is an engineer.\nHe is an astronaut.\nIt is an apple.\n\nFrom Friends:\nPhoebe: "I'm an actor. I have a process."\nRoss: "I'm not an actor. I'm a professor."`,
        instruction: 'Study the A/AN rules from your class material. Listen to how native speakers use them naturally. Then choose the correct article for each sentence!',
        questions: [
          { q: 'Complete: "She is ___ artist from New York."', options: ['a', 'an', 'the', 'one'], answer: 1 },
          { q: 'Complete: "I\'m ___ student. My class is at 9."', options: ['an', 'the', 'a', 'one'], answer: 2 },
          { q: 'Complete: "Ross is ___ professor, not ___ actor."', options: ['a / an', 'an / a', 'a / a', 'an / an'], answer: 0 },
          { q: 'Which is CORRECT?', options: ['"She\'s a engineer."', '"He\'s an doctor."', '"I\'m an astronaut."', '"We\'re a artists."'], answer: 2 },
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
      // ─── L4: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 'w4', title: 'Write a School Introduction Dialogue', level: 'A1',
        type: 'writing',
        lesson: 'THE INTRODUCTIONS',
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
        lesson: 'THE INTRODUCTIONS',
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
        lesson: 'THE INTRODUCTIONS',
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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
        lesson: 'THE GREETINGS',
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

      // ─── L4: THE INTRODUCTIONS ───────────────────────────────────────
      {
        id: 's4', title: 'Introduce Yourself at School', level: 'A1',
        type: 'speaking',
        lesson: 'THE INTRODUCTIONS',
        prompt: 'You are a new student arriving at school. Record yourself introducing yourself to your teacher: say your name, spell your last name, say what class you are in, and greet your teacher politely. Use the Molly & Peter dialogue as inspiration!',
        tips: [
          'Start with: "Excuse me, hi! My name is ___."',
          'Spell your last name: "My last name is ___, it\'s spelled ___."',
          'Use: "I\'m in your class!" or "Nice to meet you!"',
          'End politely: "Thank you! Have a good day!"'
        ],
        phrases: ['Excuse me, hi! My name is...', 'My last name is... spelled...', 'I\'m in your class!', 'Nice to meet you!', 'Thank you! Have a good day!']
      },
      {
        id: 's5', title: 'Role Play — Meeting a Classmate', level: 'A1',
        type: 'speaking',
        lesson: 'THE INTRODUCTIONS',
        prompt: 'Record yourself playing both parts of a conversation between two students meeting for the first time. Use: name, nickname, class, teacher\'s name, and where the classroom is. Be creative — add your own details!',
        tips: [
          'Use: "My friends call me ___" for nickname',
          'Ask: "Are you a student here?"',
          'Say: "She is my teacher too! You are in my class!"',
          'Use: "It\'s over there!" / "Here you are!"'
        ],
        phrases: ['My friends call me...', 'Are you a student here?', 'My class is at ___ o\'clock.', 'She is my teacher!', 'It\'s over there.', 'Nice to meet you too!']
      },
      {
        id: 's6', title: 'Correct the Teacher!', level: 'A1',
        type: 'speaking',
        lesson: 'THE INTRODUCTIONS',
        prompt: 'The teacher got your name wrong! Record yourself politely correcting her — just like Molly did with Ms. Smith. Say your name, spell it clearly, and give your last name too. Then say a complete sentence using "My name is" and "I am in your class".',
        tips: [
          'Be polite: "No, it\'s ___, not ___."',
          'Spell clearly: "M-O-L-L-Y — Molly!"',
          'Give last name: "My last name is ___. L-I-N."',
          'Confirm: "I am in your class!"'
        ],
        phrases: ['No, it\'s ___, not ___.', 'It\'s spelled...', 'My last name is...', 'I am in your class!', 'Nice to meet you, Miss ___!']
      },
    ]
  }
};

export default function Practice({ user, student, onLogout }) {
  const { skill } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skillData = SKILLS[skill] || SKILLS.reading;
  const [activityIndex, setActivityIndex] = useState(() => {
    const idx = parseInt(searchParams.get('activity') || '0');
    return isNaN(idx) ? 0 : idx;
  });
  const activity = skillData.activities[activityIndex];

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
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);
      const activities = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
      activities.push({ skill: 'speaking', title: activity.title, score: (feedback.score || 5) * 10, time: 'Just now' });
      localStorage.setItem('ewd_activities', JSON.stringify(activities));
    } catch {
      setSpeakingFeedback({ score: 7, positive: "Good effort!", tip: "Keep practicing!", overall: "Well done! 🌟" });
    }
    setSpeakingLoading(false);
    setSubmitted(true);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handleAnswer = (qi, ai) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const handleSubmit = () => {
    if (activity.type === 'multiple_choice' || activity.type === 'listening_video') {
      const correct = activity.questions.filter((q, i) => answers[i] === q.answer).length;
      const pct = Math.round((correct / activity.questions.length) * 100);
      setScore(pct);

      // Save XP
      const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);

      // Save activity
      const activities = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
      activities.push({ skill, title: activity.title, score: pct, time: 'Just now' });
      localStorage.setItem('ewd_activities', JSON.stringify(activities));
    } else if (activity.type === 'writing') {
      const words = writingText.trim().split(/\s+/).filter(Boolean).length;
      const pct = words >= activity.minWords ? (words >= activity.minWords * 1.5 ? 100 : 75) : 40;
      setScore(pct);
      const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);
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
              onClick={() => { navigate(`/practice/${key}`); setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); setActivityIndex(0); }}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        {/* Activity selector */}
        <div className="activity-selector">
          <div className="activity-lesson-tag">📚 {activity.lesson}</div>
          <div className="activity-tabs">
            {skillData.activities.map((a, i) => (
              <div key={i}
                className={`activity-tab ${activityIndex === i ? 'active' : ''}`}
                onClick={() => { setActivityIndex(i); setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); }}>
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
                  <div className="score-label">
                    {score >= 80 ? activity.feedback.excellent : score >= 50 ? activity.feedback.good : activity.feedback.needsWork}
                  </div>
                  <div className="xp-earned" style={{ marginTop: 12 }}>+{score >= 80 ? 20 : score >= 50 ? 10 : 5} XP earned! 🎉</div>
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
                    <div className="fb-label">💡 Tip for next time</div>
                    <div className="fb-text">{speakingFeedback.tip}</div>
                  </div>
                  <div className="xp-earned">+{(speakingFeedback.score || 5) >= 8 ? 25 : (speakingFeedback.score || 5) >= 6 ? 15 : 8} XP earned! 🎉</div>
                </div>
              )}
              <button className="try-again-btn" onClick={() => { setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); }}>
                Try another activity →
              </button>
              <button className="back-btn" onClick={() => navigate('/hub')}>← Back to Practice Hub</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
