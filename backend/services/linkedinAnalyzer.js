// ==========================================
// LINKEDIN PROFILE ANALYZER
// Real user-provided profile data only
// No hardcoded profile information
// ==========================================

function cleanText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return {
          ...item,
          title: cleanText(item.title),
          company: cleanText(item.company),
          description: cleanText(item.description),
        };
      }

      return "";
    })
    .filter(Boolean);
}

// ==========================================
// HEADLINE ANALYSIS
// ==========================================

function analyzeHeadline(headline) {
  const text = cleanText(headline);

  if (!text) {
    return {
      score: 0,
      status: "missing",
      suggestions: [
        "Add a clear professional headline.",
        "Mention your specialization, key skills, or the value you provide.",
        "Avoid using only a job title; make your professional positioning specific.",
      ],
    };
  }

  let score = 40;
  const suggestions = [];

  if (text.length >= 80) {
    score += 20;
  } else {
    suggestions.push(
      "Your headline is short. Add your specialization, key skills, or the type of value you provide."
    );
  }

  if (text.length >= 120) {
    score += 10;
  }

  const keywordIndicators = [
    "developer",
    "engineer",
    "designer",
    "manager",
    "analyst",
    "consultant",
    "student",
    "researcher",
    "specialist",
    "marketing",
    "finance",
    "accounting",
    "sales",
    "product",
    "data",
    "software",
    "ai",
    "machine learning",
    "business",
  ];

  const lower = text.toLowerCase();

  const hasProfessionalKeyword = keywordIndicators.some((keyword) =>
    lower.includes(keyword)
  );

  if (hasProfessionalKeyword) {
    score += 20;
  } else {
    suggestions.push(
      "Include a clear professional role or specialization in your headline."
    );
  }

  if (
    lower.includes("help") ||
    lower.includes("build") ||
    lower.includes("create") ||
    lower.includes("solve") ||
    lower.includes("deliver")
  ) {
    score += 10;
  } else {
    suggestions.push(
      "Consider explaining the value or outcome you provide."
    );
  }

  score = Math.min(score, 100);

  return {
    score,
    status: score >= 80 ? "strong" : score >= 60 ? "needs_improvement" : "weak",
    suggestions,
  };
}

// ==========================================
// ABOUT ANALYSIS
// ==========================================

