import sideBarPhoto from "./assets/akash.png";
// Change display name on tha landing display
const homePage = {
  fullName: "Akash S Kantharaj",
  heroDetail:
    '"Trusted to deliver. Known for the details others miss. High standards."',
  heroTitle: "Java Engineer",
};

const photos = {
  sideBarPhoto,
};

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
    },
    {
      name: "Python",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
      name: "Bash",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",
    },

    {
      name: "Spring Boot",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
    },
    {
      name: "Hibernate",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hibernate/hibernate-original.svg",
    },
    {
      name: "Junit",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/junit/junit-original-wordmark.svg",
    },
    {
      name: "Postman",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
    },
    {
      name: "Eclipse",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eclipse/eclipse-original.svg",
    },
    {
      name: "VS Code",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
    },
    {
      name: "PyCharm",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pycharm/pycharm-original.svg",
    },
    {
      name: "SQL Developer",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg",
    },
    {
      name: "Jenkins",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg",
    },
    {
      name: "Git",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    },
    {
      name: "GitLab",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg",
    },
    {
      name: "Maven",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-plain.svg",
    },
    {
      name: "Gradle",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gradle/gradle-original.svg",
    },
    {
      name: "Apache Kafka",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original-wordmark.svg",
    },
    {
      name: "MySQL",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    },
    {
      name: "Oracle DB",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg",
    },

    {
      name: "Microservices",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain.svg",
    },
    {
      name: "React",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      name: "Tailwind CSS",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
      name: "Windows",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
    },
    {
      name: "Linux",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
    },
    {
      name: "AWS",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
      name: "Jira",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg",
    },
    {
      name: "Confluence",
      imageURL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/confluence/confluence-original.svg",
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
      title: "Portfolio Website",
      description:
        "A personal portfolio built with React and hosted on GitHub Pages.",
      shortDescription: null,
      githubUrl: "https://github.com/user/portfolio",
      liveDemoUrl: "https://user.github.io/portfolio",
      technologies: [
        {
          id: 6,
          name: "Github pages",
        },
        {
          id: 1,
          name: "React",
        },
      ],
      images: [
        {
          id: 3,
          imageKey: "projects/1/main.jpg",
          role: "PRIMARY",
          orderIndex: 1,
        },
        {
          id: 2,
          imageKey: "projects/1/thumb.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          id: 1,
          imageKey: "projects/1/gallery1.jpg",
          role: "GALLERY",
          orderIndex: 2,
        },
      ],
      createdAt: "2025-06-01T22:11:03.156536",
      updatedAt: "2025-06-01T22:11:03.156536",
      type: "FULLSTACK",
    },
    {
      id: 2,
      title: "Task Manager API",
      description:
        "A personal portfolio built with React and hosted on GitHub Pages.",
      shortDescription: null,
      githubUrl: "https://github.com/user/task-manager",
      liveDemoUrl: null,
      technologies: [
        {
          id: 2,
          name: "Spring Boot",
        },
        {
          id: 4,
          name: "JWT",
        },
        {
          id: 5,
          name: "REST API",
        },
      ],
      images: [],
      createdAt: "2025-06-01T22:11:03.174168",
      updatedAt: "2025-06-01T22:11:03.174168",
      type: "BACKEND",
    },
    {
      id: 3,
      title: "ChatApp",
      description: "Real-time chat app using WebSocket.",
      shortDescription: null,
      githubUrl: "https://github.com/user/chat-app",
      liveDemoUrl: null,
      technologies: [
        {
          id: 2,
          name: "Spring Boot",
        },
        {
          id: 3,
          name: "WebSocket",
        },
      ],
      images: [],
      createdAt: "2025-06-01T22:11:03.180201",
      updatedAt: "2025-06-01T22:11:03.180201",
      type: "FRONTEND",
    },
    {
      id: 4,
      title: "AtoZ",
      description:
        "Toddler A–Z Explorer is a playful, educational web app designed to help young children learn about the world around them — one letter at a time. Kids can pick a category like Fruits, animals, or Vehicles, and explore the alphabet through fun, colorful images and simple names. Each letter presents a new surprise, randomly chosen from a curated list, making learning feel fresh and exciting every time. It’s chart-like, touch-friendly, and perfect for early learners",
      shortDescription:
        "A fun A–Z app where toddlers explore Fruits, Animals, and more — one colorful image per letter!",
      githubUrl: "https://github.com/akashreya/AtoZ",
      liveDemoUrl: null,
      technologies: [
        {
          id: 1,
          name: "React",
        },
      ],
      images: [],
      createdAt: "2025-06-01T22:11:03.185239",
      updatedAt: "2025-06-01T22:11:03.185239",
      type: "FRONTEND",
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

export { homePage, about, photos, skillDetails, contact, projectDetails };
