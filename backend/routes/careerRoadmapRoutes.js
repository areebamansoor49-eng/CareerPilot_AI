const express = require("express");

const router = express.Router();

// ========================================================
// HELPERS
// ========================================================

function cleanString(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
}

function cleanArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => cleanString(item))
    .filter(Boolean);
}

// ========================================================
// DETECT CAREER CATEGORY
// ========================================================

function detectCareerCategory(careerField, targetRole) {
  const text = `${careerField} ${targetRole}`.toLowerCase();

  if (
    /doctor|medical|medicine|nurse|nursing|dentist|pharmacy|clinical|healthcare|surgeon|physician|therapist/.test(
      text
    )
  ) {
    return "healthcare";
  }

  if (
    /law|lawyer|legal|attorney|advocate|solicitor|barrister/.test(
      text
    )
  ) {
    return "law";
  }

  if (
    /pilot|aviation|airline|aerospace/.test(text)
  ) {
    return "aviation";
  }

  if (
    /software|developer|programmer|web|frontend|backend|full stack|data|cyber|cloud|devops|machine learning|artificial intelligence|technology|computer science|it/.test(
      text
    )
  ) {
    return "technology";
  }

  if (
    /engineering|engineer|civil|mechanical|electrical|chemical|industrial/.test(
      text
    )
  ) {
    return "engineering";
  }

  if (
    /design|designer|graphic|ui|ux|illustration|animation|fashion|artist|photography|video|film|media|creative/.test(
      text
    )
  ) {
    return "creative";
  }

  if (
    /business|management|marketing|finance|accounting|sales|human resources|hr|banking|consulting|entrepreneur/.test(
      text
    )
  ) {
    return "business";
  }

  if (
    /education|teacher|teaching|professor|lecturer|academic|research/.test(
      text
    )
  ) {
    return "education";
  }

  if (
    /agriculture|farming|agronomy|food science/.test(text)
  ) {
    return "agriculture";
  }

  if (
    /hospitality|hotel|tourism|travel|chef|culinary/.test(text)
  ) {
    return "hospitality";
  }

  if (
    /electrician|plumber|welder|carpenter|mechanic|technician|construction|trade/.test(
      text
    )
  ) {
    return "skilled_trade";
  }

  if (
    /sports|athlete|fitness|coach|physical training/.test(
      text
    )
  ) {
    return "sports";
  }

  return "general";
}

// ========================================================
// BUILD PERSONALIZED FALLBACK
//
// This is NOT fake user data.
// It is generated from the actual submitted profile.
// ========================================================

