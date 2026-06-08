import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getItem, setItem } from '../utils/storage';
import './Practice.css';

const SKILLS = {
  reading: {
    label: 'Reading', icon: '📖', color: '#1d9e75',
    activities: [
      // ── L2 ──────────────────────────────────────────────────────────
      { id:'r1', title:'The Greetings — Mark & Julia', level:'A1', type:'multiple_choice', lesson:'The Greetings', phase:'pre',
        text:`Mark: Good afternoon!\nJulia: Good afternoon!\nMark: Hi, what's your name?\nJulia: I'm Julia. And you?\nMark: I'm Mark. Nice to meet you!\nJulia: Nice to meet you too! How do you spell your name?\nMark: It's M-A-R-K. How do you spell yours?\nJulia: J-U-L-I-A.\nMark: Great! How are you?\nJulia: I'm good, thanks. How about you?\nMark: Fine, thanks!\nJulia: But I have to go now!\nMark: Okay! Have a good day!\nJulia: Thanks! See you later!\nMark: Take care! Bye!`,
        questions:[
          {q:'What time of day does the conversation happen?',options:['Morning','Afternoon','Evening','Night'],answer:1},
          {q:'How does Julia spell her name?',options:['J-U-L-I-E','J-O-O-L-I-A','J-U-L-I-A','G-U-L-I-A'],answer:2},
          {q:'How is Julia feeling?',options:['Tired','Bad','Good','Nervous'],answer:2},
          {q:'What does Mark say when Julia leaves?',options:['Goodbye forever!','See you tomorrow!','Have a good day! Take care!','Come back soon!'],answer:2},
        ]
      },
      { id:'r2', title:'Vocabulary Match — Greetings', level:'A1', type:'multiple_choice', lesson:'The Greetings', phase:'pre',
        text:`Study these greetings:\n\n🌅 MORNING: "Good morning!" / "Morning!"\n☀️ AFTERNOON: "Good afternoon!"\n🌙 EVENING: "Good evening!"\n🌛 LEAVING AT NIGHT: "Good night!"\n\n"How are you?" → "I'm good, thanks!"\n"What's up?" → "Not much! And you?"\n"How's it going?" → "Pretty good!"\n\nGoodbye:\n"See you later!" / "Take care!" / "Have a good day!"`,
        questions:[
          {q:'You arrive at a party at 8 PM. You say:',options:['Good morning!','Good night!','Good evening!','Goodbye!'],answer:2},
          {q:'Someone asks "What\'s up?" — best answer:',options:['I\'m Julia.','Not much! And you?','Good afternoon!','Take care!'],answer:1},
          {q:'You are leaving work late at night. You say:',options:['Good morning!','Good evening!','Good night!','See you!'],answer:2},
          {q:'"How\'s it going?" means the same as:',options:['Where are you going?','How are you?','What are you doing?','When are you leaving?'],answer:1},
        ]
      },
      { id:'r3', title:'Verb To Be in Context', level:'A1', type:'multiple_choice', lesson:'The Greetings', phase:'post',
        text:`Verb TO BE in greetings:\n\nI AM → I'm fine. / I am Mark.\nYOU ARE → You are very kind!\nHE IS → He is my friend.\nSHE IS → She is from Brazil.\nWE ARE → We are students.\nTHEY ARE → They are teachers.\n\nNEGATIVE:\nI am not tired. / She is not here. / He isn't late.\n\nQUESTIONS:\n"Are you okay?" → "Yes, I am!" / "No, I'm not."\n"Is she your friend?" → "Yes, she is!"\n"How are you?" → "I'm great, thanks!"`,
        questions:[
          {q:'Complete: "___ she your teacher?" — "Yes, ___ is!"',options:['Is / she','Are / she','Am / she','Is / her'],answer:0},
          {q:'Which is CORRECT?',options:['I are fine.','He am happy.','They is students.','We are friends.'],answer:3},
          {q:'Make negative: "I am tired."',options:['I not am tired.','I am not tired.','I am no tired.','Am I not tired.'],answer:1},
          {q:'"How are you?" — best answer:',options:['I am Mark.','She is fine.','I\'m great, thanks! And you?','You are welcome.'],answer:2},
        ]
      },
      // ── L3 ──────────────────────────────────────────────────────────
      { id:'r4', title:'Meet John & Elizabeth!', level:'A1', type:'multiple_choice', lesson:'The Introductions', phase:'pre',
        text:`John: Hello hello!\nElizabeth: Hello! How are you?\nJohn: I am fine thanks. What's your name?\nElizabeth: My name is Elizabeth. What is your name?\nJohn: My name is John. Nice to meet you!\nElizabeth: Nice to meet you too! How old are you?\nJohn: I am 23. Where are you from?\nElizabeth: I am from Spain. I am Spanish. I live in Madrid.\nJohn: I am from the USA. I am American. I live in New York.\nElizabeth: Do you speak Spanish?\nJohn: No. I speak English and French. I am a businessman.\nElizabeth: I am a teacher. It has been a pleasure to meet you!\nJohn: I am also glad to meet you. Bye!\nElizabeth: See you later!`,
        questions:[
          {q:'Where is Elizabeth from?',options:['The United States','France','Spain','England'],answer:2},
          {q:'What does John do?',options:['He is a teacher','He is a businessman','He is a student','He is a doctor'],answer:1},
          {q:'Where does John live?',options:['Madrid','Los Angeles','London','New York'],answer:3},
          {q:'"It has been a pleasure to meet you" means:',options:['I need to leave now','I am very happy to have met you','Where are you from?','See you tomorrow'],answer:1},
        ]
      },
      { id:'r5', title:'Her, His, Here & There', level:'A1', type:'multiple_choice', lesson:'The Introductions', phase:'post',
        text:`Key vocabulary:\n\nHERE = aqui\n"My book is here." / "Come here!"\n\nOVER THERE = lá, ali\n"The bathroom is over there."\n\nWHERE = onde (pergunta)\n"Where are you from?" / "Where is my pen?"\n\nHER NAME IS = o nome dela é\n"Her name is Elizabeth."\n\nHIS NAME IS = o nome dele é\n"His name is John."\n\nYOU'RE WELCOME = de nada\n"Thank you!" → "You're welcome!"`,
        questions:[
          {q:'Someone is far away. You say: "He is ___ ."',options:['here','where','over there','welcome'],answer:2},
          {q:'Your friend thanks you. You say:',options:['"Thank you!"','"You\'re welcome!"','"Here you are!"','"Over there!"'],answer:1},
          {q:'Fill in: "___ name is Maria. She is Brazilian."',options:['His','Her','Where','Here'],answer:1},
          {q:'"Thank you so much!" — "___!"',options:['Here you are','Over there','You\'re welcome','His name'],answer:2},
        ]
      },
      // ── L4 ──────────────────────────────────────────────────────────
      { id:'r6', title:'Meet Giulia!', level:'A1', type:'multiple_choice', lesson:'Countries and Nationalities', phase:'pre',
        text:`Hi! My name is Giulia Rossi, and I'm from Florence, Italy. I'm Italian. I'm a teacher and I'm very happy with my job.\n\nNow I live in São Paulo, Brazil, and I love it here! I speak Italian, English and Portuguese. Portuguese is my favorite language, because my mother is from Brazil.\n\nI love Brazil because it is beautiful and the people are very friendly. But sometimes the city is too loud and very crowded!`,
        questions:[
          {q:'Where is Giulia originally from?',options:['São Paulo, Brazil','Rome, Italy','Florence, Italy','Lisbon, Portugal'],answer:2},
          {q:'What is Giulia\'s nationality?',options:['Brazilian','Portuguese','Spanish','Italian'],answer:3},
          {q:'Why is Portuguese Giulia\'s favorite language?',options:['She lives in Brazil','Her father is Brazilian','Her mother is from Brazil','She is a Portuguese teacher'],answer:2},
          {q:'What does Giulia DISLIKE about the city?',options:['The food','The weather','The people','It is too loud and crowded'],answer:3},
        ]
      },
      { id:'r7', title:'Countries, Nationalities & Verbs', level:'A1', type:'multiple_choice', lesson:'Countries and Nationalities', phase:'post',
        text:`Key verbs:\nTo BE → I am / She is / He is\nTo LIVE → I live in... / She lives in...\nTo SPEAK → I speak... / She speaks...\nTo LOVE → I love... / She loves...\nTo DISLIKE → I dislike... / She dislikes...\n\nCountry → Nationality:\nBrazil → Brazilian\nItaly → Italian\nEngland → English\nFrance → French\nJapan → Japanese\nChina → Chinese\nSpain → Spanish`,
        questions:[
          {q:'Complete: "Ana ___ from Rio de Janeiro."',options:['am','are','is','be'],answer:2},
          {q:'Nationality of someone from Japan:',options:['Japanian','Japanish','Japaneese','Japanese'],answer:3},
          {q:'Complete: "She ___ Portuguese and a little English."',options:['speak','speaks','speaking','spoke'],answer:1},
          {q:'Complete: "I ___ loud noise. I prefer quiet places."',options:['love','want','dislike','speak'],answer:2},
        ]
      },
      // ── L5 ──────────────────────────────────────────────────────────
      { id:'r8', title:'What Do They Do?', level:'A1', type:'multiple_choice', lesson:'The Occupations', phase:'pre',
        text:`Carlos is a doctor. He works at a big hospital in São Paulo. He loves his job but it is sometimes very stressful.\n\nSophie is a teacher. She teaches English at a school in London. She works Monday to Friday.\n\nDavid is an engineer. He works at a technology company and designs bridges and buildings.\n\nMaria is a chef. She works at a restaurant in Paris and cooks French and Italian food.`,
        questions:[
          {q:'What does Carlos do?',options:['He is a teacher','He is an engineer','He is a doctor','He is a chef'],answer:2},
          {q:'Where does Sophie work?',options:['At a hospital','At a restaurant','At a company','At a school'],answer:3},
          {q:'What does David design?',options:['Food and menus','Bridges and buildings','English lessons','Hospital rooms'],answer:1},
          {q:'What food does Maria cook?',options:['Brazilian food','Japanese food','French and Italian food','American food'],answer:2},
        ]
      },
      { id:'r9', title:'Articles A / AN — Jobs Grammar', level:'A1', type:'multiple_choice', lesson:'The Occupations', phase:'post',
        text:`Use A before consonant sounds:\na doctor • a teacher • a nurse • a chef • a lawyer • a pilot\n\nUse AN before vowel sounds (a, e, i, o, u):\nan engineer • an actor • an artist • an architect • an accountant\n\nKey expressions:\nI AM a... / I WORK AS a... / I WORK AT...\n"What do you do?" → "I am a teacher."\n"Where do you work?" → "I work at a hospital."`,
        questions:[
          {q:'"She is ___ engineer."',options:['a','an','the','one'],answer:1},
          {q:'"He works as ___ chef."',options:['an','the','a','some'],answer:2},
          {q:'"What do you do?" — best answer:',options:['"I do a lot!"','"I am a teacher."','"I work Monday."','"Yes, I do."'],answer:1},
          {q:'Which sentence is CORRECT?',options:['She is a actor.','He is an doctor.','I am an architect.','We are a engineers.'],answer:2},
        ]
      },
      // ── L6 ──────────────────────────────────────────────────────────
      { id:'r10', title:'At the Café — Tom & Anna', level:'A1', type:'multiple_choice', lesson:'At the Café', phase:'pre',
        text:`Waiter: Good morning! What can I get you?\nTom: Can I see the menu, please?\nWaiter: Of course! Here you are.\nTom: I'd like a large coffee and a croissant.\nAnna: And I'll have a green tea and a slice of chocolate cake.\nWaiter: Hot or iced coffee?\nTom: Hot, with a little milk.\nWaiter: Tea with sugar?\nAnna: No thank you. No sugar.\nWaiter: Anything else?\nTom: No. How much is it?\nWaiter: That's $12.50.\nTom: Here you are. Keep the change!\nWaiter: Thank you! Enjoy your meal!\nAnna: Have a great day!`,
        questions:[
          {q:'What does Tom order to drink?',options:['Green tea','Iced coffee','Hot coffee with milk','Hot tea'],answer:2},
          {q:'What does Anna order to eat?',options:['A croissant','A sandwich','A slice of chocolate cake','Nothing'],answer:2},
          {q:'How much does everything cost?',options:['$10.50','$12.50','$15.00','$8.50'],answer:1},
          {q:'"Keep the change!" means:',options:['Give me more change','The change is yours — don\'t give it back','I don\'t have change','Change my order'],answer:1},
        ]
      },
      { id:'r11', title:'Café Vocabulary & Expressions', level:'A1', type:'multiple_choice', lesson:'At the Café', phase:'post',
        text:`ORDERING:\n"I'd like a ___, please."\n"Can I have ___?"\n"I'll have the ___."\n\nASKING THE PRICE:\n"How much is it?"\n"The bill, please."\n\nPAYING:\n"Here you are." / "Keep the change."\n\nPREFERENCES:\n"Hot or iced?" / "With or without milk/sugar?"`,
        questions:[
          {q:'You want to pay. You say:',options:['"I\'d like more!"','"The bill, please."','"Keep the change!"','"How much?"'],answer:1},
          {q:'"I\'d like a coffee" — same meaning:',options:['"I like coffee."','"Give me coffee!"','"Can I have a coffee, please?"','"Coffee is good."'],answer:2},
          {q:'You want cold coffee. You say:',options:['"Hot, please."','"No, thank you."','"With milk."','"Iced, please."'],answer:3},
          {q:'Which is CORRECT to order politely?',options:['"Give me a sandwich!"','"I want cake now."','"Can I have a slice of cake, please?"','"Sandwich. Now."'],answer:2},
        ]
      },
      // ── L7 ──────────────────────────────────────────────────────────
      { id:'r12', title:'City Vocabulary & Directions', level:'A1', type:'multiple_choice', lesson:'The Places in the City', phase:'post',
        text:`PLACES: bank, post office, supermarket, pharmacy, hospital, school, park, library, cinema, police station, train station\n\nDIRECTIONS:\n"Go straight ahead." → Vá em frente.\n"Turn left / right." → Vire à esquerda / direita.\n"It's opposite the ___." → Fica em frente ao ___.\n"It's next to the ___." → Fica ao lado do ___.\n\nASKING:\n"Excuse me! Is there a ___ near here?"\n"How far is it?" → "It's 5 minutes on foot."`,
        questions:[
          {q:'"Turn left at the traffic lights" means:',options:['Vire à direita','Pare no semáforo','Vire à esquerda no semáforo','Vá em frente'],answer:2},
          {q:'The pharmacy is ___ the hospital. (em frente)',options:['next to','between','opposite','behind'],answer:2},
          {q:'You need money. You ask for a:',options:['hospital','bank','school','park'],answer:1},
          {q:'"It\'s 5 minutes on foot" means:',options:['It\'s very far','You need to drive','It\'s close — a short walk','Take the bus'],answer:2},
        ]
      },
      // ── L8 ──────────────────────────────────────────────────────────
      { id:'r13', title:'Family Members & Possessives', level:'A1', type:'multiple_choice', lesson:'The Family', phase:'post',
        text:`FAMILY:\nfather / mother → parents\nson / daughter → children\nbrother / sister → siblings\ngrandfather / grandmother → grandparents\nuncle / aunt / nephew / niece / cousin\n\nPOSSESSIVES:\nMY / YOUR / HIS / HER / OUR / THEIR\nMy father's name is ___ (apostrophe S)\n\nEXPRESSIONS:\n"He is an only child." → filho único\n"She is the oldest / youngest."\n"He passed away." → ele faleceu`,
        questions:[
          {q:'Your mother\'s mother is your:',options:['Aunt','Sister','Grandmother','Cousin'],answer:2},
          {q:'"He is an only child" means:',options:['He has many brothers','He has no brothers or sisters','He is very young','He is the oldest'],answer:1},
          {q:'Your brother\'s son is your:',options:['Cousin','Uncle','Nephew','Son'],answer:2},
          {q:'Complete: "___ name is Maria. She is my wife."',options:['His','My','Her','Their'],answer:2},
        ]
      },
      // ── L9 ──────────────────────────────────────────────────────────
      { id:'r14', title:'Going To — Grammar Focus', level:'A1', type:'multiple_choice', lesson:'You Are Going To…', phase:'post',
        text:`GOING TO — future plans:\n\nI am going to study.\nShe is going to cook.\nWe are going to travel.\n\nNEGATIVE:\nI am NOT going to go.\nShe is NOT going to come.\n\nQUESTION:\nAre you going to study? → Yes, I am! / No, I'm not.\nWhat are you going to do? → I'm going to ___.`,
        questions:[
          {q:'Complete: "She ___ going to cook dinner."',options:['am','are','is','be'],answer:2},
          {q:'Complete: "Are you going to study?" — "No, ___ ."',options:['I am','I\'m not','she isn\'t','we aren\'t'],answer:1},
          {q:'Which is CORRECT?',options:['He going to travel.','We going travel.','They are going to work.','I am go to study.'],answer:2},
          {q:'"What are you going to do?" — best answer:',options:['"Yes, I am."','"I went to the park."','"I am going to visit my family."','"I go to school."'],answer:2},
        ]
      },
      // ── L10 ──────────────────────────────────────────────────────────
      { id:'r15', title:'Travel Vocabulary & Phrases', level:'A1', type:'multiple_choice', lesson:'At the Travel Agency', phase:'post',
        text:`AT THE AIRPORT:\npassport, ticket, boarding pass, gate, departure, arrival, check-in, luggage, suitcase, carry-on, customs\n\nKEY PHRASES:\n"Window or aisle seat?"\n"How many bags are you checking?"\n"Your flight departs from Gate ___."\n"The baggage limit is 23 kilos."\n"Have a wonderful flight!"`,
        questions:[
          {q:'Your "boarding pass" is:',options:['Your passport','Your luggage ticket','Your document to board the plane','Your seat cushion'],answer:2},
          {q:'"Aisle seat" is:',options:['The window seat','The middle seat','The seat next to the corridor','The front seat'],answer:2},
          {q:'"Your flight departs from Gate 14" means:',options:['Arrives at gate 14','Leaves from gate 14','Check-in is at gate 14','Baggage is at gate 14'],answer:1},
          {q:'You want to book a flight. You go to:',options:['The airport security','The travel agency or website','The gate directly','The baggage claim'],answer:1},
        ]
      },
      // ── L11 ──────────────────────────────────────────────────────────
      { id:'r16', title:'Simple Past — To Be (Was / Were)', level:'A1', type:'multiple_choice', lesson:'I Was So Nervous!', phase:'post',
        text:`SIMPLE PAST — Verb TO BE:\n\nI WAS / HE WAS / SHE WAS / IT WAS\nWE WERE / YOU WERE / THEY WERE\n\nNEGATIVE:\nI wasn't nervous. / They weren't there.\n\nQUESTION:\nWas she happy? → Yes, she was! / No, she wasn't.\nWere they there? → Yes, they were!\nWhere were you? → I was at home.\nHow was it? → It was amazing!`,
        questions:[
          {q:'Complete: "I ___ very nervous on my first day."',options:['were','am','was','be'],answer:2},
          {q:'"Were they friendly?" — "No, ___ ."',options:['they wasn\'t','they weren\'t','they aren\'t','they isn\'t'],answer:1},
          {q:'Complete: "How ___ the movie?" — "It ___ great!"',options:['was / were','were / was','was / was','were / were'],answer:2},
          {q:'Which is CORRECT?',options:['She were happy.','They was late.','He was a teacher.','I were tired.'],answer:2},
        ]
      },
      // ── L12 ──────────────────────────────────────────────────────────
      { id:'r17', title:'Simple Past — Regular Verbs', level:'A1', type:'multiple_choice', lesson:'Where Were You Yesterday?', phase:'post',
        text:`SIMPLE PAST — Regular verbs (add -ED):\nwork → worked / watch → watched / visit → visited\ncook → cooked / call → called\n\nNEGATIVE (DID NOT + base verb):\nI didn't work. / She didn't cook.\n\nQUESTION (DID + subject + base verb):\nDid you work? → Yes, I did! / No, I didn't.\nWhat did she cook? → She cooked pasta.\n\nIRREGULAR:\ngo → went / eat → ate / see → saw / have → had`,
        questions:[
          {q:'Complete: "She ___ a movie last night."',options:['watch','watchs','watched','watching'],answer:2},
          {q:'Make negative: "I worked yesterday."',options:['I not worked yesterday.','I didn\'t worked yesterday.','I didn\'t work yesterday.','I wasn\'t work yesterday.'],answer:2},
          {q:'"Did you call her?" — "No, ___ ."',options:['I didn\'t','I wasn\'t','I don\'t','I haven\'t'],answer:0},
          {q:'Past of "go":',options:['goed','goes','going','went'],answer:3},
        ]
      },
      // ── L13 ──────────────────────────────────────────────────────────
      { id:'r18', title:'A1 Full Review — Reading', level:'A1', type:'multiple_choice', lesson:'Final Review', phase:'post',
        text:`My name is Ana Costa. I am Brazilian and I am 28 years old. I am an English teacher in São Paulo.\n\nI live with my husband Pedro (an engineer) and our daughter Sofia (3 years old). Sofia is going to start school next year!\n\nYesterday was busy. In the morning I worked. In the afternoon I went to the supermarket and cooked dinner. In the evening, Pedro and I watched a comedy film. It was very funny!\n\nNext weekend we are going to visit my parents in Campinas. My mother is going to cook a big Sunday lunch!`,
        questions:[
          {q:'What does Ana do?',options:['She is an engineer','She is a doctor','She is an English teacher','She is a chef'],answer:2},
          {q:'What is Sofia going to do next year?',options:['Learn English','Start school','Move to Campinas','Cook lunch'],answer:1},
          {q:'What did Ana do yesterday afternoon?',options:['She worked','She watched a film','She went to the supermarket and cooked dinner','She visited her parents'],answer:2},
          {q:'Where do Ana\'s parents live?',options:['In São Paulo','In Rio de Janeiro','In Campinas','Near the city centre'],answer:2},
        ]
      },
      // ── L14 FINAL TEST ────────────────────────────────────────────────
      { id:'r19', title:'Final Test — Reading Review', level:'A1', type:'multiple_choice', lesson:'Final Test A1', phase:'post',
        text:`My name is Lucas. I am Brazilian from Belo Horizonte, but I live in London. I am a software engineer at a tech company near the train station.\n\nMy wife Emma is British and works as a nurse. We are going to have a baby next year!\n\nYesterday was special. In the morning I went to a travel agency and booked two tickets to Belo Horizonte — we are going to visit Brazil next month! In the afternoon Emma and I went to a café. I had an espresso and she ordered a latte. It was delicious!\n\nI miss my family in Brazil. My parents are retired and my sister is a teacher. I was very nervous when I first moved to London, but now I love it here!`,
        questions:[
          {q:'Where is Lucas from originally?',options:['London','São Paulo','Belo Horizonte','Rio de Janeiro'],answer:2},
          {q:'What exciting news does Lucas share?',options:['He is going to change jobs','He and Emma are going to have a baby','He is moving back to Brazil','He is going to open a café'],answer:1},
          {q:'What did Lucas do at the travel agency?',options:['Got his passport','Booked a hotel','Booked two tickets to Belo Horizonte','Met his family'],answer:2},
          {q:'How did Lucas feel when he first moved to London?',options:['Excited and happy','Very nervous','Bored and sad','Angry'],answer:1},
        ]
      },

      // ── B1 READING (pós-aula) ─────────────────────────────────────────
      { id:'rb1_1', title:'Arguments & Reactions — Reading', level:'B1', type:'multiple_choice', lesson:'The Elevator Incident', phase:'post',
        text:`Conflict is a natural part of human communication. How we handle disagreements says a lot about our emotional intelligence.\n\nUseful language for arguments:\n• "That's not what I meant!" — clarifying a misunderstanding\n• "Can we talk about this calmly?" — de-escalating tension\n• "I understand your point, but..." — acknowledging then disagreeing\n• "I'm sorry if that came across wrong." — apologizing without full blame\n• "Let's agree to disagree." — ending a conflict respectfully\n\nKey vocabulary: misunderstanding, overreact, calm down, make up, apologize, perspective, tone of voice`,
        questions:[
          {q:'"Let\'s agree to disagree" means:',options:['We agree on everything','We accept that we have different views','We will argue more later','We are both wrong'],answer:1},
          {q:'"Can we talk about this calmly?" is used to:',options:['Start an argument','De-escalate tension','Ignore the problem','Change the subject'],answer:1},
          {q:'"I\'m sorry if that came across wrong" is:',options:['A full apology taking all blame','A partial apology without full blame','A way to continue arguing','Sarcasm'],answer:1},
          {q:'Emotional intelligence in conflicts means:',options:['Always winning the argument','Managing feelings and communicating respectfully','Never apologizing','Being louder than the other person'],answer:1},
        ]
      },
      { id:'rb1_2', title:'Superlatives — Grammar Focus', level:'B1', type:'multiple_choice', lesson:'Best Thing I Never Had', phase:'post',
        text:`SUPERLATIVES — comparing one thing to all others:\n\nSHORT ADJECTIVES (1 syllable): add -est\nbig → the biggest / fast → the fastest / tall → the tallest\n\nLONG ADJECTIVES (2+ syllables): the most + adjective\nbeautiful → the most beautiful / expensive → the most expensive\n\nIRREGULAR:\ngood → the best / bad → the worst / far → the farthest/furthest\n\nSPELLING RULES:\n• Double final consonant: big → biggest, hot → hottest\n• Drop -e: nice → nicest, large → largest\n• -y becomes -iest: easy → easiest, happy → happiest\n\nCommon expressions:\n"The best thing about..." / "The worst part is..." / "By far the most..."`,
        questions:[
          {q:'Superlative of "happy":',options:['the happiest','the most happy','the happyest','the happier'],answer:0},
          {q:'Superlative of "interesting":',options:['the interestingest','the most interesting','the interestingest','the more interesting'],answer:1},
          {q:'Irregular superlative of "bad":',options:['the baddest','the most bad','the worst','the badder'],answer:2},
          {q:'Complete: "She is ___ student in the class."',options:['the most smart','the smartest','the smarter','most smartest'],answer:1},
        ]
      },
      { id:'rb1_3', title:'Comparatives vs Superlatives', level:'B1', type:'multiple_choice', lesson:'My Milkshake Is Better Than Yours!', phase:'post',
        text:`COMPARATIVES vs SUPERLATIVES\n\nCOMPARATIVE (comparing 2 things):\n• Short: adjective + -er + than → taller than, faster than\n• Long: more + adjective + than → more interesting than\n• Irregular: good → better than / bad → worse than\n\nSUPERLATIVE (comparing to a group):\n• Short: the + adjective + -est → the tallest, the fastest\n• Long: the most + adjective → the most interesting\n• Irregular: good → the best / bad → the worst\n\nWATCH OUT:\n• "More better" ❌ → "better" ✓\n• "The most tallest" ❌ → "the tallest" ✓\n• "Gooder" ❌ → "better" ✓`,
        questions:[
          {q:'Compare 2 cities: "London is ___ than my hometown."',options:['the biggest','more bigger','bigger','most big'],answer:2},
          {q:'Compare all cities: "London is ___ city in the UK."',options:['bigger','the biggest','more big','most biggest'],answer:1},
          {q:'Which is CORRECT?',options:['"She is more taller than him."','"This is the most best film!"','"He runs faster than me."','"That\'s the goodest idea."'],answer:2},
          {q:'"My coffee is better than yours" uses:',options:['Superlative','Comparative','Equality','Negative comparison'],answer:1},
        ]
      },
      { id:'rb1_4', title:'Will vs Going To — Grammar', level:'B1', type:'multiple_choice', lesson:'What Will You Do Tonight?', phase:'post',
        text:`FUTURE: WILL vs GOING TO\n\nWILL — use for:\n• Spontaneous decisions: "I'll have the salad." (deciding now)\n• Predictions without evidence: "I think it will rain."\n• Offers and promises: "I'll help you!" / "I'll never lie to you."\n• Facts about the future: "She'll be 30 next year."\n\nGOING TO — use for:\n• Pre-planned intentions: "I'm going to visit my parents this weekend." (already decided)\n• Predictions with evidence: "Look at those clouds — it's going to rain!"\n\nKey difference:\nWill = deciding NOW\nGoing to = already decided BEFORE`,
        questions:[
          {q:'You see dark clouds. You say:',options:['"It will rain."','"It\'s going to rain!"','"It rains."','"It rained."'],answer:1},
          {q:'Your phone rings. You say:',options:['"I\'m going to answer it."','"I\'ll get it!"','"I get it."','"I\'m answering before."'],answer:1},
          {q:'"I\'m going to study medicine" means:',options:['A spontaneous decision made right now','A decision already made before','A prediction','A wish'],answer:1},
          {q:'Complete: "Don\'t worry, I ___ help you move next Saturday." (already promised)',options:['will','am going to','go to','would'],answer:1},
        ]
      },
      { id:'rb1_5', title:'Imperatives & Reminders — Reading', level:'B1', type:'multiple_choice', lesson:'Before Leaving the House', phase:'post',
        text:`IMPERATIVES — giving instructions, advice and reminders:\n\nAFFIRMATIVE IMPERATIVE: verb (base form)\n• "Lock the door!" / "Turn off the lights!" / "Call me!"\n\nNEGATIVE IMPERATIVE: don't + verb\n• "Don't forget your keys!" / "Don't leave the gas on!"\n\nSOFTENED WITH "please":\n• "Please remember to..." / "Please don't..."\n\nFOR REMINDERS, add "make sure":\n• "Make sure you have your wallet."\n• "Make sure not to leave the oven on."\n\nNote: Imperatives can sound direct — add "please" or "could you" to be more polite.`,
        questions:[
          {q:'Which is a negative imperative?',options:['Lock the door.','Please check.','Don\'t forget your phone!','Make sure you have your bag.'],answer:2},
          {q:'"Make sure you have your ID" is:',options:['A question','A negative imperative','A softened reminder','A command with please'],answer:2},
          {q:'To make an imperative more polite, you add:',options:['never','please','not','always'],answer:1},
          {q:'Imperatives use the verb in:',options:['Past form','-ing form','Base form','Third person'],answer:2},
        ]
      },
      { id:'rb1_6', title:'First Conditional — Grammar', level:'B1', type:'multiple_choice', lesson:'First Conditional', phase:'post',
        text:`FIRST CONDITIONAL — real/possible future situations\n\nFORMULA: IF + present simple, WILL + base verb\n\nExamples:\n• "If it rains tomorrow, I will stay home."\n• "If you study hard, you will pass the exam."\n• "I will call you if I need help."\n\nNOTE: The IF clause can come first or second.\n• "If I'm late, I'll text you." ✓\n• "I'll text you if I'm late." ✓\n(Comma only when IF clause comes first)\n\nCOMMON MISTAKES:\n• "If it will rain, I stay home." ❌\n• "If you will study, you pass." ❌\n• "If she studies, she will pass." ✓`,
        questions:[
          {q:'First conditional uses IF + ___ in the condition:',options:['will + verb','past simple','present simple','would + verb'],answer:2},
          {q:'Which is CORRECT first conditional?',options:['"If it will snow, I stay."','"If she studies, she will pass."','"If I would go, I\'ll see him."','"If they went, they will enjoy."'],answer:1},
          {q:'Complete: "If you ___ early, you ___ a good seat."',options:['arrive / will get','will arrive / get','arrived / would get','arrive / would get'],answer:0},
          {q:'When does the comma go in first conditional?',options:['Always','Never','Only when IF clause comes first','Only when WILL clause comes first'],answer:2},
        ]
      },
      { id:'rb1_7', title:'Second Conditional — Grammar', level:'B1', type:'multiple_choice', lesson:'Second Conditional', phase:'post',
        text:`SECOND CONDITIONAL — imaginary/unlikely situations\n\nFORMULA: IF + past simple, WOULD + base verb\n\nExamples:\n• "If I were rich, I would travel the world."\n• "If she knew the answer, she would tell us."\n• "I would buy that car if I had the money."\n\nNOTE: Use "were" for all subjects (formal/correct):\n• "If I were you, I would apologize." ✓\n• "If she were here, she would know." ✓\n\nDIFFERENCE:\n1st conditional → POSSIBLE: "If it rains, I'll stay."\n2nd conditional → IMAGINARY: "If I were a bird, I would fly."`,
        questions:[
          {q:'Second conditional uses IF + ___ in the condition:',options:['present simple','will + verb','past simple','would + verb'],answer:2},
          {q:'Which is CORRECT second conditional?',options:['"If I am rich, I would travel."','"If she had time, she would help."','"If they will come, we\'d be happy."','"If he studies, he would pass."'],answer:1},
          {q:'In second conditional, "were" is used for:',options:['Only plural subjects','All subjects (I, he, she, we)','Only "you"','Only formal writing'],answer:1},
          {q:'Complete: "If I ___ you, I ___ apologize."',options:['am / will','were / would','was / will','be / would'],answer:1},
        ]
      },
      { id:'rb1_8', title:'Hypothetical Situations — Reading', level:'B1', type:'multiple_choice', lesson:'What If?', phase:'post',
        text:`SPECULATING AND IMAGINING — useful language:\n\n"What if...?" → used to explore imaginary scenarios\n"Imagine (that)..." → inviting someone to picture a scenario\n"Suppose/Supposing..." → similar to "what if"\n\nResponding to hypotheticals:\n• "I would probably..."\n• "I think I'd..."\n• "I'm not sure, but I might..."\n• "It depends. If... then I would..."\n\nUseful vocabulary:\n• hypothetical / scenario / imagine / suppose / assume\n• "In an ideal world..." / "If everything were perfect..."\n• "Realistically speaking..." / "In theory..."`,
        questions:[
          {q:'"Suppose you could speak 5 languages..." introduces:',options:['A real past event','A hypothetical scenario','A future plan','A factual statement'],answer:1},
          {q:'"I would probably travel more" responds to:',options:['A direct question','A hypothetical situation','A past event','A command'],answer:1},
          {q:'"In an ideal world..." suggests:',options:['The current situation is perfect','Things are not ideal but you can imagine better','A past memory','A real plan'],answer:1},
          {q:'Complete: "___ you could live anywhere, where would you choose?"',options:['If','When','Although','Because'],answer:0},
        ]
      },
      { id:'rb1_9', title:'Opinion Language — Reading', level:'B1', type:'multiple_choice', lesson:'Opinions', phase:'post',
        text:`GIVING & RESPONDING TO OPINIONS\n\nGIVING YOUR OPINION:\n"In my opinion..." / "I think..." / "I believe..."\n"From my perspective..." / "As far as I'm concerned..."\n"I feel strongly that..." / "I'm convinced that..."\n\nASKING FOR OPINIONS:\n"What do you think about...?"\n"How do you feel about...?"\n"What's your take on...?"\n\nAGREEING: "Exactly!" / "I couldn't agree more." / "That's a good point."\nPARTIALLY AGREEING: "I see where you're coming from, but..."\nDISAGREEING: "I'm not sure about that." / "I respectfully disagree."`,
        questions:[
          {q:'"What\'s your take on this?" means:',options:['What do you want to take?','What is your opinion?','Do you agree?','Are you sure?'],answer:1},
          {q:'"I couldn\'t agree more!" expresses:',options:['Strong disagreement','Partial agreement','Strong agreement','Uncertainty'],answer:2},
          {q:'"I see where you\'re coming from, but..." shows:',options:['Complete agreement','Ignoring the other person','Partial agreement/polite disagreement','Changing the subject'],answer:2},
          {q:'Which BEST introduces a personal opinion?',options:['"The news says..."','According to statistics..."','"In my opinion..."','"Someone told me..."'],answer:2},
        ]
      },
      { id:'rb1_10', title:'Brazilian Culture — Reading', level:'B1', type:'multiple_choice', lesson:'Brazilian Culture', phase:'post',
        text:`Brazil is the largest country in South America and the fifth largest in the world, home to over 215 million people.\n\nCultural highlights:\n• CARNIVAL: The world's biggest festival, celebrated 40 days before Easter with samba, costumes and parades.\n• FEIJOADA: A rich black bean stew with pork, considered the national dish.\n• FUTEBOL: Football is more than a sport — it's a cultural identity. Brazil has won the FIFA World Cup 5 times.\n• MUSIC: Brazil gave the world samba, bossa nova, forró and funk.\n• FAMILY VALUES: Family gatherings are central to Brazilian life, especially Sunday lunches.\n\nWhen describing your culture in English:\n"Brazil is known for..." / "One thing that makes Brazil unique is..."\n"Brazilians are proud of..." / "An important tradition is..."`,
        questions:[
          {q:'How many times has Brazil won the FIFA World Cup?',options:['3','4','5','6'],answer:2},
          {q:'Feijoada is described as:',options:['A dessert','A drink','A black bean stew with pork','A type of music'],answer:2},
          {q:'When does Carnival take place?',options:['At Christmas','40 days before Easter','At New Year','In July'],answer:1},
          {q:'"Brazil is known for its diversity" — best continued with:',options:['...it has no culture.','...including music, food, and people from many backgrounds.','...it is a small country.','...it has one language only.'],answer:1},
        ]
      },
      { id:'rb1_11', title:'Phrasal Verbs GET — Reading', level:'B1', type:'multiple_choice', lesson:'Phrasal Verbs 1', phase:'post',
        text:`PHRASAL VERBS WITH "GET"\n\nget up → wake up and rise from bed\nget on → board a vehicle / have a good relationship ("get on with someone")\nget off → leave a vehicle / stop an activity\nget over → recover from illness or disappointment\nget along → have a good relationship with someone\nget away → escape / go on holiday ("get away from it all")\nget away with → do something wrong without being punished\nget back → return / receive something back\nget out → leave a place\nget through → finish / contact someone / survive a difficult time\n\nRemember: phrasal verbs are often idiomatic — the meaning is different from the individual words!`,
        questions:[
          {q:'"She got over the break-up quickly" means:',options:['She ended the relationship','She recovered from the disappointment','She got angry','She started a new relationship'],answer:1},
          {q:'"I can\'t get through to him" means:',options:['I can\'t reach him / contact him','I can\'t understand him','I don\'t like him','I can\'t walk past him'],answer:0},
          {q:'"He got away with cheating on the test" means:',options:['He got caught cheating','He cheated without consequences','He didn\'t cheat','He was punished'],answer:1},
          {q:'"We really get along well" means:',options:['We walk together','We argue often','We have a good relationship','We work in the same place'],answer:2},
        ]
      },
      { id:'rb1_12', title:'Storytelling Techniques — Reading', level:'B1', type:'multiple_choice', lesson:'Storytelling', phase:'post',
        text:`THE ART OF STORYTELLING IN ENGLISH\n\nA great story has:\n1. HOOK: Grab attention from the start\n "You won't believe what happened to me..."\n2. SETTING: Time and place\n "It was a Tuesday evening in downtown São Paulo..."\n3. CHARACTERS: Who is involved\n4. CONFLICT/TENSION: The problem or challenge\n5. CLIMAX: The peak of tension\n6. RESOLUTION: How it ends\n\nUseful storytelling language:\n• "So there I was..." / "Out of nowhere..."\n• "Just when I thought..." / "Suddenly..."\n• "Long story short..." / "To cut a long story short..."\n• "You'll never guess what happened next..."`,
        questions:[
          {q:'"You won\'t believe what happened to me!" is used as:',options:['The resolution','The setting','A hook to grab attention','The climax'],answer:2},
          {q:'"Long story short..." means:',options:['Tell the whole story','Skip to the main point','Start from the beginning','Add more details'],answer:1},
          {q:'The CLIMAX of a story is:',options:['The beginning','The setting','The moment of highest tension','The introduction of characters'],answer:2},
          {q:'"Suddenly, the lights went out!" creates:',options:['Resolution','Background information','Tension and surprise','The hook'],answer:2},
        ]
      },
      { id:'rb1_13', title:'Past Participle — Grammar', level:'B1', type:'multiple_choice', lesson:'The Participle', phase:'post',
        text:`PAST PARTICIPLE — forms and uses\n\nFORMING PAST PARTICIPLE:\nRegular verbs: verb + -ed (walk → walked, finish → finished)\nIrregular verbs: must be memorised!\n• go → gone / eat → eaten / write → written\n• see → seen / speak → spoken / break → broken\n• give → given / take → taken / know → known\n\nUSES:\n1. Present perfect: "I have never eaten sushi."\n2. Passive voice: "The report was written by Ana."\n3. Adjective: "a broken window" / "a spoken language"\n4. Participle phrase: "Having finished his work, he left."\n\nTip: Don't confuse with simple past!\n• "She wrote the email." (simple past)\n• "She has written the email." (present perfect with past participle)`,
        questions:[
          {q:'Past participle of "speak":',options:['speaked','spoke','spoken','speaking'],answer:2},
          {q:'"The car was stolen" uses past participle in:',options:['Present perfect','Passive voice','Adjective form','Participle phrase'],answer:1},
          {q:'"Having eaten dinner, they watched a film." — "having eaten" is:',options:['Simple past','Present participle','Past participle phrase','Future form'],answer:2},
          {q:'Which uses past participle CORRECTLY?',options:['"She has wrote the report."','"He have eaten lunch."','"They have gone home."','"I has seen the film."'],answer:2},
        ]
      },
      { id:'rb1_14', title:'Present Perfect — Grammar', level:'B1', type:'multiple_choice', lesson:'Have You Ever...?', phase:'post',
        text:`PRESENT PERFECT — connecting past to present\n\nFORMULA: HAVE/HAS + past participle\n\nUSE 1 — Life experiences (unspecified time):\n"Have you ever been to Japan?" / "I've never tried sushi."\n\nUSE 2 — Recent past with present relevance:\n"I've lost my keys!" / "She's just arrived."\n\nUSE 3 — With yet, already, still, just:\n"Have you eaten yet?" / "I've already seen that film."\n"She's just called." / "He still hasn't replied."\n\nIMPORTANT: For specific past times, use SIMPLE PAST:\n"Have you been to Japan?" → "Yes! I went in 2019."\n• Been to Japan ✓ (present perfect — experience)\n• Went in 2019 ✓ (simple past — specific time)`,
        questions:[
          {q:'"Have you ever eaten escargot?" asks about:',options:['A specific time in the past','A life experience','A future plan','A current action'],answer:1},
          {q:'Complete: "I ___ never ___ to Australia."',options:['have / been','has / gone','have / went','did / go'],answer:0},
          {q:'After saying "Yes, I have" to a present perfect question, you use ___ for details:',options:['Present perfect again','Simple past','Future tense','Present simple'],answer:1},
          {q:'"She has just arrived" means:',options:['She arrived a long time ago','She arrived very recently','She will arrive soon','She is arriving now'],answer:1},
        ]
      },

      // ── L46: ALREADY / YET — Reading (post) ──────────────────────────
      { id:'rb1_15', title:'Already / Yet — Reading', level:'B1', type:'multiple_choice', lesson:'Already / Yet', phase:'post',
        text:`ALREADY and YET with Present Perfect\n\nALREADY — something happened sooner than expected:\n• "I've already eaten, thanks." (sooner than expected)\n• "She's already finished the project!" (impressive/surprising)\n• Position: between have and past participle, or at end\n\nYET — used in negatives and questions:\n• "Have you called him yet?" (question — has it happened?)\n• "I haven't seen that film yet." (negative — hasn't happened)\n• "Not yet." (short answer)\n• Position: at the end of the sentence\n\nMEMORY TIP:\n• ALREADY = yes, it happened (positive — surprising timing)\n• YET = no, it hasn't happened / has it happened? (negative/question)`,
        questions:[
          {q:'"I\'ve already booked the tickets!" suggests:',options:['The speaker hasn\'t booked yet','The speaker booked sooner than expected','The speaker will book later','The speaker forgot to book'],answer:1},
          {q:'"Have you finished yet?" is used in:',options:['A positive statement','An affirmative sentence','A question expecting "yes" or "not yet"','A past tense sentence'],answer:2},
          {q:'Complete: "She hasn\'t replied to my email ___."',options:['already','yet','just','ever'],answer:1},
          {q:'Complete: "Don\'t buy it — I\'ve ___ got one at home."',options:['yet','never','already','still'],answer:2},
        ]
      },

      // ── L47: FINAL REVIEW B1 ─────────────────────────────────────────
      { id:'rb1_16', title:'B1 Final Review — Pre-class', level:'B1', type:'multiple_choice', lesson:'Final Review B1', phase:'pre',
        text:`B1 FINAL REVIEW — Test your knowledge!\n\nThis review covers the main grammar points from B1:\n• Comparatives and superlatives\n• Will and going to (future)\n• First and second conditional\n• Present perfect (yet/already/ever/never)\n• Past participle\n• Phrasal verbs\n• Giving opinions\n\nRead each question carefully and choose the best answer.`,
        questions:[
          {q:'Complete with COMPARATIVE: "This exercise is ___ than the last one."',options:['the most difficult','more difficult','most difficultier','difficulter'],answer:1},
          {q:'Which sentence uses FIRST CONDITIONAL correctly?',options:['"If she would study, she passes."','"If it rains, I will stay home."','"If he will come, I stay."','"If they went, they would enjoy."'],answer:1},
          {q:'Complete with PRESENT PERFECT: "Have you ___ tried sushi?"',options:['ever','already','yet','still'],answer:0},
          {q:'Complete: "If I ___ more money, I ___ travel more." (second conditional)',options:['have / will','had / would','would have / travel','have / would'],answer:1},
          {q:'Phrasal verb: "I need to ___ early tomorrow for work." (wake up)',options:['get over','get away','get up','get on'],answer:2},
        ]
      },
      { id:'rb1_17', title:'B1 Final Review — Post-class', level:'B1', type:'multiple_choice', lesson:'Final Review B1', phase:'post',
        text:`B1 FINAL REVIEW — Post-class consolidation\n\nReview and consolidate everything from B1 with these final questions.`,
        questions:[
          {q:'Complete with SUPERLATIVE: "That was ___ film I\'ve ever seen!"',options:['more interesting','the most interesting','the interestingest','most interesting'],answer:1},
          {q:'Which uses WILL correctly (spontaneous decision)?',options:['"I\'m going to answer — I planned it."','"I\'ll answer the door!" (deciding now)','I am answer the door."','"I would answer it."'],answer:1},
          {q:'Complete: "She ___ already ___ her homework." (present perfect)',options:['has / finished','have / finished','had / finished','is / finished'],answer:0},
          {q:'Which is correct PAST PARTICIPLE usage?',options:['"I have wrote the email."','"She has spoke to him."','"They have gone home."','"He have eaten lunch."'],answer:2},
          {q:'"I\'ve already seen that film, but I haven\'t read the book ___."',options:['already','ever','yet','never'],answer:2},
        ]
      },
    ]
  },
  listening: {
    label: 'Listening', icon: '🎧', color: '#378add',
    activities: [
      // ── L1 ──────────────────────────────────────────────────────────
      { id:'l0', title:'Learn the Alphabet — American English', level:'A1', type:'listening_video', lesson:'The American Pronunciation', phase:'pre',
        youtubeId:'PWBt0e0o00o', startTime:0, endTime:180,
        instruction:'Watch and learn the American English alphabet! Pay attention to how each letter is pronounced. This will help you spell your name and understand others when they spell words. Then answer the questions!',
        audioText:`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z. Now let's practice: How do you spell your name? My name is Sarah — S-A-R-A-H. The letter H sounds like "aitch" in American English.`,
        questions:[
          {q:'How many letters are in the English alphabet?',options:['24','25','26','27'],answer:2},
          {q:'How do you spell the name "John"?',options:['J-O-N','J-H-O-N','J-O-H-N','G-O-H-N'],answer:2},
          {q:'Which letter sounds like "double-u"?',options:['V','U','Y','W'],answer:3},
          {q:'How do you ask someone to spell their name?',options:['"What is your name?"','"Can you spell that?"','"How do you write?"','"What letter?"'],answer:1},
        ]
      },
      // ── L2 ──────────────────────────────────────────────────────────
      { id:'l1', title:'Jenny at the Hotel', level:'A1', type:'listening_video', lesson:'The Greetings', phase:'pre',
        youtubeId:'EflkHGJbxnA', startTime:56, endTime:286,
        instruction:'Watch from 0:56 to 4:46. Pay attention to how Jenny greets the receptionist, spells her name, and checks in. Then answer the questions!',
        audioText:`Jenny: Hello. I have a reservation. My name is Jennifer Zielinski.\nReceptionist: Can you spell that?\nJenny: Z-I-E-L-I-N-S-K-I.\nReceptionist: For five nights?\nJenny: Yes, that's right.\nReceptionist: Passport, please?\nJenny: Here you are.\nReceptionist: Sign here. Here's your key — room 306, third floor. The lift is over there.\nJenny: The lift — oh, the elevator!\nReceptionist: Yes, enjoy your stay!\nJenny: Thank you!`,
        questions:[
          {q:'What is Jenny\'s last name?',options:['Zelinski','Zielinski','Zielinsky','Zielinksi'],answer:1},
          {q:'How many nights is Jenny staying?',options:['3 nights','4 nights','5 nights','6 nights'],answer:2},
          {q:'What room does Jenny get?',options:['Room 306','Room 360','Room 603','Room 316'],answer:0},
          {q:'What does "lift" mean?',options:['Stairs','Reception','Elevator','Exit'],answer:2},
        ]
      },
      { id:'l2', title:'Meet Sarah!', level:'A1', type:'listening_video', lesson:'The Greetings', phase:'pre',
        youtubeId:'fLYzVdpseSA', startTime:0, endTime:60,
        instruction:'Listen to Sarah introducing herself. Pay attention to how she spells her name, where she is from, her age, and how she feels. Then answer!',
        audioText:`Sarah: Hi! My name is Sarah — S-A-R-A-H. Nice to meet you!\nI'm from New York but now I live in a different city. I'm 22 years old. I enjoy music, coffee, and meeting new people.\nToday I'm feeling great — just a little tired because I woke up early.`,
        questions:[
          {q:'How does Sarah spell her name?',options:['S-E-R-A-H','S-A-R-A-H','S-A-R-R-A-H','S-A-R-A'],answer:1},
          {q:'Where is Sarah from?',options:['Los Angeles','London','New York','Chicago'],answer:2},
          {q:'How old is Sarah?',options:['20','21','23','22'],answer:3},
          {q:'How is Sarah feeling?',options:['Sick and tired','Great, a little tired','Nervous','Bored'],answer:1},
        ]
      },
      { id:'l3', title:'Where Are You From?', level:'A1', type:'listening_video', lesson:'The Greetings', phase:'post',
        youtubeId:'31y2Bq1RYQA', startTime:60, endTime:297,
        instruction:'Watch Tim, Sian, Buli and Georgie talk about where they are from. Then answer the questions!',
        audioText:`Tim: I'm from Oxford. I live in a house in London with housemates.\nSian: I'm from Swansea. I live in Brighton with my family.\nBuli: I'm from Beijing. I live in a flat in Cambridge on my own.\nGeorgie: I'm from Petworth. I live in a flat in London with flatmates.`,
        questions:[
          {q:'Where is Sian from?',options:['Oxford','Beijing','Swansea','Petworth'],answer:2},
          {q:'Where does Buli live now?',options:['London','Brighton','Oxford','Cambridge'],answer:3},
          {q:'Who lives in a flat?',options:['Tim and Sian','Sian and Georgie','Buli and Georgie','Tim and Buli'],answer:2},
          {q:'Who does Sian live with?',options:['Flatmates','On her own','Housemates','Her family'],answer:3},
        ]
      },
      // ── L3 ──────────────────────────────────────────────────────────
      { id:'l4', title:'John & Elizabeth — First Meeting', level:'A1', type:'listening_video', lesson:'The Introductions', phase:'pre',
        youtubeId:'YGTEXtptvGM', startTime:0, endTime:182,
        instruction:'Watch John and Elizabeth meeting for the first time. Pay attention to where they are from and what they do. Then answer!',
        audioText:`John: Hello! My name is John. Nice to meet you!\nElizabeth: I am from Spain. I am Spanish. I live in Madrid.\nJohn: I am from the United States. I am American. I live in New York.\nElizabeth: Do you speak Spanish?\nJohn: No. I speak English and French. I am a businessman.\nElizabeth: I am a teacher. It has been a pleasure!`,
        questions:[
          {q:'Where is Elizabeth from?',options:['The United States','France','Spain','England'],answer:2},
          {q:'What does John do?',options:['He is a teacher','He is a businessman','He is a student','He is a doctor'],answer:1},
          {q:'What languages does John speak?',options:['English and Spanish','Spanish and French','English and French','Italian and English'],answer:2},
          {q:'"I am glad to meet you" means:',options:['I am tired','I am happy to meet you','I want to leave','I do not know you'],answer:1},
        ]
      },
      { id:'l5', title:'Introducing Yourself', level:'A1', type:'listening_video', lesson:'The Introductions', phase:'post',
        youtubeId:'P3VcHnECgbs', startTime:0, endTime:75,
        instruction:'Watch this ESL video about introducing yourself. Pay attention to key phrases. Then answer!',
        audioText:`Anna: Hi! My name is Anna. Nice to meet you!\nDavid: Hello! I'm David. Where are you from, Anna?\nAnna: I'm from Brazil. And you?\nDavid: I'm from Canada. What do you do?\nAnna: I'm a student. What about you?\nDavid: I'm an engineer. It's great to meet you!\nAnna: You too! See you around!`,
        questions:[
          {q:'"Nice to meet you" — same meaning:',options:['See you later!','It\'s great to meet you!','How are you?','Where are you from?'],answer:1},
          {q:'"What do you do?" means:',options:['What are you doing now?','What is your hobby?','What is your job?','What did you do yesterday?'],answer:2},
          {q:'Where is Anna from?',options:['Canada','The United States','Brazil','Australia'],answer:2},
          {q:'"See you around!" means:',options:['I will never see you again','We will probably see each other again','Look around you!','Let\'s go around'],answer:1},
        ]
      },
      // ── L4 ──────────────────────────────────────────────────────────
      { id:'l6', title:'Street Interview — Where Are You From?', level:'A1', type:'listening_video', lesson:'Countries and Nationalities', phase:'pre',
        youtubeId:'qaand6YZhc0', startTime:0, endTime:65,
        instruction:'Watch real street interviews! Pay attention to where people are from and how they spell their names. Then answer!',
        audioText:`Natalie: I'm from Oklahoma and Bristol in England.\nDeepti: My name is Deepti Gupta. D-E-E-P-T-I. G-U-P-T-A.\nInterviewer: Are you from the United States?\nDeepti: No, I'm from India.`,
        questions:[
          {q:'Where is Natalie from?',options:['Oklahoma only','Bristol only','Oklahoma and Bristol, England','India'],answer:2},
          {q:'How do you spell Deepti\'s last name?',options:['G-U-P-T-A','G-O-O-P-T-A','G-U-P-T-E','G-A-P-T-A'],answer:0},
          {q:'Is Deepti from the United States?',options:['Yes, she is.','No, from England.','No, from India.','No, from Canada.'],answer:2},
          {q:'Chris is Natalie\'s:',options:['brother','friend','husband','teacher'],answer:2},
        ]
      },
      { id:'l7', title:'Countries & Nationalities — TV Show', level:'A1', type:'listening_video', lesson:'Countries and Nationalities', phase:'post',
        youtubeId:'wYbTtiosCFE', startTime:0, endTime:112,
        instruction:'Watch Kim talk about where she is from on a TV show. Then answer the questions!',
        audioText:`Jay: Where are you from? Are you Canadian?\nKim: No, I'm not.\nJay: Brazilian?\nKim: No. I'm from Jamaica!\nJay: Whereabouts in Jamaica?\nKim: I'm from Kingston, the capital. It is big and crowded but very interesting!`,
        questions:[
          {q:'Where is Kim from?',options:['Canada','Brazil','Turkey','Jamaica'],answer:3},
          {q:'What is the capital of Jamaica?',options:['Montego Bay','Kingston','Nassau','Havana'],answer:1},
          {q:'How does Kim describe Kingston?',options:['Small and quiet','Big, crowded and interesting','Beautiful and peaceful','Old and boring'],answer:1},
          {q:'Kim is nervous because:',options:['She forgot her lines','She doesn\'t like Jay','She is on TV with millions watching','She is from Jamaica'],answer:2},
        ]
      },
      // ── L5 ──────────────────────────────────────────────────────────
      { id:'l8', title:'What Is Your Job?', level:'A1', type:'listening_video', lesson:'The Occupations', phase:'pre',
        youtubeId:'0x1WRY4fvz4', startTime:0, endTime:120,
        instruction:'Watch people talk about their jobs! Pay attention to what they do, where they work, and how they feel about it. Then answer!',
        audioText:`Person 1: I'm a teacher. I teach math at a high school. I love it — very rewarding!\nPerson 2: I'm a nurse. I work at a hospital. Sometimes stressful but I love helping people.\nPerson 3: I'm a chef at an Italian restaurant. After work I'm too tired to cook!\nPerson 4: I'm an engineer at a tech company. Very creative and challenging. I love it!`,
        questions:[
          {q:'What does Person 1 teach?',options:['English','Science','Math','History'],answer:2},
          {q:'Where does the nurse work?',options:['At a school','At a restaurant','At an office','At a hospital'],answer:3},
          {q:'Why doesn\'t the chef cook at home?',options:['No food','Too tired after work','Doesn\'t like cooking','Kitchen is broken'],answer:1},
          {q:'How does the engineer describe the job?',options:['Boring and easy','Stressful and hard','Creative and challenging','Simple and relaxing'],answer:2},
        ]
      },
      { id:'l9', title:'What Is Your Dream Job?', level:'A1', type:'listening_video', lesson:'The Occupations', phase:'post',
        youtubeId:'cFdCzN7RYbw', startTime:0, endTime:150,
        instruction:'Watch people talk about their dream jobs! Pay attention to what they want to be and why. Then answer!',
        audioText:`Person 1: My dream is to be a singer! I love music.\nPerson 2: I want to be a doctor and save lives.\nPerson 3: My dream is to be a teacher and help children learn.\nPerson 4: I want to be an entrepreneur — start my own business and be my own boss!`,
        questions:[
          {q:'Person 1 wants to be a:',options:['Doctor','Teacher','Singer','Entrepreneur'],answer:2},
          {q:'Why does Person 2 want to be a doctor?',options:['To make money','To travel','To help people and save lives','To work in a hospital'],answer:2},
          {q:'Why does Person 4 want to be an entrepreneur?',options:['For money','To be free and creative','Because it is easy','To travel the world'],answer:1},
          {q:'Person 3 wants to work with:',options:['Animals','Technology','Food','Children'],answer:3},
        ]
      },
      // ── L6 ──────────────────────────────────────────────────────────
      { id:'l10', title:'Ordering at a Coffee Shop', level:'A1', type:'listening_video', lesson:'At the Café', phase:'pre',
        youtubeId:'9nq9ocivltk', startTime:0, endTime:100,
        instruction:'Watch someone ordering at a coffee shop! Pay attention to what they order, how they ask, and how they pay. Then answer!',
        audioText:`Barista: Hi! What can I get you?\nCustomer: Can I have a medium latte please?\nBarista: Hot or iced?\nCustomer: Hot. With oat milk.\nBarista: Anything else?\nCustomer: A blueberry muffin!\nBarista: That's $7.50. Your name?\nCustomer: Sarah.\nBarista: Ready in a minute! Have a great day!`,
        questions:[
          {q:'What size coffee does Sarah order?',options:['Small','Large','Medium','Extra large'],answer:2},
          {q:'What milk does Sarah choose?',options:['Whole milk','Almond milk','No milk','Oat milk'],answer:3},
          {q:'How much does everything cost?',options:['$5.00','$10.00','$7.50','$8.50'],answer:2},
          {q:'What food does Sarah order?',options:['A croissant','A blueberry muffin','A sandwich','A cookie'],answer:1},
        ]
      },
      { id:'l11', title:'Real Conversation — Ordering at a Café', level:'A1', type:'listening_video', lesson:'At the Café', phase:'post',
        youtubeId:'bv6RQNrNGKQ', startTime:0, endTime:180,
        instruction:'Watch a real café conversation! Pay attention to polite ordering expressions. Then answer!',
        audioText:`Waiter: Good evening! My name is James, I'll be your server.\nCustomer: Can I start with a sparkling water?\nWaiter: Of course! Ready to order?\nCustomer: What do you recommend?\nWaiter: The pasta with mushrooms is very popular.\nCustomer: I'll have that! And a Caesar salad to start.\nWaiter: Excellent! I'll be right back!`,
        questions:[
          {q:'What is the waiter\'s name?',options:['John','Michael','James','Robert'],answer:2},
          {q:'What does the customer order to drink?',options:['Orange juice','Still water','Wine','Sparkling water'],answer:3},
          {q:'What does the waiter recommend?',options:['The salad','The pasta with mushrooms','The soup','The fish'],answer:1},
          {q:'"I\'ll be right back" means:',options:['I am leaving forever','I\'ll return very soon','Come with me','I forgot something'],answer:1},
        ]
      },
      // ── L7 ──────────────────────────────────────────────────────────
      { id:'l12', title:'Places in the City — Conversation', level:'A1', type:'listening_video', lesson:'The Places in the City', phase:'pre',
        youtubeId:'on_1sS6Ii8M', startTime:0, endTime:180,
        instruction:'Watch this conversation about places in the city and directions. Then answer the questions!',
        audioText:`Person A: Is there a bank near here?\nPerson B: Yes! On Main Street, next to the post office.\nPerson A: And a supermarket?\nPerson B: On Park Avenue — go straight and turn left at the traffic lights.\nPerson A: A pharmacy?\nPerson B: Opposite the hospital, on Oak Street.\nPerson A: Is there a park nearby?\nPerson B: City Park is 5 minutes away — turn right at the school!`,
        questions:[
          {q:'Where is the bank?',options:['On Park Avenue','On Main Street next to the post office','On Oak Street','Next to the school'],answer:1},
          {q:'How do you get to the supermarket?',options:['Turn right at the school','Opposite the hospital','Go straight and turn left at the lights','5 minutes from the park'],answer:2},
          {q:'Where is the pharmacy?',options:['Next to the bank','On Main Street','Opposite the hospital on Oak Street','Next to City Park'],answer:2},
          {q:'How far is City Park?',options:['2 minutes','10 minutes','5 minutes','On the corner'],answer:2},
        ]
      },
      // ── L8 ──────────────────────────────────────────────────────────
      { id:'l13', title:'The Family — Conversation', level:'A1', type:'listening_video', lesson:'The Family', phase:'pre',
        youtubeId:'v9EU41cuhHY', startTime:0, endTime:180,
        instruction:'Watch this conversation about family members! Pay attention to the vocabulary. Then answer!',
        audioText:`Person A: Tell me about your family!\nPerson B: I live with my parents and two brothers.\nPerson A: Are they retired?\nPerson B: My father is 65 and retired. My mother is a teacher.\nPerson A: Sisters?\nPerson B: No — but I have a sister-in-law! My oldest brother got married last year.\nPerson A: Grandparents?\nPerson B: My grandmother lives with us — 82 and very active! My grandfather passed away 5 years ago.\nPerson A: Do you get together?\nPerson B: Every Sunday for lunch!`,
        questions:[
          {q:'How many brothers does Person B have?',options:['One','Two','Three','None'],answer:1},
          {q:'What does Person B\'s mother do?',options:['Retired','Doctor','Teacher','Chef'],answer:2},
          {q:'Why does Person B have a sister-in-law?',options:['His sister got married','His oldest brother got married','His father remarried','His mother has a sister'],answer:1},
          {q:'When does the family get together?',options:['Every Saturday for dinner','Every Sunday for lunch','Every Friday','Every holiday'],answer:1},
        ]
      },
      // ── L9 ──────────────────────────────────────────────────────────
      { id:'l14', title:'Future Plans — Going To', level:'A1', type:'listening_video', lesson:'You Are Going To…', phase:'pre',
        youtubeId:'OlyYE6USuO0', startTime:0, endTime:180,
        instruction:'Watch this conversation about future plans using "going to"! Then answer!',
        audioText:`Person A: What are you going to do this weekend?\nPerson B: Visit my family Saturday — my sister is going to cook a big dinner!\nPerson A: Sunday?\nPerson B: I'm going to study for my English test.\nPerson A: Me too! Let's study together at the library!\nPerson B: What time?\nPerson A: 10 o'clock? I'm going to bring coffee!\nPerson B: We're going to do great on the test!`,
        questions:[
          {q:'What is Person B going to do Saturday?',options:['Study','Go to library','Visit family','Cook dinner'],answer:2},
          {q:'What is Person B\'s sister going to do?',options:['Visit them','Travel','Cook a big dinner','Study English'],answer:2},
          {q:'Where are they going to study?',options:['At home','At a café','At the library','At school'],answer:2},
          {q:'What is Person A going to bring?',options:['Books','Coffee','Food','Notebooks'],answer:1},
        ]
      },
      // ── L10 ──────────────────────────────────────────────────────────
      { id:'l15', title:'At the Airport — Conversation', level:'A1', type:'listening_video', lesson:'At the Travel Agency', phase:'pre',
        youtubeId:'Sn45WTzoAKg', startTime:0, endTime:180,
        instruction:'Watch this airport check-in conversation! Pay attention to travel vocabulary. Then answer!',
        audioText:`Agent: Can I see your passport and ticket?\nPassenger: Here you are.\nAgent: Checking any bags?\nPassenger: One suitcase and one carry-on.\nAgent: It's 22 kilos — within the 23 kilo limit. Window or aisle seat?\nPassenger: Window please.\nAgent: Here's your boarding pass. Gate 14, departs at 10:30. Be there by 10:00!\nPassenger: Thank you!`,
        questions:[
          {q:'How many bags is the passenger checking?',options:['Two suitcases','No bags','One suitcase and one carry-on','Just a carry-on'],answer:2},
          {q:'How much does the suitcase weigh?',options:['23 kilos','20 kilos','22 kilos','25 kilos'],answer:2},
          {q:'What seat does the passenger choose?',options:['Aisle','Middle','Window','Front'],answer:2},
          {q:'What time does the flight depart?',options:['10:00','10:30','11:00','9:30'],answer:1},
        ]
      },
      // ── L11 ──────────────────────────────────────────────────────────
      { id:'l16', title:'Was / Were — Conversation', level:'A1', type:'listening_video', lesson:'I Was So Nervous!', phase:'pre',
        youtubeId:'FG0USQaru8o', startTime:0, endTime:180,
        instruction:'Watch this conversation using "was" and "were" in the past! Then answer!',
        audioText:`Person A: How was your first day at the new job?\nPerson B: Amazing but I was so nervous!\nPerson A: Were your colleagues friendly?\nPerson B: Yes, very welcoming! My boss was really helpful.\nPerson A: Was the office nice?\nPerson B: Beautiful — 20th floor with a great view!\nPerson B: By lunchtime I was completely comfortable.`,
        questions:[
          {q:'How did Person B feel on the first day?',options:['Bored','Angry','Nervous but amazed','Sad'],answer:2},
          {q:'Were the colleagues friendly?',options:['No, they were cold','Yes, very welcoming','Some were friendly','They were busy'],answer:1},
          {q:'Where was the office?',options:['Ground floor','5th floor','20th floor','Basement'],answer:2},
          {q:'When did Person B feel comfortable?',options:['After a week','By lunchtime','The next day','After meeting the boss'],answer:1},
        ]
      },
      // ── L12 ──────────────────────────────────────────────────────────
      { id:'l17', title:'Where Were You? — Conversation', level:'A1', type:'listening_video', lesson:'Where Were You Yesterday?', phase:'pre',
        youtubeId:'1DymiK883-o', startTime:11, endTime:200,
        instruction:'Watch this conversation about what happened yesterday! Pay attention to Simple Past verbs. Then answer!',
        audioText:`Person A: Where were you yesterday? You didn't answer!\nPerson B: I was at the doctor's in the morning — just a check-up!\nPerson A: Did you watch the football game?\nPerson B: No, I watched a movie. I was really tired.\nPerson A: I worked then visited my parents. My mom cooked her famous pasta!`,
        questions:[
          {q:'Where was Person B in the morning?',options:['At work','At the supermarket','At home','At the doctor\'s'],answer:3},
          {q:'What did Person B do instead of watching the game?',options:['Went to the supermarket','Visited parents','Watched a movie','Played football'],answer:2},
          {q:'Why didn\'t Person B watch the game?',options:['Doesn\'t like football','Was at the doctor\'s','Watched a movie — was tired','Went out'],answer:2},
          {q:'What did Person A\'s mom cook?',options:['Rice and beans','Her famous pasta','Grilled chicken','A birthday cake'],answer:1},
        ]
      },
      // ── L13 ──────────────────────────────────────────────────────────
      { id:'l18', title:'A1 Full Review — Listening', level:'A1', type:'listening_video', lesson:'Final Review', phase:'pre',
        youtubeId:'Cgk8RNLthZ4', startTime:0, endTime:180,
        instruction:'Final review! This conversation covers all A1 topics. Listen carefully and answer!',
        audioText:`Sarah: Hi! I'm Sarah!\nJames: Hello! I'm James. Nice to meet you!\nSarah: Are you from here?\nJames: No, I'm from London — I'm British. I moved here 2 years ago.\nSarah: What do you do?\nJames: I'm a software engineer. I work downtown near the city park.\nSarah: Do you have family here?\nJames: Not yet. My family is in London but I'm going to visit them next month!\nSarah: Were you nervous when you first moved?\nJames: Very nervous! But now I feel completely at home.`,
        questions:[
          {q:'Where is James from?',options:['New York','Sydney','London','Paris'],answer:2},
          {q:'What does James do?',options:['Teacher','Software engineer','Doctor','Chef'],answer:1},
          {q:'What are James\'s future plans?',options:['Move back to London','Change jobs','Visit family next month','Move to Paris'],answer:2},
          {q:'How did James feel when he first moved?',options:['Excited and happy','Very nervous','Angry','Bored'],answer:1},
        ]
      },

      // ── A2 LISTENING ─────────────────────────────────────────────────
      { id:'l19a2', title:'Parts of the House — Conversation', level:'A2', type:'listening_video', lesson:'The Parts of the House', phase:'pre',
        youtubeId:'cFgmC5agPjA', startTime:0, endTime:180,
        instruction:'Watch this conversation about parts of the house! Then answer the questions!',
        audioText:`Person B: We have a living room, dining room and kitchen downstairs. Upstairs there are 3 bedrooms and 2 bathrooms. My favorite room is the living room — big sofa and a fireplace!`,
        questions:[
          {q:'How many bedrooms?',options:['One','Two','Three','Four'],answer:2},
          {q:'Favorite room?',options:['Kitchen','Bedroom','Living room','Garden'],answer:2},
          {q:'What does the living room have?',options:['Big table','Big sofa and fireplace','TV and desk','Bookshelves'],answer:1},
          {q:'How is the kitchen?',options:['Old and small','Modern with lots of cupboards','Simple','Dark'],answer:1},
        ]
      },
      { id:'l20a2', title:'Do or Does? — Conversation', level:'A2', type:'listening_video', lesson:'Do or Does?', phase:'pre',
        youtubeId:'PvFVRNr3M_Q', startTime:0, endTime:180,
        instruction:'Watch this conversation using Do and Does! Then answer the questions!',
        audioText:`DO = I, you, we, they. DOES = he, she, it. Does she work here? No, she doesn't. Do they like pizza? Yes, they do! Everyone DOES their homework.`,
        questions:[
          {q:'DO is used with:',options:['he, she, it','I, you, we, they','everyone','only they'],answer:1},
          {q:'Complete: "___ she work here?"',options:['Do','Does','Did','Is'],answer:1},
          {q:'"Do they like pizza?" →',options:['"Yes, they does."','"Yes, they do!"','"Yes, he does."','"Yes, she do."'],answer:1},
          {q:'"Everyone" uses:',options:['DO','DID','DOES','ARE'],answer:2},
        ]
      },
      { id:'l21a2', title:'Housework — Conversation', level:'A2', type:'listening_video', lesson:'Housework', phase:'pre',
        youtubeId:'uypw2Tf2v5A', startTime:0, endTime:180,
        instruction:'Watch this conversation about household chores! Then answer the questions!',
        audioText:`Ben: I vacuum every weekend and take out the trash daily. My wife cooks. I do the dishes after dinner. Anna: I do laundry but I never iron. Ben: I don't like cleaning the bathroom.`,
        questions:[
          {q:'What does Ben do every day?',options:['Vacuum','Take out the trash','Do dishes','Cook'],answer:1},
          {q:'Who usually cooks?',options:['Ben','His son','His wife','His mother'],answer:2},
          {q:'What does Anna HATE?',options:['Laundry','Cooking','Cleaning bathroom','Ironing'],answer:3},
          {q:'What does Ben NOT like?',options:['Vacuuming','Ironing','Cleaning bathroom','Cooking'],answer:2},
        ]
      },
      { id:'l22a2', title:'Routines — Conversation', level:'A2', type:'listening_video', lesson:'Routines', phase:'pre',
        youtubeId:'bq6GBbh3uhU', startTime:0, endTime:180,
        instruction:'Watch this conversation about daily routines! Then answer the questions!',
        audioText:`Wake up 6:30. Shower then breakfast — coffee and toast. Leave home 8:00 by bus (30 min). Finish work 6pm. Gym on Tuesdays and Thursdays.`,
        questions:[
          {q:'Wake up time?',options:['6:00','6:30','7:00','7:30'],answer:1},
          {q:'Breakfast?',options:['Cereal','Eggs daily','Coffee and toast','Nothing'],answer:2},
          {q:'How to work?',options:['Car','Bicycle','Bus','On foot'],answer:2},
          {q:'Gym days?',options:['Every day','Mon/Wed','Tue/Thu','Weekends'],answer:3},
        ]
      },
      { id:'l23a2', title:'Would You…? — Conversation', level:'A2', type:'listening_video', lesson:'Would You…?', phase:'pre',
        youtubeId:'581385218', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation using "Would you...?" for polite offers. Then answer the questions!',
        audioText:`Would you like coffee? I'd love some — with milk and a little sugar. Would you mind if I opened the window? Not at all! Would you like to start the meeting?`,
        questions:[
          {q:'What does Person B choose?',options:['Tea','Black coffee','Coffee with milk and sugar','Water'],answer:2},
          {q:'Does Person B want food?',options:['Yes, a sandwich','Yes, a biscuit','No, nothing','Yes, cake'],answer:2},
          {q:'"Would you mind?" — Person B says:',options:['"Yes, I mind!"','"Not at all!"','"No, don\'t."','"I would mind."'],answer:1},
          {q:'Correct use of WOULD:',options:['"I would went."','"Would you like tea?"','"She would is here."','"They would are happy."'],answer:1},
        ]
      },
      { id:'l24a2', title:'Food Time! — Conversation', level:'A2', type:'listening_video', lesson:'Food Time!', phase:'pre',
        youtubeId:'426409746', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation about food! Then answer the questions!',
        audioText:`Yesterday I made pasta with tomato sauce! I prefer fish and vegetables — almost vegetarian. Favorite food: sushi! Person A prefers grilled chicken with rice and salad.`,
        questions:[
          {q:'What did Person B cook yesterday?',options:['Grilled chicken','Sushi','Pasta with tomato sauce','Fish'],answer:2},
          {q:'Favorite food?',options:['Pasta','Pizza','Grilled chicken','Sushi'],answer:3},
          {q:'Does Person A like raw fish?',options:['Loves it','No, prefers cooked','Sometimes','Only sushi'],answer:1},
          {q:'Person A\'s favorite?',options:['Sushi','Pasta','Grilled chicken with rice and salad','Vegetable soup'],answer:2},
        ]
      },
      { id:'l25a2', title:'Can or Could? — Conversation', level:'A2', type:'listening_video', lesson:'I Can or I Could?!', phase:'pre',
        youtubeId:'295283272', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation using CAN and COULD! Then answer the questions!',
        audioText:`Can you help me? This box is heavy! Could you put it in the bedroom? Could you speak more slowly? When I was young I couldn't speak English at all. Now I can speak it quite well!`,
        questions:[
          {q:'Why does Person A need help?',options:['Box too big','Box very heavy','Can\'t open door','Lost'],answer:1},
          {q:'Person B asks Person A to:',options:['Speak faster','Speak more slowly','Repeat','Write it down'],answer:1},
          {q:'Could Person B speak English when young?',options:['Yes, very well','A little','No, not at all','A few words'],answer:2},
          {q:'Ability in the past:',options:['"I can\'t do it yesterday."','"I couldn\'t do it."','"I didn\'t can do it."','"I not could do it."'],answer:1},
        ]
      },
      { id:'l26a2', title:'Shopping Time! — Conversation', level:'A2', type:'listening_video', lesson:'Shopping Time!', phase:'pre',
        youtubeId:'544156694', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this shopping conversation! Then answer the questions!',
        audioText:`Jacket is $89.99, 20% off. Do you have it in blue? Sizes S, M, L. Can I try medium? Fits perfectly! Pay by card. Total: $71.99.`,
        questions:[
          {q:'Original price?',options:['$71.99','$89.99','$80.00','$99.99'],answer:1},
          {q:'What size tried?',options:['Small','Large','Medium','XL'],answer:2},
          {q:'How does customer pay?',options:['Cash','By card','By check','Voucher'],answer:1},
          {q:'Final price after discount?',options:['$89.99','$80.00','$75.00','$71.99'],answer:3},
        ]
      },
      { id:'l27a2', title:'What Did You Do? — Conversation', level:'A2', type:'listening_video', lesson:'What Did You Do?', phase:'pre',
        youtubeId:'1057737854', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation about last weekend! Then answer the questions!',
        audioText:`Saturday: went to cinema, saw action movie, ate at Italian restaurant. Sunday: stayed home, cleaned house, cooked dinner, walked in the park. Weather was beautiful!`,
        questions:[
          {q:'Where on Saturday?',options:['Restaurant','Park','Cinema','Friend\'s house'],answer:2},
          {q:'What did they eat?',options:['Pizza','Italian restaurant food','Chinese food','Cooked at home'],answer:1},
          {q:'Sunday at home?',options:['Watched movies','Cleaned house and cooked','Had a party','Studied'],answer:1},
          {q:'Sunday morning weather?',options:['Rainy','Cold','Cloudy','Beautiful'],answer:3},
        ]
      },
      { id:'l28a2', title:'A Story in the Past', level:'A2', type:'listening_video', lesson:'A Story in the Past', phase:'pre',
        youtubeId:'Kii0C8F46eY', startTime:622, endTime:780,
        instruction:'Listen to this story in the past tense! Then answer the questions!',
        audioText:`A couple got lost camping — forgot the map. Took a shortcut. After 2 hours they were lost. They sat down, drank water, thought carefully. Found a river, followed it to a village where someone helped them.`,
        questions:[
          {q:'Why did they get lost?',options:['Walked too fast','Forgot the map','Wrong train','It was dark'],answer:1},
          {q:'What did they do when lost?',options:['Panicked','Called for help','Sat down, drank water, thought','Climbed a tree'],answer:2},
          {q:'How did they get back?',options:['Helicopter','Followed river to village','Used compass','Retraced steps'],answer:1},
          {q:'Moral of the story?',options:['Never go camping','Always bring a map and stay calm','Rivers are dangerous','Always bring a phone'],answer:1},
        ]
      },
      { id:'l29a2', title:'Final Review II — Listening', level:'A2', type:'listening_video', lesson:'The Final Review II', phase:'pre',
        youtubeId:'8yMgH8xHq2U', startTime:0, endTime:180,
        instruction:'Final A2 review! Listen carefully and answer the questions!',
        audioText:`Comprehensive A2 review covering present simple, past simple, would, can/could and everyday vocabulary.`,
        questions:[
          {q:'Tense for daily routines?',options:['Past simple','Future','Present simple','Present continuous'],answer:2},
          {q:'Correct use of "would":',options:['"I would go yesterday."','"Would you like some tea?"','"She would work tomorrow."','"They would is happy."'],answer:1},
          {q:'Complete: "She ___ cook well when young."',options:['can','could','would','did'],answer:1},
          {q:'Correct past simple question:',options:['"Did you went?"','"Did she go?"','"She did go?"','"Went she?"'],answer:1},
        ]
      },

      // ── B1 ───────────────────────────────────────────────────────────────
      { id:'lb1_1', title:'The Elevator Incident — Listening', level:'B1', type:'listening_video', lesson:'The Elevator Incident', phase:'pre',
        youtubeId:'ccwhI-jsibk', startTime:0, endTime:180,
        instruction:'Watch this argument scene in English! Pay attention to how people express frustration, defend themselves and resolve conflicts. Then answer the questions!',
        audioText:`Two people argue in an elevator about a misunderstanding. They use strong emotional language, then gradually calm down and find common ground.`,
        questions:[
          {q:'What is the main emotion at the start of the conversation?',options:['Happiness','Frustration and anger','Boredom','Excitement'],answer:1},
          {q:'Which phrase is used to defend oneself in an argument?',options:['"That\'s not what I meant!"','"Whatever."','"I agree completely."','"Let\'s change the subject."'],answer:0},
          {q:'How do the people resolve the conflict?',options:['They ignore each other','They apologize and explain','They call someone for help','They leave immediately'],answer:1},
          {q:'What tone do they use by the end?',options:['Still angry','Calm and understanding','Sarcastic','Confused'],answer:1},
        ]
      },
      { id:'lb1_2', title:'Best Thing I Never Had — Listening', level:'B1', type:'listening_video', lesson:'Best Thing I Never Had', phase:'pre',
        youtubeId:'5VGtCbFclgk', startTime:0, endTime:180,
        instruction:'Watch this discussion about superlatives! Pay attention to how people compare experiences using the best, the worst, the most. Then answer the questions!',
        audioText:`People discuss the best and worst experiences of their lives using superlatives naturally in conversation.`,
        questions:[
          {q:'Superlatives are used to compare:',options:['Two things equally','One thing against all others','Things in the past only','Future possibilities'],answer:1},
          {q:'"The best thing I never had" means:',options:['Something I had and loved','Something I missed out on but am grateful I did','The worst experience','Something I want in the future'],answer:1},
          {q:'Which is a correct superlative?',options:['more beautiful','the most beautiful','beautifulest','most beautifuler'],answer:1},
          {q:'Complete: "That was ___ day of my life!"',options:['the worse','the worst','the baddest','most bad'],answer:1},
        ]
      },
      { id:'lb1_3', title:'My Milkshake Is Better Than Yours! — Listening', level:'B1', type:'listening_video', lesson:'My Milkshake Is Better Than Yours!', phase:'pre',
        youtubeId:'PBHo2WwIngU', startTime:0, endTime:180,
        instruction:'Watch this conversation using comparatives! Pay attention to -er than and more... than structures. Then answer the questions!',
        audioText:`Two people compare their food, music taste and lifestyle preferences using comparative adjectives naturally.`,
        questions:[
          {q:'Comparatives are used to compare:',options:['One thing to all others','Two things to each other','Things equally','Only negative things'],answer:1},
          {q:'Which is CORRECT?',options:['"My coffee is more better."','"Your milkshake is gooder."','"This is more expensive than that."','"She is taller more than him."'],answer:2},
          {q:'Short adjectives use:',options:['more + adjective','-er + than','the most','as...as only'],answer:1},
          {q:'Complete: "This film is ___ than the last one."',options:['more bored','boringer','more boring','most boring'],answer:2},
        ]
      },
      { id:'lb1_4', title:'What Will You Do Tonight? — Listening', level:'B1', type:'listening_video', lesson:'What Will You Do Tonight?', phase:'pre',
        youtubeId:'1057714958', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation about future plans! Pay attention to the use of "will" for spontaneous decisions and predictions. Then answer the questions!',
        audioText:`Two friends discuss their evening plans. They use will for spontaneous decisions and going to for pre-planned events.`,
        questions:[
          {q:'"Will" is used for:',options:['Pre-planned events only','Spontaneous decisions and predictions','Past habits','Ongoing actions'],answer:1},
          {q:'"I\'m going to visit my sister tonight" suggests:',options:['A spontaneous decision','A pre-planned event','A wish','A command'],answer:1},
          {q:'Complete: "It\'s cold. I ___ close the window."',options:['am going to','going to','will','would'],answer:2},
          {q:'Which sentence uses WILL correctly?',options:['"Tomorrow I will going to the gym."','"I will call you later!"','"She will went yesterday."','"They will be go home."'],answer:1},
        ]
      },
      { id:'lb1_5', title:'Before Leaving the House — Listening', level:'B1', type:'listening_video', lesson:'Before Leaving the House', phase:'pre',
        youtubeId:'uMKRD3Mci5w', startTime:0, endTime:60,
        instruction:'Watch this short video about things to do before leaving the house! Pay attention to imperatives and useful daily vocabulary. Then answer the questions!',
        audioText:`A checklist of important things to do before leaving home — keys, phone, wallet, turning off appliances.`,
        questions:[
          {q:'What is the MOST important thing mentioned first?',options:['Charging your phone','Checking your keys','Turning off the TV','Having breakfast'],answer:1},
          {q:'Imperative sentences are used to:',options:['Ask questions','Give instructions or advice','Describe the past','Express feelings'],answer:1},
          {q:'"Don\'t forget your keys!" is an example of:',options:['Affirmative imperative','Negative imperative','Future tense','Past tense'],answer:1},
          {q:'Which is a correct imperative?',options:['"You should check."','"He check it."','"Check your bag!"','"Checking now."'],answer:2},
        ]
      },
      { id:'lb1_6', title:'First Conditional — Listening', level:'B1', type:'listening_video', lesson:'First Conditional', phase:'pre',
        youtubeId:'581378227', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this conversation using first conditional sentences! Pay attention to IF + present simple + will. Then answer the questions!',
        audioText:`People discuss real future possibilities using first conditional: If it rains, we'll stay home. If you study hard, you'll pass.`,
        questions:[
          {q:'First conditional is used for:',options:['Impossible situations','Real/possible future situations','Past habits','General truths only'],answer:1},
          {q:'Complete: "If it rains, we ___ stay home."',options:['would','will','are','were'],answer:1},
          {q:'Which is a correct first conditional?',options:['"If she studies, she would pass."','"If he will come, I\'ll be happy."','"If you practice, your English will improve."','"If they went, we will see them."'],answer:2},
          {q:'The IF clause uses:',options:['will + verb','present simple','past simple','would + verb'],answer:1},
        ]
      },
      { id:'lb1_7', title:'Second Conditional — Listening', level:'B1', type:'listening_video', lesson:'Second Conditional', phase:'pre',
        youtubeId:'vLo5XMjIJD8', startTime:0, endTime:180,
        instruction:'Watch this discussion about hypothetical situations! Pay attention to IF + past simple + would. Then answer the questions!',
        audioText:`People discuss imaginary situations: If I were rich, I would travel. If she knew the answer, she would tell us.`,
        questions:[
          {q:'Second conditional is used for:',options:['Real future plans','Imaginary or unlikely situations','Past regrets','Present habits'],answer:1},
          {q:'Complete: "If I ___ a car, I would drive to work."',options:['have','had','will have','would have'],answer:1},
          {q:'Which is correct second conditional?',options:['"If I am rich, I would travel."','"If she had time, she would help."','"If they will come, we\'d be happy."','"If he has studied, he would pass."'],answer:1},
          {q:'Why do we use "were" instead of "was" in second conditional?',options:['It\'s a grammar mistake','Formal/subjunctive mood for hypothetical situations','It only works with "I"','It\'s optional and informal'],answer:1},
        ]
      },
      { id:'lb1_8', title:'What If? — Listening', level:'B1', type:'listening_video', lesson:'What If?', phase:'pre',
        youtubeId:'vLo5XMjIJD8', startTime:0, endTime:180,
        instruction:'Watch this discussion about hypothetical "what if" scenarios! Pay attention to how people speculate and imagine possibilities. Then answer the questions!',
        audioText:`A discussion exploring hypothetical scenarios using what if questions and conditional responses.`,
        questions:[
          {q:'"What if you won the lottery?" is an example of:',options:['First conditional','Second conditional (hypothetical)','A direct question','A command'],answer:1},
          {q:'Complete: "What if she ___ the truth?"',options:['knows','knew','will know','has known'],answer:1},
          {q:'Which response fits "What if you could fly?"',options:['"I flew yesterday."','"I will fly tomorrow."','"I would travel everywhere!"','"I am flying now."'],answer:2},
          {q:'"Imagine you were invisible..." continues with:',options:['...what did you do?','...what would you do?','...what will you do?','...what do you do?'],answer:1},
        ]
      },
      { id:'lb1_9', title:'Giving Opinions — Listening', level:'B1', type:'listening_video', lesson:'Opinions', phase:'pre',
        youtubeId:'LmDOQbwwlhw', startTime:0, endTime:180,
        instruction:'Watch people sharing and responding to opinions! Pay attention to how they introduce, support and disagree with ideas politely. Then answer the questions!',
        audioText:`A group discusses different topics, each person sharing their view using opinion language naturally.`,
        questions:[
          {q:'Which phrase introduces an opinion?',options:['"That happened yesterday."','"In my opinion, we should..."','"What time is it?"','"She went to work."'],answer:1},
          {q:'"I see your point, but..." is used to:',options:['Agree completely','Change the subject','Partially disagree politely','Ask for clarification'],answer:2},
          {q:'Which is the most polite way to disagree?',options:['"You\'re wrong!"','"That\'s stupid."','"I respectfully disagree because..."','"No way!"'],answer:2},
          {q:'"From my perspective..." is used to:',options:['Report news','Share a personal viewpoint','Ask a question','Give a command'],answer:1},
        ]
      },
      { id:'lb1_10', title:'Brazilian Culture — Listening', level:'B1', type:'listening_video', lesson:'Brazilian Culture', phase:'pre',
        youtubeId:'fpmoOLydLTo', startTime:0, endTime:180,
        instruction:'Watch this video about Brazilian culture! Pay attention to cultural vocabulary and how to describe traditions, food and lifestyle in English. Then answer the questions!',
        audioText:`An overview of Brazilian culture covering food, music, festivals, family values and regional diversity.`,
        questions:[
          {q:'Brazilian culture is best described as:',options:['Uniform and simple','Diverse and vibrant','Reserved and formal','Cold and distant'],answer:1},
          {q:'Which is NOT typically associated with Brazilian culture?',options:['Carnival','Feijoada','Samba','Flamenco'],answer:3},
          {q:'When talking about your culture in English, you should:',options:['Use only technical terms','Use simple clear language with specific examples','Avoid giving opinions','Only mention food'],answer:1},
          {q:'"Brazil is known for its diversity" — what type of sentence is this?',options:['Opinion statement','Factual statement','Conditional sentence','Imperative'],answer:1},
        ]
      },
      { id:'lb1_11', title:'Phrasal Verbs GET — Listening', level:'B1', type:'listening_video', lesson:'Phrasal Verbs 1', phase:'pre',
        youtubeId:'XnGKaajUaxg', startTime:0, endTime:180,
        instruction:'Watch this video about phrasal verbs with GET! Pay attention to how meaning changes with different particles. Then answer the questions!',
        audioText:`Examples of phrasal verbs with GET: get up, get on, get off, get over, get along, get out, get back, get away with.`,
        questions:[
          {q:'"Get over" an illness means:',options:['Get more sick','Recover from it','Start a new illness','Go to the doctor'],answer:1},
          {q:'"We get along well" means:',options:['We argue often','We have a good relationship','We work together','We live nearby'],answer:1},
          {q:'"Get away with something" means:',options:['Travel somewhere','Escape doing something wrong without consequences','Get something for free','Leave in a hurry'],answer:1},
          {q:'Complete: "I need to ___ early tomorrow for work."',options:['get up','get over','get away','get along'],answer:0},
        ]
      },
      { id:'lb1_12', title:'Storytelling — Listening', level:'B1', type:'listening_video', lesson:'Storytelling', phase:'pre',
        youtubeId:'Jl61xGyk-pc', startTime:775, endTime:960,
        instruction:'Watch this section on storytelling techniques! Pay attention to how stories are structured and told in English. Then answer the questions!',
        audioText:`Storytelling techniques: setting the scene, building tension, using descriptive language, and creating a satisfying conclusion.`,
        questions:[
          {q:'Good storytelling starts by:',options:['Giving the ending first','Setting the scene and context','Listing facts quickly','Using technical language'],answer:1},
          {q:'Which phrase sets the scene in a story?',options:['"In conclusion..."','"Therefore..."','"It was a dark and stormy night..."','"However..."'],answer:2},
          {q:'To build tension in a story, you use:',options:['Short, quick sentences','Very long explanations','Only past tense','Questions only'],answer:0},
          {q:'"Suddenly..." is used in stories to:',options:['End the story','Introduce an unexpected event','Give background information','Start a new topic'],answer:1},
        ]
      },
      { id:'lb1_13', title:'The Participle — Listening', level:'B1', type:'listening_video', lesson:'The Participle', phase:'pre',
        youtubeId:'1057773366', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch this explanation of participles! Pay attention to past and present participle forms and how they are used. Then answer the questions!',
        audioText:`Explanation of past participles (gone, eaten, written) and present participles (going, eating, writing) with examples in context.`,
        questions:[
          {q:'The past participle of "write" is:',options:['wrote','written','writing','writed'],answer:1},
          {q:'Present participle ends in:',options:['-ed','-s','-ing','-er'],answer:2},
          {q:'"Having finished his work, he went home." — "having finished" is:',options:['Past simple','Present participle phrase','Future tense','Passive voice'],answer:1},
          {q:'Which is a correct use of past participle?',options:['"She has ate lunch."','"He has written the report."','"They have go home."','"I have see the film."'],answer:1},
        ]
      },
      { id:'lb1_14', title:'Have You Ever...? — Listening', level:'B1', type:'listening_video', lesson:'Have You Ever...?', phase:'pre',
        youtubeId:'1057774571', startTime:0, endTime:180, isVimeo:true,
        instruction:'Watch people talking about life experiences using present perfect! Pay attention to "Have you ever...?" questions and responses. Then answer the questions!',
        audioText:`People share experiences using have you ever, I have/haven't, I've never, and follow up with simple past for details.`,
        questions:[
          {q:'Present perfect is used here to talk about:',options:['Specific times in the past','Life experiences (unspecified time)','Future plans','Daily routines'],answer:1},
          {q:'"Have you ever been to Japan?" — correct response:',options:['"Yes, I went last year." (using past simple for details)','Yes, I have been yesterday.','Yes, I go there.','Yes, I was going.'],answer:0},
          {q:'Complete: "I have never ___ sushi before."',options:['eat','ate','eating','eaten'],answer:3},
          {q:'"I\'ve never tried it" uses:',options:['Past simple','Present perfect with never','Future tense','Past continuous'],answer:1},
        ]
      },
    ]
  },
  writing: {
    label: 'Writing', icon: '✏️', color: '#7f77dd',
    activities: [
      // ── L2 ──────────────────────────────────────────────────────────
      { id:'w1', title:'Write Your Own Greeting Dialogue', level:'A1', type:'writing', lesson:'The Greetings', phase:'pre',
        prompt:'Write a dialogue between two people meeting for the first time:\n• A greeting\n• Asking and saying names\n• Spelling at least one name\n• Asking how they are\n• Saying goodbye',
        minWords:40,
        tips:['"Good morning!" / "Hi!" / "Hey!"','"What\'s your name?" → "I\'m ___."','"How do you spell that?" → "It\'s M-A-R-K."','"How are you?" → "I\'m good, thanks!"','"See you later!" / "Take care!"'],
        feedback:{excellent:'Excellent dialogue! 🌟',good:'Good! Add more expressions.',needsWork:'Include: greeting, names, spelling and goodbye!'}
      },
      { id:'w2', title:'How Are You? — Write Your Answers', level:'A1', type:'writing', lesson:'The Greetings', phase:'pre',
        prompt:'Answer these 3 questions naturally:\n1. "How are you today?"\n2. "What\'s up?"\n3. "How\'s everything?"\n\nThen write 2 sentences about your day using "I am" or "I\'m".',
        minWords:35,
        tips:['"I\'m good, thanks! And you?"','"Not much! Pretty good day!"','"I\'m a little tired but happy!"'],
        feedback:{excellent:'Wonderful! 🌟',good:'Good work!',needsWork:'Answer all 3 questions!'}
      },
      { id:'w3', title:'Formal or Informal? — Rewrite!', level:'A1', type:'writing', lesson:'The Greetings', phase:'post',
        prompt:'Rewrite these sentences making them the opposite style:\n1. INFORMAL → FORMAL:\n"Hey! What\'s up? You good?"\n\n2. FORMAL → INFORMAL:\n"Good morning. How do you do? It is a pleasure to meet you."\n\n3. Write 3 goodbye sentences — 1 formal, 1 informal, 1 your choice!',
        minWords:40,
        tips:['Formal: "Good morning. How are you?"','Informal: "Hey! What\'s up?"','Formal goodbye: "It was a pleasure. Have a wonderful day."','Informal goodbye: "See ya! Take care!"'],
        feedback:{excellent:'Perfect! 🌟',good:'Good!',needsWork:'Check the formal/informal difference!'}
      },
      // ── L3 ──────────────────────────────────────────────────────────
      { id:'w4', title:'Introduce Yourself in Writing', level:'A1', type:'writing', lesson:'The Introductions', phase:'pre',
        prompt:'Write a self-introduction! Include:\n• Your name\n• Where you are from\n• Your age\n• What you do\n• One thing you like',
        minWords:15,
        tips:['"My name is ___. Nice to meet you!"','"I am from ___. I live in ___."','"I am ___ years old."','"I like ___ and ___.'],
        feedback:{excellent:'Fantastic! 🌟',good:'Good job!',needsWork:'Include name, where from, age and what you do!'}
      },
      { id:'w5', title:'Describe Someone You Know', level:'A1', type:'writing', lesson:'The Introductions', phase:'post',
        prompt:'Write about someone you know — a friend or family member. Use:\n• His name is / Her name is\n• He is / She is (age, job, where from)\n• He/She lives\n• He/She likes\n\nMinimum 20 words. Use "here", "where" and "there"!',
        minWords:20,
        tips:['"Her name is Ana. She is my friend."','"His name is Carlos. He is 25 years old."','"She lives here in São Paulo."'],
        feedback:{excellent:'Excellent! 🌟',good:'Good work!',needsWork:'Use His/Her name is and here/there!'}
      },
      // ── L4 ──────────────────────────────────────────────────────────
      { id:'w6', title:'Where Are You From? — Write It!', level:'A1', type:'writing', lesson:'Countries and Nationalities', phase:'pre',
        prompt:'Answer in full sentences:\n1. Where are you from?\n2. What is your nationality?\n3. Where do you live today?\n4. What language(s) do you speak?\n5. Do you love where you live? Why?',
        minWords:30,
        tips:['"I am from ___. I am ___ (nationality)."','"Now I live in ___ and I love it!"','"I speak ___ and a little English."','"I love my city because it is ___.'],
        feedback:{excellent:'Excellent! 🌟',good:'Add your nationality and why you love your city!',needsWork:'Use: I am from, I am (nationality), I live in, I speak!'}
      },
      { id:'w7', title:'My Country & City — Describe It!', level:'A1', type:'writing', lesson:'Countries and Nationalities', phase:'post',
        prompt:'Write a paragraph about your country and city:\n• Your nationality\n• Where you live\n• Language(s) spoken\n• What you love about it\n• What you dislike\n• One interesting fact',
        minWords:40,
        tips:['"I am from Brazil, so I am Brazilian. I speak Portuguese."','"I love it because there is/are ___."','"I dislike ___ because it is too ___.'],
        feedback:{excellent:'Wonderful! 🌟',good:'Add what you dislike too!',needsWork:'Include: nationality, language, what you love AND dislike!'}
      },
      // ── L5 ──────────────────────────────────────────────────────────
      { id:'w8', title:'Write About Your Job!', level:'A1', type:'writing', lesson:'The Occupations', phase:'pre',
        prompt:'Answer in full sentences:\n1. What do you do?\n2. Where do you work or study?\n3. What do you like about it?\n4. What do you dislike?\n5. What is your dream job?',
        minWords:35,
        tips:['"I am a teacher. I work at a school in ___."','"I love my job because it is rewarding."','"My dream job is to be a ___ because ___.'],
        feedback:{excellent:'Excellent! 🌟',good:'Add your dream job!',needsWork:'Include job, where you work, likes, dislikes and dream job!'}
      },
      { id:'w9', title:'Describe Three People\'s Jobs!', level:'A1', type:'writing', lesson:'The Occupations', phase:'post',
        prompt:'Write about the jobs of 3 people you know. For each:\n• His/Her name\n• Job title\n• Where they work\n• One thing about the job\n\nUse A or AN correctly!',
        minWords:40,
        tips:['"Her name is ___. She is a nurse. She works at a hospital."','"His name is ___. He is an engineer."','"She loves her job because it is rewarding.'],
        feedback:{excellent:'Perfect! 🌟',good:'Check your A/AN!',needsWork:'Write about 3 people with name, job, workplace and one detail!'}
      },
      // ── L6 ──────────────────────────────────────────────────────────
      { id:'w10', title:'Write a Café Dialogue!', level:'A1', type:'writing', lesson:'At the Café', phase:'pre',
        prompt:'Write a dialogue between a customer and a waiter:\n• Greeting from the waiter\n• Customer ordering food AND drink\n• Asking about the price\n• Paying and saying goodbye',
        minWords:45,
        tips:['Waiter: "Good morning! What can I get you?"','Customer: "I\'d like a ___ and a ___, please."','"How much is it?" / "Here you are." / "Keep the change."'],
        feedback:{excellent:'Perfect café dialogue! 🌟',good:'Add the price question and goodbye!',needsWork:'Include: greeting, ordering food AND drink, price, goodbye!'}
      },
      { id:'w11', title:'My Favourite Café — Describe It!', level:'A1', type:'writing', lesson:'At the Café', phase:'post',
        prompt:'Write about your favourite café or restaurant:\n• The name and where it is\n• What you usually order\n• Why you love it\n• One thing you would change\n• A recommendation to a friend',
        minWords:40,
        tips:['"My favourite café is ___ and it is in ___."','"I usually order a ___ and a ___."','"I would recommend it because ___.'],
        feedback:{excellent:'Wonderful! 🌟',good:'Add a recommendation!',needsWork:'Write about name, location, what you order, why you love it and a recommendation!'}
      },
      // ── L14 FINAL TEST ────────────────────────────────────────────────
      { id:'w12', title:'Final Test — Writing Review', level:'A1', type:'writing', lesson:'Final Test A1', phase:'pre',
        prompt:'Your A1 writing review! Write covering ALL 5 topics:\n1. Introduce yourself (name, nationality, age, job)\n2. Your family (2 members)\n3. Your city (places you like)\n4. Plans for next weekend (going to...)\n5. Something you did yesterday (past tense)\n\nMinimum 60 words!',
        minWords:60,
        tips:['"My name is ___. I am ___ (nationality). I am ___ years old and I work as a ___."','"My ___ is a ___ and works at ___."','"Next weekend I am going to ___ and ___."','"Yesterday I ___ (past verb). It was ___.'],
        feedback:{excellent:'Outstanding! You are ready for your A1 test! 🏆',good:'Great! Check you covered all 5 topics!',needsWork:'Include all 5 topics: introduction, family, city, future plans and past events!'}
      },
    ]
  },
  speaking: {
    label: 'Speaking', icon: '🎙️', color: '#d4537e',
    activities: [
      // ── L1 ──────────────────────────────────────────────────────────
      { id:'s0', title:'Spell It Out! 🔤', level:'A1', type:'speaking', lesson:'The American Pronunciation', phase:'post',
        prompt:'Record yourself spelling the following information clearly in English:\n\n1. Your full name — letter by letter\n2. The city where you live\n3. Your state\n4. Your mother\'s first name\n\nSpeak slowly and clearly. Say each letter one at a time!\n\nExample: "My name is Ana Costa — A-N-A  C-O-S-T-A"',
        tips:[
          'Speak slowly — one letter at a time!',
          '"My name is ___ — " then spell each letter',
          '"I live in ___ — " then spell the city',
          '"My state is ___ — " then spell it',
          '"My mother\'s name is ___ — " then spell it',
        ],
        phrases:['My name is... —','I live in... —','My state is... —','My mother\'s name is... —','A, B, C, D, E, F, G...']
      },
      // ── L2 ──────────────────────────────────────────────────────────
      { id:'s1', title:'Introduce Yourself!', level:'A1', type:'speaking', lesson:'The Greetings', phase:'pre',
        prompt:'Record a short introduction:\n1. A greeting\n2. Your name\n3. How you are feeling today\n4. One thing about your day\n5. A goodbye',
        tips:['"Good morning! / Hi!"','"My name is ___. Nice to meet you!"','"I am feeling ___ today."','End with: "See you later! / Take care!"'],
        phrases:['Good morning!','My name is...','Nice to meet you!','I am feeling...','See you later!','Take care!']
      },
      { id:'s2', title:'How Are You? — 5 Different Ways', level:'A1', type:'speaking', lesson:'The Greetings', phase:'pre',
        prompt:'Answer "How are you?" in 5 DIFFERENT ways:\n1. Formally\n2. Informally\n3. With a feeling + reason\n4. With a question back\n5. One word + more info',
        tips:['Formal: "I am very well, thank you!"','Informal: "Pretty good! Not much going on!"','Feeling + reason: "I\'m tired because I woke up early!"','Question back: "I\'m great! And you?"'],
        phrases:['I am very well, thank you.','Not much!','Pretty good!','I\'m tired because...','And you?','Fantastic!','Not too bad!']
      },
      { id:'s3', title:'Role Play — Hotel Check-in', level:'A1', type:'speaking', lesson:'The Greetings', phase:'post',
        prompt:'You are Jenny checking into a hotel! Record yourself:\n1. Greet the receptionist\n2. Say you have a reservation\n3. Say your name and spell your last name\n4. Confirm your details\n5. Thank the receptionist',
        tips:['"Hello! Good evening."','"I have a reservation. My name is ___."','Spell: "My last name is ___, it\'s spelled ___."','"Yes, that\'s right." / "Here you are."'],
        phrases:['Hello! Good evening.','I have a reservation.','My name is... it\'s spelled...','Yes, that\'s right.','Here you are.','Thank you very much!','Have a good evening!']
      },
      // ── L3 ──────────────────────────────────────────────────────────
      { id:'s4', title:'Introduce Yourself!', level:'A1', type:'speaking', lesson:'The Introductions', phase:'pre',
        prompt:'Record a full self-introduction:\n1. Your name and where you are from\n2. Your age\n3. What you do\n4. A language you speak\n5. One thing you like\n\nSpeak for at least 30 seconds!',
        tips:['"Hi! My name is ___. Nice to meet you!"','"I am from ___. I live in ___."','"I am ___ years old."','"I like ___ a lot. What about you?"'],
        phrases:['My name is...','I am from...','I live in...','I am ___ years old.','I am a student.','Nice to meet you!']
      },
      { id:'s5', title:'Where Are You From? — Key Vocab', level:'A1', type:'speaking', lesson:'The Introductions', phase:'post',
        prompt:'Use each of these words in a real sentence:\n1. HERE\n2. OVER THERE\n3. WHERE\n4. HIS NAME IS\n5. HER NAME IS\n6. YOU\'RE WELCOME',
        tips:['"My bag is here. The door is over there."','"Where are you from? Where do you live?"','"His name is ___." / "Her name is ___."','"Thank you!" → "You\'re welcome!"'],
        phrases:['Here!','Over there!','Where are you from?','His name is...','Her name is...','You\'re welcome!']
      },
      // ── L4 ──────────────────────────────────────────────────────────
      { id:'s6', title:'Where Are You From? Tell Me Everything!', level:'A1', type:'speaking', lesson:'Countries and Nationalities', phase:'pre',
        prompt:'Talk about where you are from:\n1. Your name and where you are from\n2. Your nationality\n3. Where you live now\n4. One language you speak\n5. One thing you love about where you live',
        tips:['"My name is ___. I am from ___, so I am ___."','"Now I live in ___ and I love it because..."','"My city is ___ and it is beautiful/big/noisy."'],
        phrases:['I am from...','I am ___ (nationality)','Now I live in...','I speak...','I love it because...']
      },
      { id:'s7', title:'My Country & City — Tell Me More!', level:'A1', type:'speaking', lesson:'Countries and Nationalities', phase:'post',
        prompt:'Talk for 45 seconds about your country and city:\n1. Nationality\n2. Where you live and if you like it\n3. Language(s) you speak\n4. What you LOVE\n5. What you DISLIKE',
        tips:['"I love my city because it is ___ and there is/are ___."','"I dislike ___ because it is too noisy / dirty / crowded."'],
        phrases:['I am originally from...','I love it because...','I dislike...','It is too...','There is/are...']
      },
      // ── L5 ──────────────────────────────────────────────────────────
      { id:'s8', title:'What Do You Do? Tell Me About Your Job!', level:'A1', type:'speaking', lesson:'The Occupations', phase:'pre',
        prompt:'Talk about your job or studies:\n1. What you do\n2. Where you work or study\n3. What you like about it\n4. What you dislike\n5. Your dream job',
        tips:['"I am a ___ / I work as a ___."','"I work at / I study at ___."','"My dream job is to be a ___ because ___.'],
        phrases:['I am a...','I work as a...','I work at...','I love it because...','My dream job is...']
      },
      { id:'s9', title:'Jobs Around the World — Describe Them!', level:'A1', type:'speaking', lesson:'The Occupations', phase:'post',
        prompt:'Describe 3 people you know — family, friend, yourself. For each:\n1. His/Her name\n2. What he/she does\n3. Where he/she works\n4. One thing about the job',
        tips:['"Her name is ___. She is a ___ and she works at ___."','"His name is ___. He loves his job because ___.'],
        phrases:['He is a...','She works as a...','He works at...','She loves it because...']
      },
      // ── L6 ──────────────────────────────────────────────────────────
      { id:'s10', title:'Order at a Café!', level:'A1', type:'speaking', lesson:'At the Café', phase:'pre',
        prompt:'Role play at a café! Record yourself:\n1. Greet the waiter\n2. Ask for the menu or order directly\n3. Order a drink AND food\n4. Ask for the price\n5. Pay and say thank you!',
        tips:['"Good morning! Can I see the menu?"','"I\'d like a ___ and a ___, please."','"How much is it? / The bill, please."','"Here you are! Thank you! Have a great day!"'],
        phrases:['I\'d like...','Can I have...?','I\'ll have...','How much is it?','The bill, please.','Here you are.','Thank you so much!']
      },
      { id:'s11', title:'At the Café — Full Conversation!', level:'A1', type:'speaking', lesson:'At the Café', phase:'post',
        prompt:'Play BOTH roles — customer AND waiter!\n1. Waiter greeting\n2. Customer ordering food and drink\n3. Waiter asking preferences (hot/cold? milk? sugar?)\n4. Customer asking the price\n5. Paying and saying goodbye',
        tips:['Waiter: "Good morning! What can I get you today?"','Customer: "I\'d like a large coffee and a croissant."','Waiter: "Hot or iced? With milk?"','Customer: "Hot. How much is it?"'],
        phrases:['Welcome!','What can I get you?','I\'d like...','Hot or iced?','With milk/sugar?','That\'s $___','Enjoy!','Have a good day!']
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
    const email = user?.email || '';

    // XP
    const currentXp = getItem(email, 'xp', 0);
    setItem(email, 'xp', currentXp + xpGain);

    // Activities
    const acts = getItem(email, 'activities', []);
    acts.push({ skill: skillKey, title, score, time: 'Just now' });
    setItem(email, 'activities', acts);

    // Streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastActive = getItem(email, 'last_active', '');
    let streak = getItem(email, 'streak', 0);
    if (lastActive !== today) {
      streak = lastActive === yesterday ? streak + 1 : 1;
      const best = getItem(email, 'best_streak', 0);
      if (streak > best) setItem(email, 'best_streak', streak);
      setItem(email, 'streak', streak);
      setItem(email, 'last_active', today);
    }
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
            <div className="activity-body reading-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">📖</span>
                <div>
                  <div className="instr-title">Read carefully</div>
                  <div className="instr-sub">Then answer the 4 questions below.</div>
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
            <div className="activity-body listening-section">
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
                  src={activity.isVimeo
                    ? `https://player.vimeo.com/video/${activity.youtubeId}?autoplay=0`
                    : `https://www.youtube.com/embed/${activity.youtubeId}?start=${activity.startTime}&end=${activity.endTime}&rel=0&modestbranding=1`
                  }
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
            <div className="activity-body writing-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">✏️</span>
                <div>
                  <div className="instr-title">Write your answer below</div>
                  <div className="instr-sub">Minimum {activity.minWords} words · AI will give you detailed feedback</div>
                </div>
              </div>
              <div className="writing-prompt-box">{renderPrompt(activity.prompt)}</div>
              {activity.tips?.length > 0 && (
                <div className="writing-tips-box">
                  <div className="writing-tips-title">💡 Tips from the teacher</div>
                  {activity.tips.map((tip, i) => (
                    <div key={i} className="writing-tip-item">→ {tip}</div>
                  ))}
                </div>
              )}
              <textarea
                className="practice-textarea"
                placeholder="Start writing here in English..."
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                disabled={submitted}
                rows={7}
              />
              <div className={`word-count-row ${wordCount >= activity.minWords ? 'ok' : ''}`}>
                {wordCount} / {activity.minWords} words minimum {wordCount >= activity.minWords ? '✓' : ''}
              </div>
            </div>
          )}

          {/* Speaking activity */}
          {activity.type === 'speaking' && (
            <div className="activity-body speaking-section">
              <div className="activity-instruction-box">
                <span className="instr-icon">🎙️</span>
                <div>
                  <div className="instr-title">Record yourself speaking</div>
                  <div className="instr-sub">Press Start, speak clearly, then Stop. AI will transcribe and give feedback.</div>
                </div>
              </div>
              <div className="speaking-prompt-box">{renderPrompt(activity.prompt)}</div>
              {activity.tips?.length > 0 && (
                <div className="speaking-tips-box">
                  <div className="speaking-tips-title">💡 Tips from the teacher</div>
                  {activity.tips.map((tip, i) => (
                    <div key={i} className="speaking-tip-item">→ {tip}</div>
                  ))}
                </div>
              )}
              {activity.phrases?.length > 0 && (
                <div className="phrases-box">
                  <div className="phrases-title">🗣️ Useful phrases</div>
                  <div className="phrases-wrap">
                    {activity.phrases.map((p, i) => (
                      <span key={i} className="phrase-chip">"{p}"</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recorder */}
              {!submitted && !speakingLoading && (
                <div className="recorder-card">
                  {!recording && !transcript && (
                    <>
                      <div className="recorder-status">Tap the button and start speaking! 🎤</div>
                      <button className="recorder-btn idle" onClick={startRecording}>🎙️</button>
                      <div className="recorder-hint">🔒 Audio is processed securely and not stored</div>
                    </>
                  )}
                  {recording && (
                    <>
                      <div className="recorder-status" style={{ color: '#e02020', fontWeight: 700 }}>● Recording...</div>
                      <div className="recorder-timer">{formatTime(recordingTime)}</div>
                      <button className="recorder-btn recording" onClick={stopRecording}>⏹</button>
                      <div className="recorder-hint">Tap to stop when you are done</div>
                    </>
                  )}
                </div>
              )}

              {/* Loading */}
              {speakingLoading && (
                <div className="recorder-card">
                  <div className="recorder-status">Processing your audio...</div>
                  <div className="recorder-btn processing" style={{ background: '#e0dbd4' }}>⏳</div>
                  <div className="recorder-hint">Transcribing with Whisper · Analysing with GPT-4o</div>
                </div>
              )}

              {/* Transcript */}
              {transcript && !speakingLoading && !submitted && (
                <div className="transcript-box">
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
