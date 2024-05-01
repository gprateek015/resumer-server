import { serializeDescription } from '../../index.js';
const addBeforeResumeText = () => {
  const beforeResumeText = `\\documentclass[12pt]{article}
    \\usepackage[english]{babel}
    \\usepackage{cmbright}
    \\usepackage{enumitem}
    \\usepackage{fancyhdr}
    \\usepackage{fontawesome5}
    \\usepackage{geometry}
    \\usepackage{hyperref}
    \\usepackage[sf]{libertine}
    \\usepackage{microtype}
    \\usepackage{paracol}
    \\usepackage{supertabular}
    \\usepackage{titlesec}
    \\hypersetup{colorlinks, urlcolor=black, linkcolor=black}
    
    % Geometry
    \\geometry{hmargin=1.75cm, vmargin=2.5cm}
    \\columnratio{0.65, 0.35}
    \\setlength\\columnsep{0.05\\textwidth}
    \\setlength\\parindent{0pt}
    \\setlength{\\smallskipamount}{8pt plus 3pt minus 3pt}
    \\setlength{\\medskipamount}{16pt plus 6pt minus 6pt}
    \\setlength{\\bigskipamount}{24pt plus 8pt minus 8pt}
    
    % Style
    \\pagestyle{empty}
    \\titleformat{\\section}{\\scshape\\LARGE\\raggedright}{}{0em}{}[\\titlerule]
    \\titlespacing{\\section}{0pt}{\\bigskipamount}{\\smallskipamount}
    \\newcommand{\\heading}[2]{\\centering{\\sffamily\\Huge #1}\\\\\\smallskip{\\large{#2}}}
    \\newcommand{\\entry}[4]{{{\\textbf{#1}}} \\hfill #3 \\\\ #2 \\hfill #4}
    \\newcommand{\\tableentry}[3]{\\textsc{#1} & #2\\expandafter\\ifstrequal\\expandafter{#3}{}{\\\\}{\\\\[6pt]}}
    
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
  github
}) => {
  const heading = `\\begin{document}
    \\begin{paracol}{2}
    \\heading{${name}}{${city}, \\ ${state}}
    \\switchcolumn
      \\vspace{0.01\\textheight}
      \\begin{supertabular}{ll}
      \\footnotesize\\faPhone & ${phone} \\\\
      \\footnotesize\\faEnvelope & \\href{mailto:${email}}{${email}} \\\\
      \\footnotesize\\faLinkedin & \\href{${linkedin}}{Linkedin} \\\\
      \\footnotesize\\faGithub & \\href{${github}}{Github} \\\\
      \\end{supertabular}
      \\switchcolumn*
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
    const education = `\\entry
      {${institute_name}}{${education_type}}
      {${start_year} - ${end_year}}{${scoring_type} ${score}${
      scoring_type.toLowerCase() === 'percentage' ? '\\%' : `/${maximum_score}`
    }}
  `;

    return education;
  };

  let section = `%-----------EDUCATION-----------
  \\section{Education}`;

  educations.forEach(education => {
    section += addEducation(education);
  });
  section += `\n \\switchcolumn`;
  return section;
};