function buildFallbackRoadmap(profile) {
  const {
    careerField,
    targetRole,
    currentLevel,
    education,
    experience,
    skills,
    interests,
    careerGoal,
    weeklyHours,
    preferredLearning,
  } = profile;

  const category = detectCareerCategory(
    careerField,
    targetRole
  );

  const skillList =
    skills.length > 0
      ? skills
      : ["Current professional skills"];

  const interestList =
    interests.length > 0
      ? interests
      : ["Career development"];

  const time =
    weeklyHours || "your available weekly hours";

  const experienceText =
    experience || "No previous professional experience provided";

  // ======================================================
  // COMMON CAREER OVERVIEW
  // ======================================================

  const careerOverview = {
    targetRole,
    field: careerField,

    startingPoint:
      `You are currently at the ${currentLevel} level with an educational background in ${education}. Your current experience is: ${experienceText}. Your current skills include ${skillList.join(", ")}.`,

    careerDirection:
      `Your roadmap should progressively move you from your current ${currentLevel} position toward ${targetRole} by strengthening relevant skills, gaining practical experience, building professional evidence and preparing for appropriate career opportunities.`,
  };

  // ======================================================
  // TECHNOLOGY
  // ======================================================

  if (category === "technology") {
    return {
      careerOverview,

      skillAssessment: {
        existingStrengths: skillList,

        skillGaps: [
          `Role-specific skills required for ${targetRole}`,
          "Practical problem solving",
          "Real-world project experience",
          "Professional workflow",
          "Interview preparation",
        ],

        prioritySkills: [
          `Core ${targetRole} skills`,
          "Practical project development",
          "Problem solving",
          "Professional communication",
          "Portfolio development",
        ],
      },

      roadmap: [
        {
          phase: 1,
          title: "Foundation & Skill Gap Analysis",
          duration: "4-6 weeks",

          objective:
            `Understand the requirements of ${targetRole} and strengthen the most important missing foundations.`,

          skills: [
            `Core ${careerField} concepts`,
            `Fundamentals related to ${targetRole}`,
            "Problem solving",
          ],

          learningActions: [
            `Study the core concepts required for ${targetRole}.`,
            "Compare current skills with real job requirements.",
            `Use your available ${time} consistently.`,
          ],

          practicalExperience: [
            "Complete small practical exercises.",
            "Document problems solved and skills practiced.",
          ],

          milestones: [
            "Major skill gaps identified.",
            "A consistent weekly learning routine established.",
          ],
        },

        {
          phase: 2,
          title: "Practical Projects",
          duration: "6-10 weeks",

          objective:
            `Turn knowledge into practical evidence relevant to ${targetRole}.`,

          skills: [
            "Project planning",
            "Practical implementation",
            "Problem solving",
            "Documentation",
          ],

          learningActions: [
            `Build projects directly related to ${targetRole}.`,
            "Study professional examples.",
            "Improve projects through iteration and feedback.",
          ],

          practicalExperience: [
            "Complete 2-3 meaningful projects.",
            "Document your contribution and results.",
          ],

          milestones: [
            "At least two relevant projects completed.",
            "Projects are ready to be presented professionally.",
          ],
        },

        {
          phase: 3,
          title: "Professional Preparation",
          duration: "4-6 weeks",

          objective:
            "Prepare your professional profile for real opportunities.",

          skills: [
            "Resume writing",
            "Portfolio presentation",
            "Interview communication",
            "Professional networking",
          ],

          learningActions: [
            "Analyze real job descriptions.",
            "Practice role-specific interview questions.",
            "Prepare explanations for your projects.",
          ],

          practicalExperience: [
            "Seek internships, freelance work, volunteering, trainee positions or other legitimate opportunities appropriate to your level.",
          ],

          milestones: [
            "Resume aligned with target role.",
            "Portfolio ready.",
            "Interview preparation completed.",
          ],
        },

        {
          phase: 4,
          title: "Career Launch",
          duration: "Ongoing",

          objective:
            `Begin actively pursuing opportunities related to ${targetRole}.`,

          skills: [
            "Job searching",
            "Networking",
            "Interviewing",
            "Professional follow-up",
          ],

          learningActions: [
            "Track relevant vacancies.",
            "Customize applications.",
            "Continue improving skills based on market requirements.",
          ],

          practicalExperience: [
            "Apply for internships, junior roles, trainee positions, freelance projects or other suitable opportunities.",
          ],

          milestones: [
            "Consistent application strategy established.",
            "Professional networking active.",
            "Continuous skill improvement maintained.",
          ],
        },
      ],

      learningPlan: {
        coreTopics: [
          `Core ${careerField} knowledge`,
          `${targetRole}-specific skills`,
          "Problem solving",
          "Practical projects",
          "Professional communication",
        ],

        recommendedLearningMethods: [
          preferredLearning || "Mixed / Combination",
          "Hands-on projects",
          "Practice exercises",
          "Professional examples",
        ],

        practiceStrategy:
          `Use your ${time} by dividing it between learning, hands-on practice and project development.`,
      },

      projectsAndExperience: [
        {
          title: `${targetRole} Portfolio Project`,

          description:
            `Build a practical project that demonstrates important capabilities for ${targetRole}.`,

          difficulty: "Intermediate",

          skillsDeveloped: [
            "Problem solving",
            "Role-specific skills",
            "Project execution",
            "Documentation",
          ],

          outcome:
            "A portfolio-ready project demonstrating practical ability.",
        },

        {
          title: "Real-World Problem Project",

          description:
            `Identify a realistic problem related to ${careerField} and create a structured solution.`,

          difficulty: "Intermediate to Advanced",

          skillsDeveloped: [
            "Research",
            "Planning",
            "Problem solving",
            "Professional presentation",
          ],

          outcome:
            "A stronger practical example for your portfolio and interviews.",
        },
      ],

      certifications: [],

      careerPreparation: {
        portfolio: [
          `Show projects relevant to ${targetRole}.`,
          "Explain the problem, process and outcome of each project.",
          "Remove unrelated or weak work.",
        ],

        resume: [
          `Tailor your resume toward ${targetRole}.`,
          "Highlight relevant skills and practical achievements.",
          "Include meaningful projects and experience.",
        ],

        interviewPreparation: [
          "Practice explaining your projects.",
          "Prepare role-specific questions.",
          "Prepare real examples of problem solving.",
        ],

        networking: [
          `Connect with professionals working in ${careerField}.`,
          "Participate in relevant professional communities.",
          "Seek mentorship where appropriate.",
        ],

        jobSearchStrategy: [
          `Search for ${targetRole} and closely related entry-level roles.`,
          "Track applications.",
          "Improve applications based on feedback.",
        ],
      },

      milestones: [
        {
          milestone: "Foundation completed",
          expectedOutcome:
            "Core target-role knowledge and major gaps identified.",
          timeframe: "1-2 months",
        },

        {
          milestone: "Portfolio developed",
          expectedOutcome:
            "At least two relevant practical projects completed.",
          timeframe: "2-4 months",
        },

        {
          milestone: "Professional readiness",
          expectedOutcome:
            "Resume, portfolio and interview preparation completed.",
          timeframe: "3-5 months",
        },

        {
          milestone: "Career transition active",
          expectedOutcome:
            "Applications and professional networking underway.",
          timeframe: "4+ months",
        },
      ],

      nextSteps: [
        `Identify the most important skill gap for ${targetRole}.`,
        "Create a weekly learning schedule.",
        "Start your first practical project.",
        "Review real job descriptions.",
        "Update your resume and portfolio as you progress.",
      ],
    };
  }

  // ======================================================
  // HEALTHCARE
  // ======================================================

  if (category === "healthcare") {
    return {
      careerOverview,

      skillAssessment: {
        existingStrengths: skillList,

        skillGaps: [
          "Professional knowledge",
          "Practical competency",
          "Professional communication",
          "Relevant supervised experience",
          "Formal qualification or licensing requirements where applicable",
        ],

        prioritySkills: [
          "Core professional knowledge",
          "Communication",
          "Ethical practice",
          "Practical competency",
        ],
      },

      roadmap: [
        {
          phase: 1,
          title: "Academic Foundation",
          duration: "3-6 months",

          objective:
            `Strengthen the academic foundation required for ${targetRole}.`,

          skills: [
            "Core subject knowledge",
            "Professional communication",
            "Ethical awareness",
          ],

          learningActions: [
            "Identify the formal educational requirements for the profession.",
            "Strengthen prerequisite knowledge where necessary.",
          ],

          practicalExperience: [
            "Seek legitimate supervised exposure where appropriate.",
          ],

          milestones: [
            "Formal requirements identified.",
            "Academic gaps mapped.",
          ],
        },

        {
          phase: 2,
          title: "Formal Training & Practical Experience",
          duration: "Profession dependent",

          objective:
            "Complete the recognized education, training and supervised practice required for the target profession.",

          skills: [
            "Professional competency",
            "Practical application",
            "Communication",
            "Ethical decision making",
          ],

          learningActions: [
            "Follow the recognized educational pathway.",
            "Prepare for relevant professional examinations where applicable.",
          ],

          practicalExperience: [
            "Complete required supervised placements or practical training where applicable.",
          ],

          milestones: [
            "Required formal education progressing.",
            "Relevant practical requirements progressing.",
          ],
        },

        {
          phase: 3,
          title: "Professional Eligibility",
          duration: "Jurisdiction dependent",

          objective:
            "Complete legitimate registration, examination or licensing requirements where applicable.",

          skills: [
            "Professional communication",
            "Regulatory awareness",
            "Interview preparation",
          ],

          learningActions: [
            "Verify requirements with the relevant professional authority.",
          ],

          practicalExperience: [
            "Build legitimate supervised professional experience.",
          ],

          milestones: [
            "Professional eligibility requirements identified and completed where applicable.",
          ],
        },
      ],

      learningPlan: {
        coreTopics: [
          "Professional knowledge",
          "Ethics",
          "Communication",
          "Practical competency",
          "Regulatory requirements",
        ],

        recommendedLearningMethods: [
          preferredLearning || "Mixed / Combination",
          "Formal education",
          "Supervised practice",
          "Case-based learning",
        ],

        practiceStrategy:
          `Use your ${time} for structured academic learning and appropriate practical development.`,
      },

      projectsAndExperience: [
        {
          title: "Professional Case-Based Practice",

          description:
            "Work through educational case studies appropriate to your qualification level.",

          difficulty: "Intermediate",

          skillsDeveloped: [
            "Professional reasoning",
            "Communication",
            "Decision making",
          ],

          outcome:
            "Improved preparation for formal training and professional assessment.",
        },
      ],

      certifications: [],

      careerPreparation: {
        portfolio: [
          "Maintain evidence of legitimate education and professional achievements.",
          "Document relevant supervised experiences where appropriate.",
        ],

        resume: [
          "Highlight education, training and relevant experience.",
        ],

        interviewPreparation: [
          "Practice professional and behavioral interview questions.",
          "Prepare examples demonstrating responsibility and communication.",
        ],

        networking: [
          "Connect with legitimate professional associations.",
          "Seek appropriate mentorship.",
        ],

        jobSearchStrategy: [
          `Search for opportunities appropriate to your qualification level.`,
          "Confirm professional eligibility before applying to regulated roles.",
        ],
      },

      milestones: [
        {
          milestone: "Professional pathway identified",
          expectedOutcome:
            "Formal education, training and regulatory requirements are understood.",
          timeframe: "First month",
        },

        {
          milestone: "Training progressing",
          expectedOutcome:
            "Required education and practical training underway.",
          timeframe: "Profession dependent",
        },

        {
          milestone: "Professional eligibility",
          expectedOutcome:
            "Applicable registration/licensing/examination requirements completed.",
          timeframe: "Jurisdiction dependent",
        },
      ],

      nextSteps: [
        `Confirm the official pathway for ${targetRole}.`,
        "Compare your education with the required qualifications.",
        "Identify your biggest academic or practical gap.",
        `Create a weekly plan around your available ${time}.`,
      ],
    };
  }

  // ======================================================
  // LAW
  // ======================================================

  if (category === "law") {
    return {
      careerOverview,

      skillAssessment: {
        existingStrengths: skillList,

        skillGaps: [
          "Legal research",
          "Legal writing",
          "Case analysis",
          "Professional communication",
          "Jurisdiction-specific qualification requirements",
        ],

        prioritySkills: [
          "Legal reasoning",
          "Research",
          "Writing",
          "Communication",
          "Professional ethics",
        ],
      },

      roadmap: [
        {
          phase: 1,
          title: "Legal Foundation",
          duration: "2-3 months",

          objective:
            "Build strong legal reasoning, research and writing foundations.",

          skills: [
            "Legal reasoning",
            "Research",
            "Writing",
            "Communication",
          ],

          learningActions: [
            "Study core legal concepts relevant to your intended practice area.",
            "Practice structured legal analysis.",
          ],

          practicalExperience: [
            "Complete academic or supervised legal research activities where available.",
          ],

          milestones: [
            "Can analyze basic legal problems systematically.",
            "Can produce structured legal writing.",
          ],
        },

        {
          phase: 2,
          title: "Practical Legal Experience",
          duration: "3-6 months",

          objective:
            "Develop practical exposure appropriate to your current qualification level.",

          skills: [
            "Case research",
            "Legal drafting",
            "Professional communication",
            "Analytical reasoning",
          ],

          learningActions: [
            "Practice realistic legal scenarios.",
            "Study relevant case analysis.",
          ],

          practicalExperience: [
            "Seek legitimate internships, clerkships or supervised placements where appropriate.",
          ],

          milestones: [
            "Relevant practical experience developed.",
            "Professional communication improved.",
          ],
        },

        {
          phase: 3,
          title: "Qualification & Career Entry",
          duration: "Jurisdiction dependent",

          objective:
            "Progress through the formal qualification pathway applicable to your intended jurisdiction.",

          skills: [
            "Professional practice",
            "Interviewing",
            "Networking",
          ],

          learningActions: [
            "Verify official qualification and admission requirements.",
          ],

          practicalExperience: [
            "Build legitimate supervised experience.",
          ],

          milestones: [
            "Formal pathway requirements understood and progressing.",
          ],
        },
      ],

      learningPlan: {
        coreTopics: [
          "Legal reasoning",
          "Legal research",
          "Legal writing",
          "Professional ethics",
          "Communication",
        ],

        recommendedLearningMethods: [
          preferredLearning || "Mixed / Combination",
          "Case analysis",
          "Research exercises",
          "Supervised practice",
        ],

        practiceStrategy:
          `Use your ${time} for structured reading, analysis, writing and practical experience.`,
      },

      projectsAndExperience: [
        {
          title: "Legal Case Analysis",

          description:
            "Analyze a realistic legal scenario and produce a structured research and reasoning document appropriate to your level.",

          difficulty: "Intermediate",

          skillsDeveloped: [
            "Research",
            "Analysis",
            "Writing",
            "Reasoning",
          ],

          outcome:
            "Practical evidence of legal analytical ability.",
        },
      ],

      certifications: [],

      careerPreparation: {
        portfolio: [
          "Maintain appropriate academic and professional writing samples.",
          "Document legitimate internships and relevant experience.",
        ],

        resume: [
          `Tailor your resume toward ${targetRole}.`,
          "Highlight relevant education and practical experience.",
        ],

        interviewPreparation: [
          "Practice analytical questions.",
          "Prepare behavioral examples.",
        ],

        networking: [
          "Connect with legitimate legal professionals.",
          "Participate in relevant professional communities.",
        ],

        jobSearchStrategy: [
          "Target roles appropriate to your current qualification.",
        ],
      },

      milestones: [
        {
          milestone: "Legal foundation",
          expectedOutcome:
            "Strong basic legal reasoning and research skills.",
          timeframe: "2-3 months",
        },

        {
          milestone: "Practical exposure",
          expectedOutcome:
            "Relevant supervised or academic experience.",
          timeframe: "3-6 months",
        },

        {
          milestone: "Qualification pathway",
          expectedOutcome:
            "Formal professional requirements identified and progressing.",
          timeframe: "Jurisdiction dependent",
        },
      ],

      nextSteps: [
        `Verify the official qualification pathway for ${targetRole}.`,
        "Strengthen legal research and writing.",
        "Seek legitimate supervised experience.",
      ],
    };
  }

  // ======================================================
  // CREATIVE
  // ======================================================

  if (category === "creative") {
    return {
      careerOverview,

      skillAssessment: {
        existingStrengths: skillList,

        skillGaps: [
          `Role-specific creative skills for ${targetRole}`,
          "Portfolio development",
          "Professional presentation",
          "Client/audience understanding",
          "Consistent practice",
        ],

        prioritySkills: [
          `Core ${targetRole} skills`,
          "Portfolio quality",
          "Creative problem solving",
          "Professional communication",
        ],
      },

      roadmap: [
        {
          phase: 1,
          title: "Creative Foundation",
          duration: "4-6 weeks",

          objective:
            `Strengthen fundamental skills relevant to ${targetRole}.`,

          skills: [
            "Creative fundamentals",
            "Research",
            "Problem solving",
          ],

          learningActions: [
            `Study fundamentals directly related to ${targetRole}.`,
            "Analyze professional examples.",
          ],

          practicalExperience: [
            "Complete regular creative exercises.",
          ],

          milestones: [
            "Consistent creative practice established.",
          ],
        },

        {
          phase: 2,
          title: "Portfolio Development",
          duration: "6-10 weeks",

          objective:
            "Create a professional portfolio demonstrating relevant ability.",

          skills: [
            "Creative execution",
            "Presentation",
            "Storytelling",
            "Communication",
          ],

          learningActions: [
            "Create realistic projects.",
            "Improve work using feedback.",
          ],

          practicalExperience: [
            "Complete 3-5 strong relevant portfolio pieces.",
          ],

          milestones: [
            "Portfolio clearly communicates your target role.",
          ],
        },

        {
          phase: 3,
          title: "Professional Launch",
          duration: "4-8 weeks",

          objective:
            "Prepare for freelance, internship or employment opportunities.",

          skills: [
            "Client communication",
            "Professional presentation",
            "Networking",
          ],

          learningActions: [
            "Practice presenting your portfolio.",
            "Research potential employers and clients.",
          ],

          practicalExperience: [
            "Seek legitimate freelance, internship or collaborative opportunities.",
          ],

          milestones: [
            "Portfolio and resume ready.",
            "Professional outreach started.",
          ],
        },
      ],

      learningPlan: {
        coreTopics: [
          `${targetRole} fundamentals`,
          "Creative problem solving",
          "Portfolio development",
          "Professional presentation",
        ],

        recommendedLearningMethods: [
          preferredLearning || "Project-based learning",
          "Hands-on practice",
          "Professional work analysis",
          "Feedback and iteration",
        ],

        practiceStrategy:
          `Use your ${time} mainly for practical creation and portfolio development.`,
      },

      projectsAndExperience: [
        {
          title: "Professional Brief Project",

          description:
            `Complete a realistic brief related to ${targetRole}.`,

          difficulty: "Intermediate",

          skillsDeveloped: [
            "Research",
            "Creative execution",
            "Presentation",
          ],

          outcome:
            "Portfolio-ready professional work.",
        },

        {
          title: "Client-Style Project",

          description:
            "Complete a project with a defined audience, requirements, deadline and revision process.",

          difficulty: "Intermediate",

          skillsDeveloped: [
            "Communication",
            "Creative execution",
            "Revision",
            "Time management",
          ],

          outcome:
            "Evidence of working within realistic professional constraints.",
        },
      ],

      certifications: [],

      careerPreparation: {
        portfolio: [
          "Show your strongest relevant work.",
          "Explain the objective, process and outcome.",
          "Remove weak or unrelated work.",
        ],

        resume: [
          `Focus your resume on ${targetRole}-relevant work.`,
        ],

        interviewPreparation: [
          "Practice presenting your portfolio.",
          "Prepare explanations of your creative decisions.",
        ],

        networking: [
          `Connect with professionals in ${careerField}.`,
          "Participate in relevant communities.",
        ],

        jobSearchStrategy: [
          "Target internships, junior roles, freelance projects and collaborations.",
        ],
      },

      milestones: [
        {
          milestone: "Creative foundation",
          expectedOutcome:
            "Core creative skills strengthened.",
          timeframe: "1-2 months",
        },

        {
          milestone: "Portfolio completed",
          expectedOutcome:
            "Strong relevant portfolio established.",
          timeframe: "2-4 months",
        },

        {
          milestone: "Professional launch",
          expectedOutcome:
            "Applications and professional outreach underway.",
          timeframe: "3-5 months",
        },
      ],

      nextSteps: [
        `Identify the most important skill for ${targetRole}.`,
        "Start one realistic portfolio project.",
        `Create a weekly practice plan around your ${time}.`,
        "Collect feedback and improve your work.",
      ],
    };
  }

  // ======================================================
  // GENERAL FALLBACK
  // ======================================================

  return {
    careerOverview,

    skillAssessment: {
      existingStrengths: skillList,

      skillGaps: [
        `Role-specific competencies required for ${targetRole}`,
        "Practical experience",
        "Professional communication",
        "Problem solving",
        "Career-specific knowledge",
      ],

      prioritySkills: [
        `Core skills relevant to ${targetRole}`,
        "Practical application",
        "Communication",
        "Problem solving",
        "Professional development",
      ],
    },

    roadmap: [
      {
        phase: 1,
        title: "Foundation & Gap Analysis",
        duration: "4-6 weeks",

        objective:
          `Understand ${targetRole} requirements and identify the most important gaps from your current position.`,

        skills: [
          `Core ${careerField} knowledge`,
          `${targetRole} fundamentals`,
          "Problem solving",
        ],

        learningActions: [
          `Research the core requirements of ${targetRole}.`,
          "Compare requirements with your existing skills.",
          `Use your available ${time} consistently.`,
        ],

        practicalExperience: [
          "Complete practical exercises relevant to the career.",
        ],

        milestones: [
          "Major skill gaps identified.",
          "Weekly development routine established.",
        ],
      },

      {
        phase: 2,
        title: "Practical Skill Development",
        duration: "6-10 weeks",

        objective:
          `Develop practical abilities required for ${targetRole}.`,

        skills: [
          "Role-specific skills",
          "Problem solving",
          "Professional communication",
          "Practical execution",
        ],

        learningActions: [
          `Practice skills directly relevant to ${targetRole}.`,
          "Study realistic professional scenarios.",
          "Apply learning through practical work.",
        ],

        practicalExperience: [
          "Complete projects, case studies, simulations or supervised activities appropriate to your field.",
        ],

        milestones: [
          "Relevant practical evidence developed.",
        ],
      },

      {
        phase: 3,
        title: "Experience & Professional Profile",
        duration: "6-12 weeks",

        objective:
          "Turn developing skills into credible professional evidence.",

        skills: [
          "Professional communication",
          "Presentation",
          "Teamwork",
          "Career-specific execution",
        ],

        learningActions: [
          "Seek feedback from experienced professionals.",
          "Improve work based on feedback.",
        ],

        practicalExperience: [
          "Seek internships, volunteering, freelance work, project work or supervised experience where appropriate.",
        ],

        milestones: [
          "Relevant experience documented.",
          "Professional profile improved.",
        ],
      },

      {
        phase: 4,
        title: "Career Launch",
        duration: "Ongoing",

        objective:
          `Prepare for opportunities leading toward ${targetRole}.`,

        skills: [
          "Job searching",
          "Networking",
          "Interviewing",
          "Professional communication",
        ],

        learningActions: [
          "Review real job descriptions.",
          "Identify recurring employer requirements.",
          "Continue closing skill gaps.",
        ],

        practicalExperience: [
          "Apply for appropriate internships, trainee roles, junior positions or projects.",
        ],

        milestones: [
          "Resume and profile completed.",
          "Targeted applications underway.",
          "Networking routine established.",
        ],
      },
    ],

    learningPlan: {
      coreTopics: [
        `Core ${careerField} knowledge`,
        `${targetRole}-specific competencies`,
        "Professional communication",
        "Problem solving",
        "Practical experience",
      ],

      recommendedLearningMethods: [
        preferredLearning || "Mixed / Combination",
        "Hands-on practice",
        "Case studies",
        "Projects",
        "Professional feedback",
      ],

      practiceStrategy:
        `Use your ${time} consistently and divide your time between learning, practical application and career preparation.`,
    },

    projectsAndExperience: [
      {
        title: `${targetRole} Practical Project`,

        description:
          `Complete a realistic project demonstrating skills directly relevant to ${targetRole}.`,

        difficulty: "Intermediate",

        skillsDeveloped: [
          "Role-specific knowledge",
          "Problem solving",
          "Planning",
          "Communication",
        ],

        outcome:
          "Practical evidence of developing professional capability.",
      },

      {
        title: "Real-World Case Study",

        description:
          `Analyze a realistic problem related to ${careerField} and develop a structured solution.`,

        difficulty: "Intermediate",

        skillsDeveloped: [
          "Research",
          "Analysis",
          "Decision making",
          "Professional communication",
        ],

        outcome:
          "A documented example of practical thinking.",
      },
    ],

    certifications: [],

    careerPreparation: {
      portfolio: [
        `Collect practical work relevant to ${targetRole}.`,
        "Show the problem, approach and outcome.",
      ],

      resume: [
        `Tailor your resume toward ${targetRole}.`,
        "Highlight relevant education, skills and achievements.",
        "Include practical work where appropriate.",
      ],

      interviewPreparation: [
        "Practice role-specific questions.",
        "Prepare real examples of problem solving.",
        "Practice communicating your strengths clearly.",
      ],

      networking: [
        `Connect with professionals in ${careerField}.`,
        "Join relevant professional communities.",
        "Seek mentorship where appropriate.",
      ],

      jobSearchStrategy: [
        `Search for ${targetRole} and closely related roles.`,
        "Consider internships and entry-level opportunities.",
        "Track applications and feedback.",
      ],
    },

    milestones: [
      {
        milestone: "Career requirements mapped",
        expectedOutcome:
          `You understand what ${targetRole} requires and which gaps you need to close.`,
        timeframe: "First month",
      },

      {
        milestone: "Practical skills developed",
        expectedOutcome:
          "Relevant practical ability demonstrated.",
        timeframe: "2-4 months",
      },

      {
        milestone: "Professional profile ready",
        expectedOutcome:
          "Resume, evidence of work and interview preparation completed.",
        timeframe: "3-5 months",
      },

      {
        milestone: "Career transition active",
        expectedOutcome:
          "Applications, networking and continued development underway.",
        timeframe: "4+ months",
      },
    ],

    nextSteps: [
      `Research the requirements for ${targetRole}.`,
      "Compare requirements with your current skills.",
      "Choose the highest-priority skill gap.",
      `Create a weekly plan around your ${time}.`,
      "Start one practical project.",
      "Update your professional profile as you progress.",
    ],
  };
}

