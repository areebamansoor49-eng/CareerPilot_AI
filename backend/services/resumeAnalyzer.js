function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(items) {
  return [...new Set(items)];
}

function extractSkills(text) {
  const normalized = normalizeText(text);

  const skillList = [
    "javascript",
    "typescript",
    "react",
    "node.js",
    "node js",
    "express",
    "python",
    "java",
    "c",
    "c++",
    ".net",
    "html",
    "css",
    "sql",
    "mysql",
    "mongodb",
    "git",
    "github",
    "docker",
    "aws",
    "data structures",
    "object oriented programming",
    "oop",
    "ms excel",
    "ms office",
    "canva",
    "seo",
    "meta ads",
    "affiliate marketing",
    "content creation",
    "responsive design",
    "data entry",
    "record management",
    "communication",
    "problem solving",
    "team collaboration",
    "time management",
  ];

  return unique(
    skillList
      .filter((skill) =>
        normalized.includes(skill.toLowerCase())
      )
      .map((skill) => skill)
  );
}

function extractSections(text) {
  const normalized = text.toLowerCase();

  return {
    summary:
      normalized.includes("professional summary") ||
      normalized.includes("summary"),

    education:
      normalized.includes("education"),

    experience:
      normalized.includes("experience"),

    skills:
      normalized.includes("technical skills") ||
      normalized.includes("skills"),

    certifications:
      normalized.includes("certifications") ||
      normalized.includes("certification"),

    softSkills:
      normalized.includes("soft skills"),
  };
}

function calculateWordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function calculateATSScore({
  text,
  skills,
  sections,
  wordCount,
}) {
  let score = 0;

  // -----------------------------
  // Section completeness — 25
  // -----------------------------

  const sectionChecks = [
    sections.summary,
    sections.education,
    sections.experience,
    sections.skills,
    sections.certifications,
  ];

  const sectionScore =
    (sectionChecks.filter(Boolean).length /
      sectionChecks.length) *
    25;

  score += sectionScore;

  // -----------------------------
  // Skills coverage — 25
  // -----------------------------

  const skillScore = Math.min(
    (skills.length / 10) * 25,
    25
  );

  score += skillScore;

  // -----------------------------
  // Resume content — 20
  // -----------------------------

  let contentScore = 0;

  if (wordCount >= 250) contentScore += 5;
  if (wordCount >= 400) contentScore += 5;
  if (text.match(/\b\d{4}\b/g)) contentScore += 5;

  if (
    text.toLowerCase().includes("intern") ||
    text.toLowerCase().includes("experience")
  ) {
    contentScore += 5;
  }

  score += Math.min(contentScore, 20);

  // -----------------------------
  // Professional terminology — 15
  // -----------------------------

  const professionalTerms = [
    "develop",
    "developed",
    "managed",
    "created",
    "designed",
    "implemented",
    "maintained",
    "assisted",
    "analyzed",
    "experience",
    "project",
    "skills",
  ];

  const normalized = normalizeText(text);

  const foundTerms = professionalTerms.filter(
    (term) => normalized.includes(term)
  );

  score += Math.min(
    (foundTerms.length / 6) * 15,
    15
  );

  // -----------------------------
  // Basic ATS readability — 15
  // -----------------------------

  let readabilityScore = 0;

  if (text.length > 1000) readabilityScore += 5;

  if (
    !text.includes("☒") &&
    !text.includes("�")
  ) {
    readabilityScore += 5;
  }

  if (sections.summary && sections.experience) {
    readabilityScore += 5;
  }

  score += Math.min(readabilityScore, 15);

  return Math.round(Math.min(score, 100));
}

function generateSuggestions({
  text,
  skills,
  sections,
  wordCount,
}) {
  const suggestions = [];

  const normalized = normalizeText(text);

  if (!sections.summary) {
    suggestions.push(
      "Add a clear professional summary near the top of the resume."
    );
  }

  if (!sections.experience) {
    suggestions.push(
      "Add a dedicated Experience section with measurable responsibilities and achievements."
    );
  }

  if (!sections.skills) {
    suggestions.push(
      "Add a dedicated Technical Skills section using job-relevant keywords."
    );
  }

  if (skills.length < 8) {
    suggestions.push(
      "Increase relevant technical and job-specific skills where applicable."
    );
  }

  if (wordCount < 300) {
    suggestions.push(
      "Your resume contains relatively little text. Add relevant project achievements and measurable experience."
    );
  }

  if (
    !normalized.includes("github") &&
    !normalized.includes("portfolio")
  ) {
    suggestions.push(
      "Consider adding a professional GitHub or portfolio link if relevant to your target roles."
    );
  }

  if (
    !normalized.includes("project") &&
    !normalized.includes("projects")
  ) {
    suggestions.push(
      "Add relevant academic or personal projects with technologies and outcomes."
    );
  }

  if (
    !normalized.includes("achievement") &&
    !normalized.includes("achieved")
  ) {
    suggestions.push(
      "Use measurable achievements where possible instead of only listing responsibilities."
    );
  }

  return suggestions;
}

function analyzeResume(text, pages) {
  const cleanText = text.trim();

  const wordCount = calculateWordCount(cleanText);

  const skills = extractSkills(cleanText);

  const sections = extractSections(cleanText);

  const atsScore = calculateATSScore({
    text: cleanText,
    skills,
    sections,
    wordCount,
  });

  const suggestions = generateSuggestions({
    text: cleanText,
    skills,
    sections,
    wordCount,
  });

  return {
    atsScore,

    wordCount,

    pages,

    skills,

    keywords: skills,

    suggestions,

    sections: {
      summary: sections.summary,
      education: sections.education,
      experience: sections.experience,
      skills: sections.skills,
      certifications: sections.certifications,
      softSkills: sections.softSkills,
    },
  };
}

module.exports = {
  analyzeResume,
};