const addSkillsSection = ({
  technical_skills,
  dev_tools,
  core_subjects,
  languages
}) => {
  if (!technical_skills?.length && !dev_tools?.length && !languages?.length)
    return '';

  const addSkill = ({ name, skills }) => {
    let skillEntry = `\\tableentry{${name}}{: `;
    for (let ind = 0; ind < skills.length; ind += 3) {
      if (ind === 0) {
        skillEntry += `${skills[ind]} `;
      } else {
        skillEntry += `\\tableentry{}{\\textperiodcentered{} ${skills[ind]} `;
      }
      if (ind + 1 < skills.length) {
        skillEntry += `\\textperiodcentered{} ${skills[ind + 1]} `;
      }
      if (ind + 2 < skills.length) {
        skillEntry += `\\textperiodcentered{} ${skills[ind + 2]} `;
      }
      skillEntry += ' }\\\\ ';
    }
    return skillEntry;
  };

  let section = `\n\\section{Technical Skills}
  \\begin{supertabular}{ll}`;

  if (technical_skills?.length) {
    section += addSkill({ name: 'Skills', skills: technical_skills });
  }
  // if (dev_tools?.length) {
  //   section += addSkill({ name: 'Development', skills: dev_tools });
  // }
  if (languages?.length) {
    section += addSkill({ name: 'Programming Languages', skills: languages });
  }

  section += '\n \\end{supertabular} \n \\switchcolumn';

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
    let experience = `\\entry
    {${company_name}}{${position}}
    {${start_date} - ${end_date || 'Present'}}{${
      mode === 'remote' ? 'Remote' : location
    }}
`;
    experience +=
      '\\begin{itemize}[noitemsep,leftmargin=3.5mm,rightmargin=0mm,topsep=6pt]';

    description.forEach(point => {
      const serialisedPoint = serializeDescription(point);
      experience += `\\item{${serialisedPoint}}`;
    });

    experience += '\\end{itemize}';

    return experience;
  };

  let section = `\\section{Work Experience}`;

  experiences.forEach(experience => {
    section += addExperience(experience);
  });
  section += ` \n \\switchcolumn`;
  return section;
};

const addProfileLinksSection = links => {
  if (!links?.length) return '';
  let section = `\\section{Profile Links}
  \\begin{supertabular}{rl}`;

  for (let index = 0; index < links.length; index += 2) {
    const link1 = links[index];
    const link2 = links[index + 1];
    if (link1 && link2) {
      section += `\\tableentry{\\href{${link1.link}}{${
        link1.name[0].toUpperCase() + link1.name.slice(1)
      }}}{\\href{${link2.link}}{${
        link2.name[0].toUpperCase() + link2.name.slice(1)
      }}}{\n}\n\n`;
    } else {
      section += `\\tableentry{\\href{${link1.link}}{${
        link1.name[0].toUpperCase() + link1.name.slice(1)
      }}}{\n}\n\n`;
    }
  }

  section += `\\end{supertabular} \n \\switchcolumn`;

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
    let project = `
    {\\textbf{${name}} $|$ \\emph{${skills_required.join(', ')}}  $|$ {\\href{${
      code_url || live_url || video_url
    }}
    {${code_url ? 'Code' : live_url ? 'Live' : 'Video'}}}}{}
    \\begin{itemize}[noitemsep,leftmargin=3.5mm,rightmargin=0mm,topsep=6pt]`;

    description.forEach(point => {
      const serialisedPoint = serializeDescription(point);
      project += `\\item {${serialisedPoint}}`;
    });

    project += '\\end{itemize}';
    return project;
  };

  let section = `\\section{Projects}`;

  projects.forEach(project => {
    section += addProject(project);
  });
  section += `\n \\switchcolumn`;

  return section;
};
const addAchievementsSection = achievements => {
  if (!achievements?.length) return '';

  const addAchievement = achievement => {
    return `\\item {${serializeDescription(achievement)}}`;
  };

  let section = `\\section{Achievements }
  \\begin{itemize}[noitemsep,leftmargin=3.5mm,rightmargin=0mm,topsep=6pt]`;

  achievements.forEach(achievement => {
    section += addAchievement(achievement);
  });

  section += `\\end{itemize}`;
  return section;
};
const template2 = ({
  name,
  city,
  state,
  phone,
  email,
  linkedin,
  github,
  educations = [],
  technical_skills = [],
  languages = [],
  dev_tools = [],
  core_subjects = [],
  experiences = [],
  profile_links = [],
  projects = [],
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
      github
    }) +
    addEducationSection(educations) +
    addSkillsSection({
      technical_skills: technical_skills,
      dev_tools: dev_tools,
      languages: languages
    }) +
    addExperienceSection(experiences) +
    addProfileLinksSection(profile_links) +
    addProjectsSection(projects) +
    addAchievementsSection(achievements);

  resume += '\n\\end{paracol} \n\\end{document}';
  return resume;
};
export default template2;
