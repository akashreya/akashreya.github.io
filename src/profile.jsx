import sideBarPhoto from "./assets/akash.png";
// Change display name on tha landing display
const homePage = {
  fullName: "Akash S Kantharaj",
  heroDetail:
    '"Trusted to deliver. Known for the details others miss. High standards."',
  heroTitle: "Java Engineer",
  location: "Bengaluru, IN",
};

const photos = {
  sideBarPhoto,
};

const experience = [
  {
    firm: { name: "Tech Mahindra", logo: "/techmahindra.png" },
    postion: "Team lead",
    location: "Bengaluru, India",
    date: "2016 - Present",
    details: [
      "Worked on designing various REST based event-driven microservices.",
      "Mentored junior developers, maintaining high coding standard sessions.",
      "Colloborated with cross-functional teams.",
      "Led development teams, optimizing performance and reduced tech debt.",
    ],
  },
  {
    firm: { name: "Infosys", logo: "/infosys.png" },
    postion: "Technology Analyst",
    location: "Bengaluru, India",
    date: "2014 - 2016",
    details: ["Developed and maintainted financial applications.", "SecDB."],
  },
  {
    firm: { name: "Mindtree", logo: "/mindtree.png" },
    postion: "Senior Software Engineer",
    location: "Bengaluru, India",
    date: "2011 - 2014",
    details: [
      "Implemented SOAP based Java web services.",
      "Integrated the webservices with Swing based Desktop application.",
    ],
  },
];
const about = {
  title: " The Human Behind the Screen",
  titleHighlight: ["Human"],
  aboutHeading: "Where Clarity meets Craftsmanship.",
  textOne:
    "With 13 years of experience in the tech industry, I've built a reputation for delivering high-quality work—precisely, efficiently, and without the need for follow-up. Raised to respect others and value time, I've always believed that how you work matters just as much as what you deliver.",
  textTwo:
    "I focus on the details others overlook and often understand what a client needs before they've finished explaining. I don't follow trends or chase attention. I care about clarity, quality, and doing things right—even when no one's watching.",
  textThree:
    "My goal is simple: to do meaningful work with people who value high standards and to build a life where my family leads a peacefull life. If that sounds like someone you'd want to work with—I'm here.",
};
// Edit your skill and the percentage you know about it
// To Add a skill, copy any one below and paste it after the last comma
const skillDetails = {
  title: "The Bug Blaster’s Armory",
  titleHighlight: ["Armory"],
  expertise: [
    {
      name: "Java",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
      category: "Programming Language",
    },
    {
      name: "Python",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      category: "Programming Language",
    },
    {
      name: "Bash",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",
      category: "Programming Language",
    },

    {
      name: "Spring Boot",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
      category: "Backend",
    },
    {
      name: "Hibernate",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hibernate/hibernate-original.svg",
      category: "Backend",
    },
    {
      name: "Junit",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/junit/junit-original-wordmark.svg",
      category: "Testing Tool",
    },
    {
      name: "Postman",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
      category: "Testing Tool",
    },
    {
      name: "Eclipse",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eclipse/eclipse-original.svg",
      category: "Dev Tool",
    },
    {
      name: "VS Code",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
      category: "Dev Tool",
    },
    {
      name: "PyCharm",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pycharm/pycharm-original.svg",
      category: "Dev Tool",
    },
    {
      name: "SQL Developer",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg",
      category: "Dev Tool",
    },
    {
      name: "Jenkins",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg",
      category: "CI/CD Tool",
    },
    {
      name: "Git",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      category: "Version Control",
    },
    {
      name: "GitLab",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg",
      category: "Version Control",
    },
    {
      name: "Maven",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-plain.svg",
      category: "Build Tool",
    },
    {
      name: "Gradle",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gradle/gradle-original.svg",
      category: "Build Tool",
    },
    {
      name: "Apache Kafka",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original-wordmark.svg",
      category: "Backend",
    },
    {
      name: "MySQL",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
      category: "Database",
    },
    {
      name: "Oracle DB",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg",
      category: "Database",
    },

    {
      name: "Microservices",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain.svg",
      category: "Backend",
    },
    {
      name: "React",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      category: "Frontend",
    },
    {
      name: "Tailwind CSS",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      category: "Frontend",
    },
    {
      name: "Windows",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
      category: "OS",
    },
    {
      name: "Linux",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
      category: "OS",
    },
    {
      name: "AWS",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      category: "DevOps",
    },
    {
      name: "Jira",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg",
      category: "Project Tools",
    },
    {
      name: "Confluence",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/confluence/confluence-original.svg",
      category: "Project Tools",
    },
  ],
};
const projectDetails = {
  title: "Marauder’s Map of Creations and Scrolls in the Making",
  titleHighlight: ["Creations", "Scrolls"],
  apiURL: "http://localhost:8080",
  projects: [
    {
      id: 1,
      createdAt: "2025-07-15T06:57:16.791505",
      updatedAt: "2025-07-15T06:57:16.791505",
      title: "Portfolio Website",
      shortDescription:
        "A personal portfolio built with React and hosted on GitHub Pages.",
      description: null,
      githubUrl: "https://github.com/user/portfolio",
      liveDemoUrl: "https://user.github.io/portfolio",
      projectType: "FULLSTACK",
      technologies: [
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-15T06:57:16.643273",
        },
        {
          id: 6,
          name: "Github pages",
          createdAt: "2025-07-15T06:57:16.786296",
        },
      ],
      images: [
        {
          imageKey: "projects/1/thumb.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          imageKey: "projects/1/main.jpg",
          role: "PRIMARY",
          orderIndex: 1,
        },
        {
          imageKey: "projects/1/gallery1.jpg",
          role: "GALLERY",
          orderIndex: 2,
        },
      ],
    },
    {
      id: 2,
      createdAt: "2025-07-15T06:57:16.813435",
      updatedAt: "2025-07-15T06:57:16.813435",
      title: "Task Manager API",
      shortDescription:
        "A personal portfolio built with React and hosted on GitHub Pages.",
      description: "",
      githubUrl: "https://github.com/user/task-manager",
      liveDemoUrl: null,
      projectType: "BACKEND",
      technologies: [
        {
          id: 4,
          name: "JWT",
          createdAt: "2025-07-15T06:57:16.770106",
        },
        {
          id: 2,
          name: "Spring Boot",
          createdAt: "2025-07-15T06:57:16.752031",
        },
        {
          id: 5,
          name: "REST API",
          createdAt: "2025-07-15T06:57:16.780007",
        },
      ],
      images: [],
    },
    {
      id: 3,
      createdAt: "2025-07-15T06:57:16.822063",
      updatedAt: "2025-07-15T06:57:16.822063",
      title: "ChatApp",
      shortDescription: "Real-time chat app using WebSocket.",
      description: null,
      githubUrl: "https://github.com/user/chat-app",
      liveDemoUrl: null,
      projectType: "FRONTEND",
      technologies: [
        {
          id: 3,
          name: "WebSocket",
          createdAt: "2025-07-15T06:57:16.762317",
        },
        {
          id: 2,
          name: "Spring Boot",
          createdAt: "2025-07-15T06:57:16.752031",
        },
      ],
      images: [],
    },
    {
      id: 4,
      createdAt: "2025-07-15T06:57:16.826468",
      updatedAt: "2025-07-15T06:57:16.826468",
      title: "AtoZ",
      shortDescription:
        "A fun A–Z app where toddlers explore Fruits, Animals, and more — one colorful image per letter!",
      description:
        "Toddler A–Z Explorer is a playful, educational web app designed to help young children learn about the world around them — one letter at a time. Kids can pick a category like Fruits, animals, or Vehicles, and explore the alphabet through fun, colorful images and simple names. Each letter presents a new surprise, randomly chosen from a curated list, making learning feel fresh and exciting every time. It’s chart-like, touch-friendly, and perfect for early learners",
      githubUrl: "https://github.com/akashreya/AtoZ",
      liveDemoUrl: null,
      projectType: "FRONTEND",
      technologies: [
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-15T06:57:16.643273",
        },
      ],
      images: [],
    },
  ],
};

const contact = {
  title: "Send Your Message by Owl",
  titleHighlight: ["Message"],
  linkedinURL: "https://www.linkedin.com/in/akash-kantharaj-68526a3a/",
  githubURL: "https://github.com/akashreya",
  emailID: "akashakashreya@gmail.com",
};

export {
  homePage,
  about,
  photos,
  experience,
  skillDetails,
  contact,
  projectDetails,
};
