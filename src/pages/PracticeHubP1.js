import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getItem, setItem } from '../utils/storage';
import './PracticeHubP1.css';

// P1 — Personalizado: Yara Andrade
// Academic English for Health Sciences | Post-doctoral preparation (Italy)
// 12 topics | 3-month plan

const P1_LESSONS = [
  {
    num: 1, code: 'P1-T1',
    title: 'Introducing Yourself in Academic Context',
    subtitle: 'Week 1',
    color: '#7f77dd',
    activities: [
      {
        code: 'P1-T1-A1', type: 'speaking', icon: '🎙️',
        title: 'Academic Self-Introduction',
        desc: 'Record a 2-minute self-introduction as if you are presenting yourself at an international academic conference. Include: your name, nationality, institution, field of research (health sciences), and your reason for being at the event.',
        tips: ['"My name is ___ and I am a researcher from Brazil."', '"I am currently working on my post-doctoral research at ___."', '"My area of expertise is ___ within the field of public health."', '"I am here to present/discuss ___."'],
        phrases: ['My research focuses on...', 'I specialize in...', 'I am affiliated with...', 'It is a pleasure to meet you.', 'I look forward to exchanging ideas.'],
      },
      {
        code: 'P1-T1-A2', type: 'writing', icon: '✏️',
        title: 'Write Your Academic Bio',
        desc: 'Write a short academic biography (80–120 words) in third person, as it would appear in a conference program. Include: full name, institution, research area, key achievements, and current project.',
        tips: ['Use third person: "Dr. ___ is a researcher at..."', 'Mention your field clearly: "in the field of public health / health sciences"', 'Add one key achievement or publication if possible', 'End with your current focus: "She is currently developing research on ___."'],
        phrases: ['Dr. ___ is a researcher at...', 'Her research focuses on...', 'She holds a degree in...', 'She is currently...', 'Her work has been presented at...'],
      },
      {
        code: 'P1-T1-A3', type: 'reading', icon: '📖',
        title: 'Academic Introductions — Reading & Comprehension',
        desc: 'Read the academic bio below and answer the 4 questions.',
        text: `Dr. Sofia Martins is a Brazilian public health researcher at the University of São Paulo. She holds a PhD in Collective Health and is currently completing her post-doctoral research at the University of Bologna, Italy, where she investigates the intersections between universal healthcare systems and chronic disease prevention.\n\nHer work has been published in several international journals and presented at conferences in Europe and Latin America. Dr. Martins is passionate about cross-cultural approaches to healthcare policy and believes that collaboration between Brazilian and Italian researchers can generate significant contributions to global health debates.\n\nShe is fluent in Portuguese, English and Italian, and is currently supervising two master's students in Brazil remotely.`,
        questions: [
          { q: 'Where is Dr. Martins currently doing her post-doctoral research?', options: ['University of São Paulo', 'University of Bologna, Italy', 'University of Rome', 'Federal University of Brazil'], answer: 1 },
          { q: 'What is the focus of her post-doctoral research?', options: ['Language learning in healthcare', 'Universal healthcare and chronic disease prevention', 'Italian culture and health', 'Medical education in Brazil'], answer: 1 },
          { q: 'What does she believe about Brazilian-Italian collaboration?', options: ['It is too difficult to manage', 'It can contribute to global health debates', 'It is not relevant for her work', 'It should focus only on publications'], answer: 1 },
          { q: 'How many languages does Dr. Martins speak?', options: ['One', 'Two', 'Three', 'Four'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 2, code: 'P1-T2',
    title: 'My Research & Area of Expertise',
    subtitle: 'Week 2',
    color: '#1d9e75',
    activities: [
      {
        code: 'P1-T2-A1', type: 'speaking', icon: '🎙️',
        title: 'Talk About Your Research',
        desc: 'Record yourself explaining your research project in English as if talking to a colleague who is NOT from your field. Make it clear, simple and engaging. Include: the problem you are addressing, your methodology, and what you hope to achieve. Speak for at least 90 seconds.',
        tips: ['"The main problem I am addressing is..."', '"My research uses a ___ methodology, which means..."', '"What makes this research important is..."', '"The expected outcome is..."'],
        phrases: ['My research investigates...', 'The central question of my work is...', 'I use qualitative/quantitative methods to...', 'The findings suggest that...', 'This is significant because...'],
      },
      {
        code: 'P1-T2-A2', type: 'writing', icon: '✏️',
        title: 'Write a Research Abstract',
        desc: 'Write a short abstract (100–130 words) for your post-doctoral project. An abstract typically includes: background, objective, methodology, expected results, and conclusion/significance. Write clearly and formally.',
        tips: ['Start with context: "This research examines..."', 'State objective clearly: "The aim of this study is to..."', 'Briefly describe methodology: "Using a mixed-methods approach..."', 'End with significance: "The results are expected to contribute to..."'],
        phrases: ['This study examines...', 'The aim of this research is...', 'Data was/will be collected through...', 'Preliminary findings indicate...', 'This research contributes to the field of...'],
      },
      {
        code: 'P1-T2-A3', type: 'reading', icon: '📖',
        title: 'Research Vocabulary in Context',
        desc: 'Read the text and answer the questions.',
        text: `When presenting research to international audiences, clarity is essential. Researchers must be able to explain complex ideas in accessible language without losing scientific precision.\n\nKey vocabulary for academic presentations:\n\n• Methodology: the systematic approach used to conduct research\n• Hypothesis: a proposed explanation that can be tested\n• Variable: a factor that can change in an experiment\n• Findings: the results or discoveries of a study\n• Implications: the possible effects or consequences of the research\n• Peer-reviewed: evaluated by other experts in the field before publication\n\nWhen describing your work, use hedging language to show academic caution:\n"The results suggest that..." / "It appears that..." / "The data indicates..."\n\nAvoid absolute statements like "This proves that..." — instead say "This provides evidence that..."`,
        questions: [
          { q: 'What is a "hypothesis" in research?', options: ['The final conclusion of a study', 'A proposed explanation that can be tested', 'The methodology used', 'A published finding'], answer: 1 },
          { q: 'Why do researchers use hedging language like "suggests" instead of "proves"?', options: ['To sound less confident', 'To show academic caution and precision', 'Because it is shorter', 'It is a grammar rule'], answer: 1 },
          { q: 'What does "peer-reviewed" mean?', options: ['Written by students', 'Evaluated by experts before publication', 'Published in any journal', 'Translated into other languages'], answer: 1 },
          { q: 'Which sentence uses the BEST academic hedging?', options: ['"This research proves the theory."', '"This research suggests evidence supporting the theory."', '"I think maybe the theory is correct."', '"The theory is obviously right."'], answer: 1 },
        ],
      },
    ],
  },
  {
    num: 3, code: 'P1-T3',
    title: 'How Healthcare Works in Brazil — The SUS',
    subtitle: 'Week 3',
    color: '#378add',
    activities: [
      {
        code: 'P1-T3-A1', type: 'speaking', icon: '🎙️',
        title: 'Explain the SUS to a Foreign Colleague',
        desc: 'Imagine an Italian colleague asks you: "How does healthcare work in Brazil? What is the SUS?" Record a 2-minute explanation in English. Explain what SUS is, how it works, its strengths and its challenges.',
        tips: ['"In Brazil, we have a universal public healthcare system called SUS, which stands for..."', '"The SUS was created in 1988 and guarantees free healthcare to all Brazilian citizens."', '"One of the greatest strengths of SUS is... however, one major challenge is..."', '"Compared to Italy\'s NHS, the SUS..."'],
        phrases: ['Brazil has a universal healthcare system called...', 'It was established in...', 'The system covers...', 'One of the main challenges is...', 'Compared to European systems...', 'In my opinion, the SUS...'],
      },
      {
        code: 'P1-T3-A2', type: 'writing', icon: '✏️',
        title: 'Compare SUS and the Italian NHS',
        desc: 'Write a short comparative paragraph (80–100 words) comparing the Brazilian SUS and the Italian NHS (Servizio Sanitario Nazionale). Mention: how they are funded, who they cover, and one similarity and one key difference.',
        tips: ['Use comparison language: "Both systems... / However, while Brazil... Italy..."', '"Brazil\'s SUS is funded through taxes and covers all citizens regardless of income."', '"Italy\'s NHS also offers universal coverage, similar to the SUS."', '"A key difference is..."'],
        phrases: ['Both systems provide...', 'Unlike Brazil, Italy...', 'Similarly,...', 'One key difference is...', 'In terms of funding,...', 'Both countries face challenges such as...'],
      },
      {
        code: 'P1-T3-A3', type: 'reading', icon: '📖',
        title: 'The SUS — Reading Comprehension',
        desc: 'Read the text and answer the questions.',
        text: `The Sistema Único de Saúde (SUS) is Brazil's public health system, established by the 1988 Federal Constitution. It is one of the world's largest universal healthcare systems, providing free medical care to approximately 211 million people.\n\nThe SUS operates on three principles: universality (healthcare for everyone), equity (prioritizing those with the greatest need), and integrality (comprehensive care from prevention to rehabilitation).\n\nDespite its achievements — including one of the world's most successful vaccination programs and a pioneering HIV/AIDS treatment policy — the SUS faces significant challenges: underfunding, inequality between urban and rural areas, and long waiting times.\n\nFor foreign researchers studying Brazilian public health, understanding the SUS is essential, as it represents a unique model of universal healthcare in a developing country context.`,
        questions: [
          { q: 'When was the SUS established?', options: ['1975', '1988', '1994', '2001'], answer: 1 },
          { q: 'What does "equity" mean in the context of the SUS?', options: ['Everyone receives the same treatment', 'Prioritizing those with the greatest need', 'Free healthcare for rich people', 'Equal funding for all states'], answer: 1 },
          { q: 'Which achievement is mentioned as pioneering?', options: ['Cancer treatment', 'Mental health care', 'HIV/AIDS treatment policy', 'Dental care'], answer: 2 },
          { q: 'What is one major challenge of the SUS?', options: ['Too many doctors', 'Underfunding and inequality', 'No vaccination programs', 'Too few patients'], answer: 1 },
        ],
      },
    ],
  },
  {
    num: 4, code: 'P1-T4',
    title: 'Daily Academic Conversations',
    subtitle: 'Week 4',
    color: '#d4537e',
    activities: [
      {
        code: 'P1-T4-A1', type: 'speaking', icon: '🎙️',
        title: 'Small Talk at a Conference',
        desc: 'Record yourself having a natural small talk conversation with a fellow researcher at a coffee break. Practise starting a conversation, asking about their work, and sharing something about yours. Use natural, friendly language — not overly formal.',
        tips: ['"This has been such an interesting conference, hasn\'t it?"', '"What area are you working in?"', '"Oh, that\'s fascinating! How does that relate to..."', '"Actually, in Brazil we have a similar situation with..."'],
        phrases: ['Great talk, wasn\'t it?', 'What brings you to this conference?', 'That\'s really interesting!', 'Have you been to Brazil before?', 'We actually deal with something similar...', 'You should check out this paper by...'],
      },
      {
        code: 'P1-T4-A2', type: 'writing', icon: '✏️',
        title: 'Write a Follow-up Email to a Researcher',
        desc: 'After meeting a researcher at a conference, write a follow-up email (80–100 words). Thank them for the conversation, mention something specific they said, share a relevant paper or resource, and suggest staying in touch.',
        tips: ['Subject line: "Great meeting you at [Conference Name]"', '"It was a pleasure meeting you at..."', '"I particularly enjoyed our discussion about..."', '"I thought you might find this paper relevant: ..."', '"I would love to continue this conversation. Would you be open to a virtual meeting?"'],
        phrases: ['It was a pleasure meeting you...', 'I particularly enjoyed...', 'I wanted to share...', 'I believe this could be relevant to your work...', 'I look forward to hearing from you.'],
      },
      {
        code: 'P1-T4-A3', type: 'reading', icon: '📖',
        title: 'Academic Email — Reading & Comprehension',
        desc: 'Read the email exchange and answer the questions.',
        text: `Subject: Following up — Healthcare Policy Session at EuroHealth 2024\n\nDear Dr. Russo,\n\nIt was wonderful meeting you at the EuroHealth Conference last week. I truly appreciated your insights on chronic disease prevention in Mediterranean populations — your data on dietary habits was particularly eye-opening.\n\nI am attaching a paper I published last year on community health interventions in Brazil, which I believe resonates with some of the themes you raised. I would love to explore potential areas of collaboration between our research groups.\n\nWould you be available for a 30-minute virtual meeting sometime in the next few weeks? I am flexible with timing given the time difference.\n\nWith warm regards,\nDr. Yara Andrade\nUniversity of São Paulo | Public Health Department`,
        questions: [
          { q: 'Where did Dr. Andrade and Dr. Russo meet?', options: ['At a university lecture', 'At the EuroHealth Conference', 'Online', 'At a hospital'], answer: 1 },
          { q: 'What did Dr. Andrade find "eye-opening" about Dr. Russo\'s work?', options: ['His views on universal healthcare', 'His data on dietary habits', 'His research on vaccines', 'His paper on mental health'], answer: 1 },
          { q: 'What is Dr. Andrade attaching to the email?', options: ['A conference invitation', 'A curriculum vitae', 'A paper she published last year', 'A research proposal'], answer: 2 },
          { q: 'Why does she mention she is "flexible with timing"?', options: ['She is very busy', 'Because of the time difference', 'She doesn\'t have a schedule', 'She prefers morning meetings'], answer: 1 },
        ],
      },
    ],
  },
  {
    num: 5, code: 'P1-T5',
    title: 'Presenting Your Research Project',
    subtitle: 'Week 5',
    color: '#ff6a00',
    activities: [
      {
        code: 'P1-T5-A1', type: 'speaking', icon: '🎙️',
        title: 'Present Your Project — 3-Minute Pitch',
        desc: 'Record a 3-minute academic pitch of your post-doctoral project. Structure it clearly: 1) Context/Problem, 2) Objective, 3) Methodology, 4) Expected outcomes. Speak clearly and confidently — imagine you are presenting to a panel of international researchers.',
        tips: ['Open strongly: "Today I would like to share my post-doctoral research on..."', '"The central problem this research addresses is..."', '"My objective is to..."', '"To achieve this, I am using..."', '"The expected contribution of this work is..."'],
        phrases: ['Today I would like to present...', 'This research addresses the problem of...', 'My primary objective is...', 'The methodology involves...', 'I expect to demonstrate that...', 'This will contribute to...'],
      },
      {
        code: 'P1-T5-A2', type: 'writing', icon: '✏️',
        title: 'Write Your Presentation Opening',
        desc: 'Write the opening paragraph of your academic presentation (60–80 words). This is the first thing you say — it should grab attention, establish context, and clearly state what you will be presenting. Make it engaging and professional.',
        tips: ['Start with a powerful fact or question: "Did you know that..."', 'Or start with context: "In an era where global health..."', 'State your topic clearly by the 3rd sentence', 'End with a roadmap: "Today I will cover three main points..."'],
        phrases: ['Good morning/afternoon everyone...', 'Did you know that...', 'Today\'s presentation will focus on...', 'I will be covering three key areas:', 'By the end of this talk, you will understand...'],
      },
      {
        code: 'P1-T5-A3', type: 'reading', icon: '📖',
        title: 'Presentation Language — Reading & Practice',
        desc: 'Read the guide and answer the questions.',
        text: `Effective academic presentations follow a clear structure and use specific language patterns.\n\nOPENING PHRASES:\n"Good morning, everyone. Thank you for the opportunity to present today."\n"I would like to begin by providing some context..."\n"The central question guiding my research is..."\n\nTRANSITION PHRASES:\n"Moving on to the next point..."\n"This brings me to my second argument..."\n"As you can see in this slide..."\n"To put this into perspective..."\n\nCONCLUSION PHRASES:\n"In conclusion, my research demonstrates..."\n"To summarize the key findings..."\n"I believe this work opens the door to..."\n"I would be happy to take any questions."\n\nHEDGING IN PRESENTATIONS:\nInstead of: "This proves..." → Say: "This suggests..."\nInstead of: "Everyone agrees..." → Say: "The evidence indicates..."\nInstead of: "It is obvious that..." → Say: "It appears that..."`,
        questions: [
          { q: 'Which phrase is best to start an academic presentation?', options: ['"Hi guys, let\'s get started!"', '"Good morning. Thank you for the opportunity to present today."', '"So, my research is about..."', '"I hope you\'re all listening."'], answer: 1 },
          { q: 'Which is the best transition phrase?', options: ['"And then also..."', '"Moving on to the next point..."', '"Whatever, let\'s continue..."', '"OK, next thing."'], answer: 1 },
          { q: 'Why do we say "This suggests" instead of "This proves"?', options: ['It sounds more polite', 'It shows academic caution and accuracy', 'It is shorter', 'Proves is old-fashioned'], answer: 1 },
          { q: 'What should you say when ending your presentation?', options: ['"That\'s all, bye!"', '"I would be happy to take any questions."', '"I don\'t know what else to add."', '"Please read my paper for more."'], answer: 1 },
        ],
      },
    ],
  },
  {
    num: 6, code: 'P1-T6',
    title: 'Describing Methodology & Findings',
    subtitle: 'Week 6',
    color: '#7f77dd',
    activities: [
      {
        code: 'P1-T6-A1', type: 'speaking', icon: '🎙️',
        title: 'Explain Your Methodology Out Loud',
        desc: 'Record yourself explaining your research methodology as if presenting to an interdisciplinary audience. Explain: what approach you use (qualitative/quantitative/mixed), why you chose it, how you collect data, and any ethical considerations.',
        tips: ['"My study uses a ___ methodology because..."', '"Data is collected through interviews/surveys/analysis of..."', '"The sample consists of ___ participants selected by..."', '"Ethical approval was obtained from..."'],
        phrases: ['My methodology is based on...', 'I chose this approach because...', 'Participants were selected using...', 'The data was analysed using...', 'To ensure ethical standards...'],
      },
      {
        code: 'P1-T6-A2', type: 'writing', icon: '✏️',
        title: 'Write a Findings Paragraph',
        desc: 'Write a short paragraph (80–100 words) describing the key findings or expected results of your research. Use academic hedging language and present your findings clearly and objectively.',
        tips: ['Use hedging: "The data suggests..." / "Preliminary findings indicate..."', 'Be specific: "Among the 50 participants interviewed, 78% reported..."', 'Connect to your objective: "These findings align with the research objective of..."', 'End with implication: "This suggests that healthcare interventions should..."'],
        phrases: ['The findings indicate that...', 'Data analysis revealed...', 'Contrary to initial expectations...', 'These results suggest...', 'A significant finding was...', 'This supports the hypothesis that...'],
      },
      {
        code: 'P1-T6-A3', type: 'reading', icon: '📖',
        title: 'Methodology Language — Reading',
        desc: 'Read and answer the questions.',
        text: `Research methodology describes HOW a study is conducted. Choosing the right methodology is critical to the validity and credibility of your research.\n\nQUALITATIVE RESEARCH focuses on understanding experiences, meanings and phenomena. It uses interviews, focus groups and case studies. Results are descriptive rather than numerical.\n\nQUANTITATIVE RESEARCH uses numbers, statistics and measurable data. It includes surveys, experiments and data analysis. It aims to establish patterns and test hypotheses.\n\nMIXED METHODS combines both approaches, providing a more comprehensive understanding.\n\nUseful phrases for describing methodology:\n"A sample of ___ participants was recruited from..."\n"Data was collected using semi-structured interviews..."\n"Statistical analysis was performed using SPSS/R..."\n"Thematic analysis was applied to identify key patterns..."`,
        questions: [
          { q: 'Which methodology uses interviews and case studies?', options: ['Quantitative', 'Qualitative', 'Statistical', 'Experimental'], answer: 1 },
          { q: 'What is the purpose of quantitative research?', options: ['To describe personal experiences', 'To establish patterns and test hypotheses', 'To collect stories', 'To understand feelings'], answer: 1 },
          { q: 'What does "mixed methods" combine?', options: ['Two different theories', 'Qualitative and quantitative approaches', 'Two types of statistics', 'Interviews and experiments only'], answer: 1 },
          { q: 'Which phrase is used to describe data collection?', options: ['"We just asked some people."', '"Data was collected using semi-structured interviews."', '"I talked to a few patients."', '"Randomly, we gathered information."'], answer: 1 },
        ],
      },
    ],
  },
  {
    num: 7, code: 'P1-T7',
    title: 'Reacting to Opinions & Sharing Information',
    subtitle: 'Week 7',
    color: '#1d9e75',
    activities: [
      {
        code: 'P1-T7-A1', type: 'speaking', icon: '🎙️',
        title: 'Agree, Disagree & Add Information',
        desc: 'Practice reacting to academic opinions! Record yourself responding to each of these 3 statements — agree or disagree and explain why using chunks and academic language:\n\n1. "Universal healthcare systems like Brazil\'s SUS are unsustainable in the long term."\n2. "Preventive medicine is more cost-effective than curative medicine."\n3. "Cultural differences significantly impact the effectiveness of health interventions."',
        tips: ['Agreeing: "That\'s a really important point. I would add that..."', 'Partially agreeing: "I see your point, however..."', 'Disagreeing politely: "I respectfully disagree because the evidence suggests..."', 'Adding info: "Building on that idea, in Brazil we have seen..."'],
        phrases: ['I completely agree with...', 'That\'s an interesting perspective, however...', 'I would argue that...', 'The evidence actually suggests...', 'Building on that point...', 'From my experience in Brazil...', 'I respectfully disagree because...'],
      },
      {
        code: 'P1-T7-A2', type: 'writing', icon: '✏️',
        title: 'Write an Opinion Paragraph',
        desc: 'Choose ONE statement from the speaking activity and write a well-structured opinion paragraph (80–100 words). Include: your position, one supporting argument, one counter-argument, and your conclusion.',
        tips: ['State your position clearly: "I believe that..." / "In my view..."', 'Support with evidence: "Research shows that..." / "In Brazil, we have seen..."', 'Acknowledge counter-argument: "While some argue that..."', 'Conclude: "Therefore, it is clear that..."'],
        phrases: ['In my view,...', 'I strongly believe that...', 'The evidence supports the idea that...', 'While some argue that...', 'However, it is important to note...', 'Therefore, I conclude that...'],
      },
      {
        code: 'P1-T7-A3', type: 'reading', icon: '📖',
        title: 'Opinion Language — Chunks & Expressions',
        desc: 'Read the guide and answer the questions.',
        text: `In academic discussions, reacting to opinions professionally is a key skill. Here are essential chunks:\n\nAGREEING:\n"That's a valid point."\n"I couldn't agree more."\n"You raise an important issue here."\n"Absolutely, and I would add that..."\n\nPARTIALLY AGREEING:\n"I see your point, however..."\n"That's true to some extent, but..."\n"While I agree with the general idea, I think..."\n\nDISAGREEING POLITELY:\n"I respectfully disagree because..."\n"The evidence actually points in a different direction."\n"I would challenge that assumption."\n"With all due respect, I think we need to consider..."\n\nSHARING INFORMATION:\n"Interestingly, in Brazil we have found that..."\n"According to recent data..."\n"A study published in The Lancet suggests..."\n"From a public health perspective..."`,
        questions: [
          { q: 'Which phrase shows PARTIAL agreement?', options: ['"I couldn\'t agree more."', '"I respectfully disagree."', '"I see your point, however..."', '"Absolutely!"'], answer: 2 },
          { q: 'How do you politely disagree in an academic context?', options: ['"That\'s wrong."', '"I respectfully disagree because..."', '"No, you\'re mistaken."', '"I don\'t think so."'], answer: 1 },
          { q: 'Which phrase is best for sharing research-based information?', options: ['"I heard that..."', '"Somebody said..."', '"According to recent data..."', '"I think maybe..."'], answer: 2 },
          { q: '"You raise an important issue here" is used to:', options: ['Disagree', 'Partially agree', 'Agree and acknowledge', 'Change the subject'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 8, code: 'P1-T8',
    title: 'Healthcare Vocabulary in English',
    subtitle: 'Week 8',
    color: '#378add',
    activities: [
      {
        code: 'P1-T8-A1', type: 'speaking', icon: '🎙️',
        title: 'Talk About Health Issues in Brazil',
        desc: 'Record yourself talking about the main public health challenges in Brazil today. Use specific vocabulary from your area. Cover: at least 2 major health issues, what is being done to address them, and what more could be done.',
        tips: ['"One of the most pressing public health challenges in Brazil is..."', '"The prevalence of ___ has increased significantly in recent years."', '"The government has implemented ___ to address this issue."', '"However, more investment in ___ is needed."'],
        phrases: ['The prevalence of...', 'Risk factors include...', 'The most vulnerable populations are...', 'Prevention strategies focus on...', 'Evidence-based interventions...', 'Chronic non-communicable diseases...'],
      },
      {
        code: 'P1-T8-A2', type: 'writing', icon: '✏️',
        title: 'Healthcare Vocabulary in Context',
        desc: 'Write a paragraph (80–100 words) describing a public health challenge in Brazil using at least 8 of these terms: prevalence, incidence, morbidity, mortality, risk factor, intervention, prevention, treatment, chronic, acute, epidemic, pandemic, vulnerable population, evidence-based.',
        tips: ['Choose one specific health challenge you know well (e.g., diabetes, hypertension, mental health)', 'Use the vocabulary naturally within your sentences', 'Aim for academic tone — not too informal', 'Check: did you use at least 8 terms?'],
        phrases: ['The prevalence of ___ has reached...', 'Key risk factors include...', 'Evidence-based interventions have shown...', 'Vulnerable populations are disproportionately affected...', 'Prevention strategies must address...'],
      },
      {
        code: 'P1-T8-A3', type: 'reading', icon: '📖',
        title: 'Public Health Vocabulary — Reading',
        desc: 'Read and answer the questions.',
        text: `Non-communicable diseases (NCDs) are the leading cause of death worldwide, accounting for 74% of all deaths globally. In Brazil, cardiovascular disease, diabetes, cancer, and chronic respiratory diseases represent the most significant public health burden.\n\nThe prevalence of type 2 diabetes in Brazil has reached 11.3% of the adult population, with higher incidence rates in low-income urban areas. Risk factors include sedentary lifestyle, poor nutrition, and limited access to preventive healthcare.\n\nEvidence-based interventions such as community health worker programs (Agentes Comunitários de Saúde) have proven effective in reducing morbidity rates among vulnerable populations. However, persistent inequalities in healthcare access continue to undermine prevention efforts in rural and peri-urban regions.`,
        questions: [
          { q: 'What percentage of deaths worldwide are caused by NCDs?', options: ['50%', '60%', '74%', '90%'], answer: 2 },
          { q: 'What is the prevalence of type 2 diabetes in Brazil?', options: ['5.2%', '8.7%', '11.3%', '15.0%'], answer: 2 },
          { q: 'What are the Agentes Comunitários de Saúde?', options: ['Hospital administrators', 'Community health workers', 'University researchers', 'Government ministers'], answer: 1 },
          { q: 'What continues to undermine prevention efforts?', options: ['Too many doctors', 'Lack of research', 'Persistent inequalities in healthcare access', 'Government policies'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 9, code: 'P1-T9',
    title: 'Chunks & Expressions for Academic Settings',
    subtitle: 'Week 9',
    color: '#d4537e',
    activities: [
      {
        code: 'P1-T9-A1', type: 'speaking', icon: '🎙️',
        title: 'Use Academic Chunks Naturally',
        desc: 'Record yourself in a mock academic discussion. Use at least 8 of the chunks from the reading activity naturally in context. Talk about any topic from your area of research. Your speech should sound natural and fluent — not as if reading a list.',
        tips: ['Prepare a topic first: what will you discuss?', 'Mark the 8 chunks you want to use before recording', 'Record yourself, then listen back — did you sound natural?', 'Record again if needed — fluency comes with practice!'],
        phrases: ['It is worth noting that...', 'This is particularly relevant because...', 'One could argue that...', 'The implications of this are...', 'In light of recent evidence...', 'From a methodological standpoint...', 'This raises the question of...', 'To a certain extent...'],
      },
      {
        code: 'P1-T9-A2', type: 'writing', icon: '✏️',
        title: 'Write Using Academic Chunks',
        desc: 'Write a short discussion paragraph (90–120 words) on ONE of these topics, using at least 6 academic chunks:\n\n• The role of community health workers in Brazil\n• Mental health care access in low-income populations\n• The impact of urbanisation on public health',
        tips: ['Choose the topic you know best', 'Plan your argument before writing', 'Use chunks to connect ideas: "It is worth noting that..." / "In light of recent evidence..."', 'End with an implication or recommendation'],
        phrases: ['It is worth noting that...', 'In light of recent evidence...', 'From a public health perspective...', 'The implications of this are significant...', 'This raises important questions about...', 'It could be argued that...'],
      },
      {
        code: 'P1-T9-A3', type: 'reading', icon: '📖',
        title: 'Academic Chunk Reference Guide',
        desc: 'Study the chunks and answer the questions.',
        text: `Academic English relies heavily on fixed expressions — called "chunks" — that signal the type of information being communicated.\n\nINTRODUCING IDEAS:\n"It is worth noting that..." | "It should be highlighted that..." | "An important consideration is..."\n\nADDING INFORMATION:\n"Furthermore, it is evident that..." | "In addition to this..." | "Building on this argument..."\n\nSHOWING CONTRAST:\n"However, it is important to acknowledge..." | "On the other hand..." | "Despite this..."\n\nDRAWING CONCLUSIONS:\n"In light of this evidence..." | "The findings therefore suggest..." | "This leads to the conclusion that..."\n\nMAKING RECOMMENDATIONS:\n"It is recommended that..." | "Future research should focus on..." | "Policy makers would benefit from..."`,
        questions: [
          { q: 'Which chunk is used to ADD information?', options: ['"However, it is important..."', '"Building on this argument..."', '"In light of this evidence..."', '"It is recommended that..."'], answer: 1 },
          { q: 'Which chunk INTRODUCES a contrast?', options: ['"Furthermore, it is evident..."', '"Building on this argument..."', '"On the other hand..."', '"It is worth noting..."'], answer: 2 },
          { q: 'Which chunk is used for RECOMMENDATIONS?', options: ['"In addition to this..."', '"Future research should focus on..."', '"It should be highlighted..."', '"The findings suggest..."'], answer: 1 },
          { q: '"In light of this evidence..." is used to:', options: ['Add information', 'Introduce a new topic', 'Draw a conclusion', 'Make a recommendation'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 10, code: 'P1-T10',
    title: 'Q&A After Presentations',
    subtitle: 'Week 10',
    color: '#ff6a00',
    activities: [
      {
        code: 'P1-T10-A1', type: 'speaking', icon: '🎙️',
        title: 'Answer Difficult Academic Questions',
        desc: 'Record yourself answering these 3 challenging questions about your research area. Be confident, clear and use stalling strategies if needed:\n\n1. "Your methodology relies heavily on self-reported data. How do you address potential bias?"\n2. "How does your work differ from what has already been done in this field?"\n3. "What are the limitations of your study?"',
        tips: ['Buy time: "That\'s a great question. Let me think about that for a moment..."', 'Acknowledge the challenge: "You raise a valid concern. In response to that..."', 'Be honest about limitations: "One limitation I acknowledge is... However..."', 'Redirect if unsure: "That falls slightly outside the scope of this study, but..."'],
        phrases: ['That\'s a great question.', 'Let me address that directly.', 'In response to that concern...', 'You raise a valid point.', 'One limitation I acknowledge is...', 'This falls outside the scope of...', 'Further research would be needed to...'],
      },
      {
        code: 'P1-T10-A2', type: 'writing', icon: '✏️',
        title: 'Write Q&A Responses',
        desc: 'Write written responses to these 2 questions (50–60 words each):\n\n1. "How do you ensure the validity of your research findings?"\n2. "What practical implications does your research have for healthcare policy?"\n\nUse formal, confident academic language.',
        tips: ['Respond directly to the question before elaborating', 'Use phrases like "To ensure validity..." and "In terms of practical implications..."', 'Be specific — mention real strategies or policies', 'End each response with a forward-looking statement'],
        phrases: ['To ensure validity, I...', 'The practical implications include...', 'This research directly informs...', 'Policy makers could use these findings to...', 'Future steps include...'],
      },
      {
        code: 'P1-T10-A3', type: 'reading', icon: '📖',
        title: 'Q&A Language Strategies',
        desc: 'Read the guide and answer the questions.',
        text: `Handling questions after a presentation is one of the most challenging parts of academic communication. These strategies can help:\n\nSTALLING FOR TIME:\n"That's a really interesting question. Let me take a moment to address it properly."\n"Could you just repeat the second part of that question?"\n\nACKNOWLEDGING GOOD QUESTIONS:\n"You raise a really important point."\n"That's a central challenge in this field."\n\nHANDLING DIFFICULT QUESTIONS:\n"I appreciate that question. While I don't have a definitive answer, I can say..."\n"That falls slightly outside the scope of this study, but it would be interesting to explore in future research."\n\nCONFIRMING UNDERSTANDING:\n"If I understand correctly, you are asking whether..."\n"Just to clarify — are you referring to...?"`,
        questions: [
          { q: 'What is a "stalling strategy" in Q&A?', options: ['Ignoring the question', 'Buying time to think before answering', 'Changing the subject', 'Asking someone else to answer'], answer: 1 },
          { q: 'How do you handle a question outside your research scope?', options: ['"I don\'t know."', '"That\'s a bad question."', '"That falls slightly outside the scope of this study, but..."', '"Please ask someone else."'], answer: 2 },
          { q: 'Which phrase confirms your understanding of a question?', options: ['"Yes, sure."', '"If I understand correctly, you are asking whether..."', '"Obviously..."', '"That\'s obvious."'], answer: 1 },
          { q: '"You raise a really important point" is used to:', options: ['Disagree', 'Stall for time', 'Acknowledge and validate the question', 'End the Q&A'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 11, code: 'P1-T11',
    title: 'Formal Academic Writing',
    subtitle: 'Week 11',
    color: '#7f77dd',
    activities: [
      {
        code: 'P1-T11-A1', type: 'speaking', icon: '🎙️',
        title: 'Talk Through Your Writing Process',
        desc: 'Record yourself describing your academic writing process in English. Cover: how you structure a research paper, what challenges you face when writing in English, and what strategies you use to improve. Speak for 90 seconds.',
        tips: ['"When writing academic papers in English, I usually start by..."', '"One challenge I face is ___, which I address by..."', '"I find it helpful to ___ before writing the introduction."', '"My biggest challenge with academic English is... because..."'],
        phrases: ['When writing in English, I...', 'One challenge I face is...', 'I usually start by outlining...', 'To improve my writing, I...', 'The most difficult part is...', 'I find it useful to...'],
      },
      {
        code: 'P1-T11-A2', type: 'writing', icon: '✏️',
        title: 'Write an Academic Introduction',
        desc: 'Write the introduction of a research paper (100–130 words). A strong introduction should: establish the broad context, identify the research gap, state the purpose of your study, and briefly outline the structure. Choose your actual post-doctoral topic or a topic from your field.',
        tips: ['Broad context → narrow down to your specific focus', 'Use phrases like "Despite significant advances in... there remains a gap in understanding..."', 'State your purpose: "This study aims to..."', 'Outline structure: "The paper is organized as follows: Section 1 discusses... Section 2 presents..."'],
        phrases: ['In recent decades, significant progress has been made in...', 'However, there remains a gap in...', 'This study aims to...', 'The findings are expected to...', 'The paper proceeds as follows...'],
      },
      {
        code: 'P1-T11-A3', type: 'reading', icon: '📖',
        title: 'Academic Writing Style — Reading',
        desc: 'Read the guide and answer the questions.',
        text: `Academic writing in English follows specific conventions that differ from everyday writing.\n\nFORMALITY: Use formal vocabulary and avoid contractions.\nInformal: "It's clear that..." → Formal: "It is evident that..."\nInformal: "A lot of studies show..." → Formal: "Numerous studies demonstrate..."\n\nOBJECTIVITY: Write in an impersonal, objective tone.\nPersonal: "I think this proves..." → Academic: "The evidence suggests..."\n\nPRECISION: Be specific and exact.\nVague: "Some people are affected." → Precise: "Approximately 12% of the population is affected."\n\nCOHERENCE: Use linking words to connect ideas.\n"Furthermore... However... In addition... Consequently... Therefore..."\n\nHEDGING: Express appropriate uncertainty.\n"This may suggest..." / "The results appear to indicate..." / "It could be argued that..."`,
        questions: [
          { q: 'Why should you avoid contractions in academic writing?', options: ['They are grammatically wrong', 'They are too informal', 'They are too long', 'They confuse readers'], answer: 1 },
          { q: '"Numerous studies demonstrate" is more academic than:', options: ['"Research shows"', '"A lot of studies show"', '"Scientists say"', '"Data proves"'], answer: 1 },
          { q: 'What is the purpose of "hedging" language?', options: ['To sound uncertain and confused', 'To express appropriate academic caution', 'To avoid using evidence', 'To make writing shorter'], answer: 1 },
          { q: 'Which is the most PRECISE academic statement?', options: ['"Many people are sick."', '"Some are affected."', '"Approximately 12% of the population is affected."', '"A lot of patients suffer."'], answer: 2 },
        ],
      },
    ],
  },
  {
    num: 12, code: 'P1-T12',
    title: 'Final Review & Mock Presentation',
    subtitle: 'Week 12 — Final',
    color: '#ff6a00',
    activities: [
      {
        code: 'P1-T12-A1', type: 'speaking', icon: '🎙️',
        title: '🎓 Mock Presentation — 5 Minutes',
        desc: 'This is your final mock presentation! Record a full 5-minute academic presentation of your post-doctoral project. You should cover:\n\n1. Introduction — who you are and your institution\n2. Research context and problem\n3. Objectives\n4. Methodology\n5. Expected findings and significance\n6. Conclusion and future directions\n\nSpeak confidently, use the vocabulary and chunks from all previous topics, and imagine you are presenting to an Italian academic panel.',
        tips: ['Practice at least once before recording!', 'Use all the chunks and vocabulary from Topics 1-11', 'Speak clearly — pause between sections', 'Record your full 5 minutes without stopping', 'Listen back and note areas to improve'],
        phrases: ['Good morning, my name is...', 'Today I present my research on...', 'The central objective is...', 'The methodology involves...', 'In conclusion, this work...', 'I would be happy to answer questions.'],
      },
      {
        code: 'P1-T12-A2', type: 'writing', icon: '✏️',
        title: '🎓 Final Written Reflection',
        desc: 'Write a reflection (120–150 words) on your English language development throughout this 3-month program. Cover: what you found most challenging, what improved the most, what you are still working on, and how you plan to continue developing your academic English after this program.',
        tips: ['"The most challenging aspect of this program was... because..."', '"I have noticed significant improvement in my ability to..."', '"One area I am still developing is..."', '"To continue improving, I plan to..."'],
        phrases: ['Throughout this program, I have...', 'The most significant improvement I noticed is...', 'I found it particularly challenging to...', 'As a result of this practice...', 'Moving forward, I intend to...', 'I feel more confident now to...'],
      },
      {
        code: 'P1-T12-A3', type: 'reading', icon: '📖',
        title: '🎓 Final Review — Academic English Mastery',
        desc: 'Read the final text and answer the questions.',
        text: `Academic communication is a skill that develops over time and with consistent practice. For non-native English speakers, particularly researchers who must present their work at international conferences, the journey involves not just linguistic competence but also cultural and disciplinary awareness.\n\nSuccessful academic communicators share several characteristics:\n• They know their subject deeply and can explain it clearly to different audiences\n• They use appropriate vocabulary, hedging language and academic chunks naturally\n• They are comfortable with uncertainty and can handle unexpected questions with confidence\n• They understand that making mistakes is part of the learning process\n\nBrazilian researchers in health sciences bring a unique and valuable perspective to international academic discourse. The experience of working within a universal healthcare system like the SUS, navigating a complex public health landscape, and conducting research in a context of significant social inequality provides insights that enrich global health debates.\n\nThe goal is not perfection — it is confident, clear and authentic communication.`,
        questions: [
          { q: 'What do successful academic communicators know how to do?', options: ['Memorise texts perfectly', 'Explain complex topics clearly to different audiences', 'Avoid difficult questions', 'Write only in their native language'], answer: 1 },
          { q: 'What unique perspective do Brazilian health researchers bring?', options: ['Experience with a universal healthcare system and social inequality', 'Knowledge of European healthcare systems', 'Experience only in private healthcare', 'Focus on developed-country contexts only'], answer: 0 },
          { q: 'According to the text, what is the ultimate goal of academic communication?', options: ['Perfection in grammar', 'Confident, clear and authentic communication', 'Speaking like a native', 'Memorising all vocabulary'], answer: 1 },
          { q: 'What helps non-native speakers succeed in academic communication?', options: ['Only linguistic competence', 'Cultural and disciplinary awareness too', 'Avoiding mistakes', 'Speaking very fast'], answer: 1 },
        ],
      },
    ],
  },
];

const TYPE_ICONS = { speaking: '🎙️', writing: '✏️', reading: '📖' };
const TYPE_COLORS = { speaking: { bg: '#fbeaf0', color: '#72243E' }, writing: { bg: '#eeedfe', color: '#3C3489' }, reading: { bg: '#e1f5ee', color: '#085041' } };

// Deadline: 3 months from now
const START_DATE = new Date('2026-06-01');
const DEADLINE = new Date(START_DATE);
DEADLINE.setMonth(DEADLINE.getMonth() + 3);

export default function PracticeHubP1({ user, student, onLogout }) {
  const navigate = useNavigate();
  const email = user?.email || '';

  const [completedCodes, setCompletedCodes] = useState(() =>
    getItem(email, 'p1_completed', [])
  );
  const [expandedTopic, setExpandedTopic] = useState('P1-T1');

  const totalActivities = P1_LESSONS.reduce((acc, l) => acc + l.activities.length, 0);
  const totalDone = P1_LESSONS.reduce((acc, l) => acc + l.activities.filter(a => completedCodes.includes(a.code)).length, 0);
  const pct = Math.round((totalDone / totalActivities) * 100);

  const daysLeft = Math.ceil((DEADLINE - new Date()) / (1000 * 60 * 60 * 24));
  const weeksLeft = Math.ceil(daysLeft / 7);

  const handleStart = (act, topicTitle) => {
    if (!completedCodes.includes(act.code)) {
      const updated = [...completedCodes, act.code];
      setCompletedCodes(updated);
      setItem(email, 'p1_completed', updated);
      const xp = getItem(email, 'xp', 0) + 25;
      setItem(email, 'xp', xp);
    }
    // Navigate to appropriate practice page
    if (act.type === 'reading') {
      navigate(`/practice/reading?p1=true&code=${act.code}`);
    } else if (act.type === 'writing') {
      navigate(`/practice/writing?p1=true&code=${act.code}`);
    } else {
      navigate(`/practice/speaking?p1=true&code=${act.code}`);
    }
  };

  return (
    <div className="p1-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="p1-content">

        {/* Header */}
        <div className="p1-header">
          <div className="p1-badge">✦ P1 — Personalizado</div>
          <h1 className="p1-title">Academic English for Health Sciences</h1>
          <p className="p1-sub">Post-doctoral preparation · International presentations · Italy 🇮🇹</p>
        </div>

        {/* Progress + deadline */}
        <div className="p1-progress-card">
          <div className="p1-progress-left">
            <div className="p1-progress-label">Overall progress</div>
            <div className="p1-progress-nums">{totalDone}<span>/{totalActivities} activities</span></div>
            <div className="p1-progress-bar"><div className="p1-progress-fill" style={{ width: pct + '%' }} /></div>
          </div>
          <div className="p1-deadline-box">
            <div className="p1-deadline-icon">⏳</div>
            <div>
              <div className="p1-deadline-label">Program deadline</div>
              <div className="p1-deadline-date">{DEADLINE.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="p1-deadline-weeks">{weeksLeft > 0 ? `${weeksLeft} weeks remaining` : 'Program complete!'}</div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="p1-topics">
          {P1_LESSONS.map(lesson => {
            const actsDone = lesson.activities.filter(a => completedCodes.includes(a.code)).length;
            const isOpen = expandedTopic === lesson.code;
            const allDone = actsDone === lesson.activities.length;

            return (
              <div key={lesson.code} className={`p1-topic-card ${allDone ? 'done' : ''}`} style={{ '--topic-color': lesson.color }}>
                <div className="p1-topic-header" onClick={() => setExpandedTopic(isOpen ? null : lesson.code)}>
                  <div className="p1-topic-left">
                    <div className={`p1-topic-num ${allDone ? 'done' : ''}`} style={{ background: allDone ? '#1d9e75' : lesson.color }}>
                      {allDone ? '✓' : lesson.num}
                    </div>
                    <div>
                      <div className="p1-topic-title">{lesson.title}</div>
                      <div className="p1-topic-meta">
                        <span className="p1-topic-week">{lesson.subtitle}</span>
                        <span className="p1-topic-count">{actsDone}/{lesson.activities.length} done</span>
                      </div>
                    </div>
                  </div>
                  <div className="p1-topic-right">
                    <div className="p1-topic-mini-bar">
                      <div className="p1-topic-mini-fill" style={{ width: (actsDone / lesson.activities.length * 100) + '%', background: lesson.color }} />
                    </div>
                    <span className={`p1-chevron ${isOpen ? 'open' : ''}`}>▾</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="p1-activities">
                    {lesson.activities.map((act, i) => {
                      const done = completedCodes.includes(act.code);
                      const tc = TYPE_COLORS[act.type];
                      return (
                        <div key={act.code} className={`p1-activity-row ${done ? 'done' : ''}`}>
                          <div className="p1-activity-left">
                            <div className={`p1-activity-check ${done ? 'done' : ''}`} style={{ background: done ? '#1d9e75' : '#f0ede8', color: done ? '#fff' : '#aaa' }}>
                              {done ? '✓' : i + 1}
                            </div>
                            <div>
                              <div className="p1-activity-header">
                                <span className="p1-type-pill" style={{ background: tc.bg, color: tc.color }}>{act.icon} {act.type.charAt(0).toUpperCase() + act.type.slice(1)}</span>
                              </div>
                              <div className="p1-activity-title">{act.title}</div>
                              <div className="p1-activity-desc">{act.desc.split('\n')[0]}</div>
                            </div>
                          </div>
                          <button
                            className={`p1-start-btn ${done ? 'done' : ''}`}
                            style={!done ? { background: lesson.color } : {}}
                            onClick={() => handleStart(act, lesson.title)}
                          >
                            {done ? 'Redo ↺' : 'Start →'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

export { P1_LESSONS };