function analyzeAbout(about) {
  const text = cleanText(about);

  if (!text) {
    return {
      score: 0,
      status: "missing",
      suggestions: [
        "Add an About section describing your professional background.",
        "Include your expertise, achievements, tools, and professional goals.",
      ],
    };
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let score = 20;
  const suggestions = [];

  if (wordCount >= 50) {
    score += 20;
  } else {
    suggestions.push(
      "Expand your About section to provide more professional context."
    );
  }

  if (wordCount >= 100) {
    score += 20;
  }

  if (wordCount >= 180) {
    score += 10;
  }

  const achievementWords = [
    "achieved",
    "improved",
    "increased",
    "reduced",
    "built",
    "developed",
    "created",
    "led",
    "managed",
    "delivered",
    "%",
  ];

  const lower = text.toLowerCase();

  const hasAchievement = achievementWords.some((word) =>
    lower.includes(word)
  );

  if (hasAchievement) {
    score += 15;
  } else {
    suggestions.push(
      "Add measurable achievements, projects, or outcomes where possible."
    );
  }

  const firstPerson =
    lower.includes("i ") ||
    lower.startsWith("i'm") ||
    lower.startsWith("i am");

  if (firstPerson) {
    score += 10;
  } else {
    suggestions.push(
      "Use a natural first-person professional voice to make the About section more personal."
    );
  }

  if (
    lower.includes("skills") ||
    lower.includes("experience") ||
    lower.includes("expert")
  ) {
    score += 5;
  } else {
    suggestions.push(
      "Mention your strongest areas of expertise and professional skills."
    );
  }

  score = Math.min(score, 100);

  return {
    score,
    status: score >= 80 ? "strong" : score >= 60 ? "needs_improvement" : "weak",
    wordCount,
    suggestions,
  };
}

// ==========================================
// SKILLS ANALYSIS
// ==========================================

function analyzeSkills(skills) {
  const normalizedSkills = normalizeArray(skills);

  const count = normalizedSkills.length;
  const suggestions = [];

  let score = 0;

  if (count === 0) {
    return {
      score: 0,
      count: 0,
      skills: [],
      suggestions: [
        "Add relevant technical, professional, and industry-specific skills.",
        "Prioritize skills that match the type of roles you want to pursue.",
      ],
    };
  }

  if (count >= 3) score += 30;
  if (count >= 5) score += 20;
  if (count >= 8) score += 20;
  if (count >= 12) score += 15;

  const skillNames = normalizedSkills
    .map((skill) =>
      typeof skill === "string"
        ? skill.toLowerCase()
        : cleanText(skill.name || "").toLowerCase()
    )
    .filter(Boolean);

  const hasTechnicalSkill = skillNames.some((skill) =>
    [
      "javascript",
      "typescript",
      "react",
      "node",
      "python",
      "java",
      "c++",
      "sql",
      "html",
      "css",
      "aws",
      "azure",
      "docker",
      "git",
      "figma",
      "excel",
      "power bi",
      "tableau",
    ].includes(skill)
  );

  if (hasTechnicalSkill) {
    score += 15;
  }

  if (count < 5) {
    suggestions.push(
      "Add more relevant skills to give recruiters a clearer picture of your capabilities."
    );
  }

  if (count > 20) {
    suggestions.push(
      "Prioritize your strongest and most relevant skills instead of listing too many."
    );
  }

  if (!hasTechnicalSkill) {
    suggestions.push(
      "Make sure your profile includes field-specific skills relevant to your target roles."
    );
  }

  return {
    score: Math.min(score, 100),
    count,
    skills: normalizedSkills,
    suggestions,
  };
}

// ==========================================
// EXPERIENCE ANALYSIS
// ==========================================

function analyzeExperience(experience) {
  const items = normalizeArray(experience);

  if (items.length === 0) {
    return {
      score: 0,
      count: 0,
      suggestions: [
        "Add your professional, internship, freelance, volunteer, or project experience.",
        "Describe responsibilities and measurable outcomes for each experience.",
      ],
    };
  }

  let score = 40;
  const suggestions = [];

  items.forEach((item) => {
    if (typeof item !== "object") return;

    const title = cleanText(item.title);
    const company = cleanText(item.company);
    const description = cleanText(item.description);

    if (title) score += 5;
    if (company) score += 5;

    if (!description) {
      suggestions.push(
        `Add a description for ${title || "your experience entry"}.`
      );
    } else if (description.length < 80) {
      suggestions.push(
        `Expand the description for ${title || "this experience"} with responsibilities and outcomes.`
      );
    }
  });

  const hasAchievement = items.some((item) => {
    if (!item || typeof item !== "object") return false;

    const description = cleanText(item.description).toLowerCase();

    return [
      "improved",
      "increased",
      "reduced",
      "built",
      "developed",
      "created",
      "led",
      "managed",
      "delivered",
      "%",
    ].some((word) => description.includes(word));
  });

  if (hasAchievement) {
    score += 25;
  } else {
    suggestions.push(
      "Use measurable achievements and outcomes instead of only listing responsibilities."
    );
  }

  return {
    score: Math.min(score, 100),
    count: items.length,
    suggestions: [...new Set(suggestions)],
  };
}

// ==========================================
// EDUCATION ANALYSIS
// ==========================================

function analyzeEducation(education) {
  const items = normalizeArray(education);

  if (items.length === 0) {
    return {
      score: 0,
      count: 0,
      suggestions: [
        "Add your education information to improve profile completeness.",
      ],
    };
  }

  const validEntries = items.filter(
    (item) =>
      typeof item === "object" &&
      (item.school || item.degree || item.field)
  );

  let score = validEntries.length > 0 ? 80 : 30;

  const suggestions = [];

  if (validEntries.length < items.length) {
    suggestions.push(
      "Complete missing education details such as institution, degree, or field of study."
    );
  }

  if (score > 100) score = 100;

  return {
    score,
    count: items.length,
    suggestions,
  };
}

// ==========================================
// CERTIFICATIONS ANALYSIS
// ==========================================

function analyzeCertifications(certifications) {
  const items = normalizeArray(certifications);

  if (items.length === 0) {
    return {
      score: 50,
      count: 0,
      suggestions: [
        "Add relevant certifications if you have them.",
        "Prioritize certifications related to your target field.",
      ],
    };
  }

  return {
    score: 100,
    count: items.length,
    suggestions: [],
  };
}

// ==========================================
// PROJECTS ANALYSIS
// ==========================================

function analyzeProjects(projects) {
  const items = normalizeArray(projects);

  if (items.length === 0) {
    return {
      score: 0,
      count: 0,
      suggestions: [
        "Add relevant projects to demonstrate practical experience.",
        "Include project outcomes, technologies, responsibilities, or measurable results.",
      ],
    };
  }

  let score = Math.min(items.length * 25, 100);

  const suggestions = [];

  items.forEach((project) => {
    if (
      project &&
      typeof project === "object" &&
      !cleanText(project.description)
    ) {
      suggestions.push(
        `Add a description for ${cleanText(project.name) || "your project"}.`
      );
    }
  });

  return {
    score,
    count: items.length,
    suggestions: [...new Set(suggestions)],
  };
}

// ==========================================
// MAIN ANALYZER
// ==========================================

function analyzeLinkedInProfile(profile = {}) {
  const headline = cleanText(profile.headline);
  const about = cleanText(profile.about);

  const skills = normalizeArray(profile.skills);
  const experience = normalizeArray(profile.experience);
  const education = normalizeArray(profile.education);
  const certifications = normalizeArray(profile.certifications);
  const projects = normalizeArray(profile.projects);

  const headlineAnalysis = analyzeHeadline(headline);
  const aboutAnalysis = analyzeAbout(about);
  const skillsAnalysis = analyzeSkills(skills);
  const experienceAnalysis = analyzeExperience(experience);
  const educationAnalysis = analyzeEducation(education);
  const certificationsAnalysis =
    analyzeCertifications(certifications);
  const projectsAnalysis = analyzeProjects(projects);

  // ==========================================
  // PROFILE SCORE
  // ==========================================

  const profileScore = Math.round(
    headlineAnalysis.score * 0.2 +
      aboutAnalysis.score * 0.2 +
      skillsAnalysis.score * 0.15 +
      experienceAnalysis.score * 0.2 +
      educationAnalysis.score * 0.1 +
      certificationsAnalysis.score * 0.05 +
      projectsAnalysis.score * 0.1
  );

  // ==========================================
  // COMPLETENESS
  // ==========================================

  const completenessFields = [
    headline,
    about,
    skills.length > 0,
    experience.length > 0,
    education.length > 0,
    certifications.length > 0,
    projects.length > 0,
  ];

  const completedFields = completenessFields.filter(Boolean).length;

  const completenessScore = Math.round(
    (completedFields / completenessFields.length) * 100
  );

  // ==========================================
  // FIELD-SPECIFIC SUGGESTIONS
  // ==========================================

  const suggestions = [
    ...headlineAnalysis.suggestions,
    ...aboutAnalysis.suggestions,
    ...skillsAnalysis.suggestions,
    ...experienceAnalysis.suggestions,
    ...educationAnalysis.suggestions,
    ...certificationsAnalysis.suggestions,
    ...projectsAnalysis.suggestions,
  ].filter(Boolean);

  return {
    profileScore,
    completenessScore,

    sections: {
      headline: {
        score: headlineAnalysis.score,
        suggestions: headlineAnalysis.suggestions,
      },

      about: {
        score: aboutAnalysis.score,
        wordCount: aboutAnalysis.wordCount || 0,
        suggestions: aboutAnalysis.suggestions,
      },

      skills: {
        score: skillsAnalysis.score,
        count: skillsAnalysis.count,
        suggestions: skillsAnalysis.suggestions,
      },

      experience: {
        score: experienceAnalysis.score,
        count: experienceAnalysis.count,
        suggestions: experienceAnalysis.suggestions,
      },

      education: {
        score: educationAnalysis.score,
        count: educationAnalysis.count,
        suggestions: educationAnalysis.suggestions,
      },

      certifications: {
        score: certificationsAnalysis.score,
        count: certificationsAnalysis.count,
        suggestions: certificationsAnalysis.suggestions,
      },

      projects: {
        score: projectsAnalysis.score,
        count: projectsAnalysis.count,
        suggestions: projectsAnalysis.suggestions,
      },
    },

    suggestions: [...new Set(suggestions)],

    analyzedAt: new Date().toISOString(),
  };
}

module.exports = {
  analyzeLinkedInProfile,
};