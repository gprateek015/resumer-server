import { serializedescription } from '../../index.js';

const addBeforeResumeText = () => {
  const beforeResumeText = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
	{#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
	\\item\\small{
    	{#1 #2 #3 #4 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
	\\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
  	\\textbf{#1} & \\textbf{\\small #2} \\\\
  	\\textit{\\small#3} & \\textit{\\small #4} \\\\
	\\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
	\\item
	\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
  	\\textit{\\small#1} & \\textit{\\small #2} \\\\
	\\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
	\\item
	\\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
  	\\small#1 & \\textbf{\\small}\\\\
	\\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
`;

  return beforeResumeText;
};

const addHeadingSection = ({
  name,
  city,
  state,
  phone,
  email,
  linkedin,
  github,
  portfolio,
  twitter
}) => {
  const heading = `\\begin{document}
  \\begin{center}
    {\\Huge \\scshape ${name}} \\\\ \\vspace{3pt}
    ${city}, ${state} \\\\ \\vspace{3pt}
    \\small \\raisebox{-0.1\\height}\\faPhone\\ ${phone} ~ \\href{mailto:${email}}{\\raisebox{-0.2\\height}\\faEnvelope\\ {${email}}} ~ ${
    linkedin
      ? `\\href{${linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\ {Linkedin}} ~`
      : ''
  }${
    github
      ? `\\href{${github}}{\\raisebox{-0.2\\height}\\faGithub\\ {Github}} ~`
      : ''
  }${
    twitter
      ? `\\href{${twitter}}{\\raisebox{-0.2\\height}\\faTwitter\\ {Twitter}} ~`
      : ''
  }${
    portfolio
      ? `\\href{${portfolio}}{\\raisebox{-0.2\\height}\\faGlobe\\ {Portfolio}} ~`
      : ''
  }
  \\end{center}
  `;
  return heading;
};

const addEducationSection = educations => {
  if (!educations?.length) return '';
  const addEducation = ({
    institute_name,
    start_year,
    end_year,
    education_type,
    scoring_type,
    score,
    maximum_score
  }) => {
    const education = `\\resumeSubheading
      {${institute_name}}{${start_year} - ${end_year}}
      {${education_type}}{${scoring_type} ${score}${
      scoring_type.toLowerCase() === 'percentage' ? '\\%' : `/${maximum_score}`
    }}
  `;
    return education;
  };

  let section = `%-----------EDUCATION-----------
  \\section{Education}
    \\resumeSubHeadingListStart`;

  educations.forEach(education => {
    section += addEducation(education);
  });

  section += `\\resumeSubHeadingListEnd`;

  return section;
};

const addExperienceSection = experiences => {
  if (!experiences?.length) return '';

  const addExperience = ({
    company_name,
    start_date,
    end_date,
    location,
    position,
    mode,
    description
  }) => {
    let experience = `\\resumeSubheading
    {${company_name}}{${start_date} - ${end_date || 'Present'}}
    {${position}}{${mode === 'remote' ? 'Remote' : location}}`;

    experience += '\\resumeItemListStart';

    description.forEach(point => {
      const serialisedPoint = serializedescription(point);
      experience += `\\resumeItem{${serialisedPoint}}`;
    });

    experience += '\\resumeItemListEnd';

    return experience;
  };

  let section = `\\section{Work Experience}
  \\resumeSubHeadingListStart`;

  experiences.forEach(experience => {
    section += addExperience(experience);
  });

  section += '\\resumeSubHeadingListEnd';

  return section;
};

const addProjectsSection = projects => {
  if (!projects?.length) return '';

  const addProject = ({
    description,
    code_url,
    live_url,
    video_url,
    name,
    skills_required
  }) => {
    let project = `\\resumeProjectHeading
    {\\textbf{${name}} $|$ \\emph{${skills_required.join(', ')}}  $|$ {\\href{${
      code_url || live_url || video_url
    }}{${code_url ? 'Code' : live_url ? 'Live' : 'Video'}}}}{}
    \\resumeItemListStart`;

    description.forEach(point => {
      const serialisedPoint = serializedescription(point);
      project += `\\resumeItem {${serialisedPoint}}`;
    });

    project += '\\resumeItemListEnd';

    return project;
  };

  let section = `\\section{Projects}
  \\resumeSubHeadingListStart`;

  projects.forEach(project => {
    section += addProject(project);
  });

  section += '\\resumeSubHeadingListEnd';

  return section;
};

const addSkillsSection = ({
  technical_skills,
  dev_tools,
  core_subjects,
  languages
}) => {
  if (
    !technical_skills?.length &&
    !dev_tools?.length &&
    !core_subjects?.length &&
    !languages?.length
  )
    return '';

  const addSkill = ({ name, skills }) => {
    return `\\textbf{${name}}{: ${skills.join(', ')}} \\\\`;
  };

  let section = `\n\\section{Technical Skills}
  \\begin{itemize}[leftmargin=0.15in, label={}]
   \\resumeItem{`;

  if (technical_skills?.length) {
    section += addSkill({ name: 'Skills', skills: technical_skills });
  }
  if (dev_tools?.length) {
    section += addSkill({ name: 'Development', skills: dev_tools });
  }
  if (core_subjects?.length) {
    section += addSkill({ name: 'Core Subjects', skills: core_subjects });
  }
  if (languages?.length) {
    section += addSkill({ name: 'Languages', skills: languages });
  }

  section += '}\n\\end{itemize}';

  return section;
};

const addProfileLinksSection = links => {
  if (!links?.length) return '';
  const addLink = ({ name, link }) => {
    return `{\\href{${link}}{${
      name[0].toUpperCase() + name.slice(1)
    }}}\n\\hspace{32pt}`;
  };

  let section = `\\section{Profile Links}
  \\begin{itemize}[leftmargin=0.4in, label={}]
  \\resumeItem{`;

  links.forEach(link => {
    section += addLink(link);
  });

  section += `}\\end{itemize}`;
  return section;
};

const addAchievementsSection = achievements => {
  if (!achievements?.length) return '';

  const addAchievement = achievement => {
    return `\\resumeItem {${serializedescription(achievement)}}`;
  };

  let section = `\\section{Achievements and Extra Curriculum }
  \\begin{itemize}[leftmargin=0.15in, label={}]
  \\item \\resumeItemListStart`;

  achievements.forEach(achievement => {
    section += addAchievement(achievement);
  });

  section += `\\resumeItemListEnd
  \\end{itemize}`;
  return section;
};

const template1 = ({
  name,
  city,
  state,
  phone,
  email,
  linkedin,
  github,
  portfolio,
  twitter,
  educations = [],
  experiences = [],
  projects = [],
  technical_skills = [],
  languages = ['English'],
  dev_tools = [],
  core_subjects = [],
  profile_links = [],
  achievements = []
}) => {
  let resume =
    addBeforeResumeText() +
    addHeadingSection({
      name,
      city,
      state,
      phone,
      email,
      linkedin,
      github,
      portfolio,
      twitter
    }) +
    addEducationSection(educations) +
    addExperienceSection(experiences) +
    addProjectsSection(projects) +
    addSkillsSection({
      technical_skills: technical_skills,
      dev_tools: dev_tools,
      core_subjects: core_subjects,
      languages: languages
    }) +
    addProfileLinksSection(profile_links) +
    addAchievementsSection(achievements);

  resume += '\n\\end{document}';
  return resume;
};
export default template1;