// ========================================================
// EXTRACT OPENAI RESPONSE TEXT
// ========================================================

function extractOpenAIText(data) {
  if (
    data &&
    typeof data.output_text === "string"
  ) {
    return data.output_text;
  }

  let text = "";

  if (data && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (Array.isArray(item.content)) {
        for (const content of item.content) {
          if (typeof content.text === "string") {
            text += content.text;
          }
        }
      }
    }
  }

  return text;
}

// ========================================================
// CLEAN JSON RESPONSE
// ========================================================

function cleanJSON(text) {
  return cleanString(text)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// ========================================================
// VALIDATE AI ROADMAP
// ========================================================

function isValidRoadmap(roadmap) {
  if (
    !roadmap ||
    typeof roadmap !== "object"
  ) {
    return false;
  }

  if (
    !roadmap.careerOverview ||
    typeof roadmap.careerOverview !== "object"
  ) {
    return false;
  }

  if (
    !roadmap.skillAssessment ||
    typeof roadmap.skillAssessment !== "object"
  ) {
    return false;
  }

  if (
    !Array.isArray(roadmap.roadmap)
  ) {
    return false;
  }

  if (
    !roadmap.learningPlan ||
    typeof roadmap.learningPlan !== "object"
  ) {
    return false;
  }

  if (
    !Array.isArray(
      roadmap.projectsAndExperience
    )
  ) {
    return false;
  }

  if (
    !roadmap.careerPreparation ||
    typeof roadmap.careerPreparation !== "object"
  ) {
    return false;
  }

  if (
    !Array.isArray(roadmap.milestones)
  ) {
    return false;
  }

  if (
    !Array.isArray(roadmap.nextSteps)
  ) {
    return false;
  }

  return true;
}

// ========================================================
// POST /api/career-roadmap/generate
// ========================================================

router.post("/generate", async (req, res) => {
  try {
    const body = req.body || {};

    // ======================================================
    // GET & NORMALIZE USER DATA
    // ======================================================

    const careerField =
      cleanString(body.careerField);

    const targetRole =
      cleanString(body.targetRole);

    const currentLevel =
      cleanString(body.currentLevel);

    const education =
      cleanString(body.education);

    const experience =
      cleanString(body.experience);

    const skills =
      cleanArray(body.skills);

    const interests =
      cleanArray(body.interests);

    const careerGoal =
      cleanString(body.careerGoal);

    const weeklyHours =
      cleanString(body.weeklyHours);

    const preferredLearning =
      cleanString(body.preferredLearning);

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!careerField) {
      return res.status(400).json({
        success: false,
        message: "Career field is required.",
      });
    }

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message:
          "Target career or job role is required.",
      });
    }

    if (!currentLevel) {
      return res.status(400).json({
        success: false,
        message:
          "Current career level is required.",
      });
    }

    if (!education) {
      return res.status(400).json({
        success: false,
        message: "Education is required.",
      });
    }

    if (skills.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one current skill is required.",
      });
    }

    // ======================================================
    // PROFILE
    // ======================================================

    const profile = {
      careerField,
      targetRole,
      currentLevel,
      education,
      experience,
      skills,
      interests,
      careerGoal,
      weeklyHours,
      preferredLearning,
    };

    // ======================================================
    // FALLBACK RESPONSE
    // ======================================================

    function returnFallback(reason) {
      console.warn(
        `Career Roadmap fallback used: ${reason}`
      );

      const roadmap =
        buildFallbackRoadmap(profile);

      return res.status(200).json({
        success: true,

        message:
          "Career roadmap generated successfully.",

        source: "fallback",

        roadmap,
      });
    }

    // ======================================================
    // NO API KEY
    //
    // DO NOT BLOCK THE FEATURE.
    // ======================================================

    if (!process.env.OPENAI_API_KEY) {
      return returnFallback(
        "OPENAI_API_KEY is missing"
      );
    }

    // ======================================================
    // SYSTEM PROMPT
    // ======================================================

    const systemPrompt = `
You are CareerPilot AI, a professional career-planning assistant.

Create a highly personalized, realistic and actionable career roadmap.

RULES:

1. Never assume the user is pursuing technology.
2. Support legitimate careers from all professional fields.
3. Never force programming or technical skills into unrelated careers.
4. Use the user's actual education, experience, skills, interests,
   career goal, current level and available time.
5. Identify realistic skill gaps.
6. Identify existing strengths.
7. Prioritize the most important skills.
8. Recommend practical learning activities.
9. Recommend realistic projects and experience.
10. Recommend certifications only when genuinely relevant.
11. Never invent fake companies, courses, licenses, certifications
    or credentials.
12. Never invent facts about the user.
13. Never promise employment.
14. Never guarantee salary.
15. Regulated professions may require formal education, exams,
    supervised practice, registration or licensing.
16. Clearly explain that regulatory requirements can depend on
    country or jurisdiction.
17. Creative careers should emphasize portfolios and practical work.
18. Business careers should emphasize projects, measurable results,
    internships and professional experience.
19. Skilled trades should consider apprenticeship or supervised work.
20. Academic careers should consider research, postgraduate study,
    publications and teaching where relevant.
21. Entrepreneurship should include validation, market research,
    business fundamentals and execution.
22. Technology careers should include technical skills only when
    genuinely relevant.
23. Make the roadmap achievable within the user's available time.
24. Start from the user's current position.
25. Make milestones measurable and realistic.
26. Avoid generic filler.
27. Return ONLY valid JSON.
`;

    // ======================================================
    // USER PROMPT
    // ======================================================

    const userPrompt = `
Create a personalized career roadmap for this user.

CAREER FIELD:
${careerField}

TARGET ROLE:
${targetRole}

CURRENT LEVEL:
${currentLevel}

EDUCATION:
${education}

EXPERIENCE:
${experience || "No experience provided"}

CURRENT SKILLS:
${skills.join(", ")}

INTERESTS:
${
  interests.length
    ? interests.join(", ")
    : "No specific interests provided"
}

LONG-TERM CAREER GOAL:
${careerGoal || "Not specified"}

AVAILABLE TIME PER WEEK:
${weeklyHours || "Not specified"}

PREFERRED LEARNING STYLE:
${preferredLearning || "Mixed / Combination"}

Create a progression from the user's current position toward
the target role.

Return EXACTLY this JSON structure:

{
  "careerOverview": {
    "targetRole": "",
    "field": "",
    "startingPoint": "",
    "careerDirection": ""
  },

  "skillAssessment": {
    "existingStrengths": [],
    "skillGaps": [],
    "prioritySkills": []
  },

  "roadmap": [
    {
      "phase": 1,
      "title": "",
      "duration": "",
      "objective": "",
      "skills": [],
      "learningActions": [],
      "practicalExperience": [],
      "milestones": []
    }
  ],

  "learningPlan": {
    "coreTopics": [],
    "recommendedLearningMethods": [],
    "practiceStrategy": ""
  },

  "projectsAndExperience": [
    {
      "title": "",
      "description": "",
      "difficulty": "",
      "skillsDeveloped": [],
      "outcome": ""
    }
  ],

  "certifications": [
    {
      "name": "",
      "reason": "",
      "importance": ""
    }
  ],

  "careerPreparation": {
    "portfolio": [],
    "resume": [],
    "interviewPreparation": [],
    "networking": [],
    "jobSearchStrategy": []
  },

  "milestones": [
    {
      "milestone": "",
      "expectedOutcome": "",
      "timeframe": ""
    }
  ],

  "nextSteps": []
}

Make the roadmap specifically relevant to the selected career.
Do not return markdown.
Do not return explanations outside the JSON.
`;

    // ======================================================
    // OPENAI REQUEST
    // ======================================================

    let openAIResponse;

    try {
      openAIResponse = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${process.env.OPENAI_API_KEY}`,
          },

          body: JSON.stringify({
            model:
              process.env.OPENAI_MODEL ||
              "gpt-4.1-mini",

            input: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
          }),
        }
      );
    } catch (networkError) {
      console.error(
        "OpenAI network error:",
        networkError
      );

      return returnFallback(
        "OpenAI network request failed"
      );
    }

    // ======================================================
    // OPENAI ERROR
    //
    // Includes:
    // - insufficient credits
    // - billing problems
    // - invalid API key
    // - rate limits
    // - temporary OpenAI errors
    // ======================================================

    if (!openAIResponse.ok) {
      let errorText = "";

      try {
        errorText =
          await openAIResponse.text();
      } catch (readError) {
        errorText = "";
      }

      console.error(
        "OpenAI API error:",
        openAIResponse.status,
        errorText
      );

      return returnFallback(
        `OpenAI HTTP ${openAIResponse.status}`
      );
    }

    // ======================================================
    // READ OPENAI RESPONSE
    // ======================================================

    let aiData;

    try {
      aiData =
        await openAIResponse.json();
    } catch (jsonError) {
      console.error(
        "OpenAI JSON parsing error:",
        jsonError
      );

      return returnFallback(
        "Invalid OpenAI response"
      );
    }

    // ======================================================
    // EXTRACT TEXT
    // ======================================================

    const aiText =
      extractOpenAIText(aiData);

    if (!aiText.trim()) {
      console.error(
        "OpenAI returned empty output:",
        aiData
      );

      return returnFallback(
        "OpenAI returned empty output"
      );
    }

    // ======================================================
    // CLEAN JSON
    // ======================================================

    const cleanedText =
      cleanJSON(aiText);

    // ======================================================
    // PARSE ROADMAP
    // ======================================================

    let roadmap;

    try {
      roadmap =
        JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "OpenAI roadmap JSON parse error:",
        parseError
      );

      console.error(
        "OpenAI output:",
        aiText
      );

      return returnFallback(
        "OpenAI returned invalid JSON"
      );
    }

    // ======================================================
    // STRUCTURE VALIDATION
    // ======================================================

    if (!isValidRoadmap(roadmap)) {
      console.error(
        "OpenAI returned incomplete roadmap structure."
      );

      return returnFallback(
        "Invalid roadmap structure"
      );
    }

    // ======================================================
    // PREMIUM OPENAI RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,

      message:
        "Career roadmap generated successfully.",

      source: "openai",

      roadmap,
    });
  } catch (error) {
    // ======================================================
    // LAST-RESORT ERROR HANDLING
    // ======================================================

    console.error(
      "Career Roadmap unexpected error:",
      error
    );

    try {
      const body = req.body || {};

      const emergencyProfile = {
        careerField:
          cleanString(body.careerField),

        targetRole:
          cleanString(body.targetRole),

        currentLevel:
          cleanString(body.currentLevel),

        education:
          cleanString(body.education),

        experience:
          cleanString(body.experience),

        skills:
          cleanArray(body.skills),

        interests:
          cleanArray(body.interests),

        careerGoal:
          cleanString(body.careerGoal),

        weeklyHours:
          cleanString(body.weeklyHours),

        preferredLearning:
          cleanString(body.preferredLearning),
      };

      if (
        !emergencyProfile.careerField ||
        !emergencyProfile.targetRole ||
        !emergencyProfile.currentLevel ||
        !emergencyProfile.education ||
        emergencyProfile.skills.length === 0
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Unable to generate career roadmap. Please check your information and try again.",
        });
      }

      const roadmap =
        buildFallbackRoadmap(
          emergencyProfile
        );

      return res.status(200).json({
        success: true,

        message:
          "Career roadmap generated successfully.",

        source: "fallback",

        roadmap,
      });
    } catch (fallbackError) {
      console.error(
        "Career Roadmap fallback error:",
        fallbackError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to generate career roadmap at this time.",
      });
    }
  }
});

module.exports = router;