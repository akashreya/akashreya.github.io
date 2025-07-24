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
      id: 33,
      createdAt: "2025-07-19T17:06:10.506309",
      updatedAt: "2025-07-23T14:17:58.300637",
      title: "Pokétopia",
      shortDescription:
        "A comprehensive Pokédex web app featuring detailed Pokémon information, evolution chains, and an interactive daily PokéGuess puzzle game where players guess Pokémon based on attribute feedback.",
      description:
        '\u003Csection class="modal-details"\u003E\n  \u003Cp\u003E\n    This application is a feature-rich Pokédex web app that combines comprehensive Pokémon data exploration with an engaging daily puzzle game. Users can:\n  \u003C/p\u003E\n  \n  \u003Cdiv class="modal-subdetails"\u003E\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E📘\u003C/span\u003E\n        Pokédex Features\n      \u003C/h3\u003E\n      \u003Cul \u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EBrowse and search a comprehensive collection of Pokémon from all regions\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EView detailed information for each Pokémon, including stats, types, abilities, region, and species\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EExplore evolution chains with visual diagrams and branching paths\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EFilter and sort Pokémon by type, rarity, height, weight, and more\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EExamine each Pokémon\'s full move list, including power, accuracy, learning method, and type\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E🎮\u003C/span\u003E\n        PokéGuess Game\n      \u003C/h3\u003E\n      \u003Cul \u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EPlay a daily puzzle game where you guess the mystery Pokémon in 6 attempts\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EChoose from three difficulty levels: Easy (Gen 1–3), Medium (Gen 1–6), or Hard (all generations)\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EReceive detailed feedback on 10 different attributes: types, generation, evolution stage, color, habitat, height, weight, and legendary/mythical status\u003C/span\u003E\n        \u003C/li\u003E\n    \n        \u003Cli \u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EShare your results with friends using an emoji-based spoiler-free format\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\u003C/section\u003E\n',
      githubUrl: "https://github.com/akashreya/pokedex",
      liveDemoUrl: "https://pokemon.akashreya.space/",
      projectType: "FRONTEND",
      technologies: [
        {
          id: 36,
          name: "PokeAPI",
          createdAt: "2025-07-19T19:42:16.565647",
        },
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-19T13:50:55.603574",
        },
      ],
      images: [
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Pokemon/mainPage.jpg",
          role: "GALLERY",
          orderIndex: 1,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Pokemon/gridview.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Pokemon/pokeguess.jpg",
          role: "PRIMARY",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Pokemon/listview.jpg",
          role: "GALLERY",
          orderIndex: 2,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Pokemon/detailsPage.jpg",
          role: "GALLERY",
          orderIndex: 0,
        },
      ],
    },
    {
      id: 49,
      createdAt: "2025-07-19T17:51:27.973587",
      updatedAt: "2025-07-23T13:36:17.455746",
      title: "Portfolio Template",
      shortDescription:
        "ProjectService is a full-stack app for showcasing software projects. It uses Spring Boot with JPA/Hibernate for the backend and React with Tailwind CSS for the frontend. Admin can securely manage content.",
      description:
        '\u003Csection class="modal-details"\u003E\n  \u003Cp\u003E\n    ProjectService is a comprehensive full-stack web application designed for portfolio management and technology showcase. Built with modern technologies and a clean architecture pattern, it offers a robust and scalable solution for developers.\n  \u003C/p\u003E\n\n  \u003Cdiv class="modal-subdetails"\u003E\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E🧩\u003C/span\u003E\n        Backend Architecture (Spring Boot)\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EFramework:\u003C/strong\u003E Spring Boot 3.4.4 with Java 21\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003ESecurity:\u003C/strong\u003E Spring Security (role-based access: ADMIN)\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EAPI Docs:\u003C/strong\u003E OpenAPI / Swagger integrated\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E⚛️\u003C/span\u003E\n        Frontend Architecture (React)\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EFramework:\u003C/strong\u003E React 19.1.0 with Vite\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EStyling:\u003C/strong\u003E Tailwind CSS 4.1.8\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EHTTP:\u003C/strong\u003E Axios for API requests\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E🧰\u003C/span\u003E\n        Frontend Features\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🚀\u003C/span\u003E\n          \u003Cspan\u003ETabbed interface for Projects and Technologies\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🔐\u003C/span\u003E\n          \u003Cspan\u003EJWT-based authentication with login modal\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E📱\u003C/span\u003E\n          \u003Cspan\u003EFully responsive UI with Tailwind\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\u003C/section\u003E',
      githubUrl: "https://github.com/akashreya/ProjectService",
      liveDemoUrl: "https://projects.akashreya.space/swagger-ui/index.html",
      projectType: "FULLSTACK",
      technologies: [
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-19T13:50:55.603574",
        },
        {
          id: 5,
          name: "REST API",
          createdAt: "2025-07-19T13:50:55.788029",
        },
        {
          id: 2,
          name: "Spring Boot",
          createdAt: "2025-07-19T13:50:55.763705",
        },
        {
          id: 6,
          name: "Github pages",
          createdAt: "2025-07-19T13:50:55.794077",
        },
      ],
      images: [
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Portfolio/landingpage.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Portfolio/newproject.jpg",
          role: "GALLERY",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://d156arw5z01kd3.cloudfront.net/Projects/Portfolio/admin-ui.jpg",
          role: "PRIMARY",
          orderIndex: 0,
        },
      ],
    },
    {
      id: 50,
      createdAt: "2025-07-19T18:32:09.236116",
      updatedAt: "2025-07-23T13:37:31.985879",
      title: "SITA Departure Control System (DCS)",
      shortDescription:
        "Developed SOAP-based passenger upgrade/regrade web services and UI development. \nImplemented core weight and balance algorithms for cargo distribution, integrating baggage, passenger, and hold position data to ensure aircraft center-of-gravity compliance and safe flight operations.",
      description:
        '\u003Csection class="modal-details"\u003E\n  \u003Cp\u003E\n    These modules were developed as part of mission-critical systems in large-scale airline operations, covering both passenger upgrades and aircraft load distribution for safety and compliance.\n  \u003C/p\u003E\n\n  \u003Cdiv class="modal-subdetails"\u003E\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E🛫\u003C/span\u003E\n        Check-in & Upgrade Flow\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E💺\u003C/span\u003E\n          \u003Cspan\u003EDesigned and implemented SOAP-based APIs for passenger upgrades (e.g., Economy → Business)\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🧠\u003C/span\u003E\n          \u003Cspan\u003EWorked with WSDL contracts and embedded business rules for real-time eligibility checks\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🖥️\u003C/span\u003E\n          \u003Cspan\u003EDeveloped UI screens tailored for overbooking, VIP upgrades, and gate-side seat reassignments\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E⚖️\u003C/span\u003E\n        Cargo Weight Distribution\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E📦\u003C/span\u003E\n          \u003Cspan\u003EDeveloped algorithms to compute cargo weights across hold compartments and enforce CG (center of gravity) rules\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🔗\u003C/span\u003E\n          \u003Cspan\u003EIntegrated passenger, baggage, and cargo data for accurate load computation\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🛠️\u003C/span\u003E\n          \u003Cspan\u003EHandled complex edge cases like cargo reshuffle and last-minute weight updates\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\u003C/section\u003E',
      githubUrl: "",
      liveDemoUrl:
        "https://www.sita.aero/globalassets/docs/use-cases/sita-local-dcs-use-case.pdf",
      projectType: "FULLSTACK",
      technologies: [
        {
          id: 34,
          name: "Java Swing",
          createdAt: "2025-07-19T18:38:35.02797",
        },
        {
          id: 33,
          name: "SOAP-WS",
          createdAt: "2025-07-19T18:38:17.739106",
        },
      ],
      images: [],
    },
    {
      id: 51,
      createdAt: "2025-07-19T18:45:02.701008",
      updatedAt: "2025-07-23T13:38:17.617115",
      title: "LSEG Robust Foundation API (RFA) - Java",
      shortDescription:
        "Implemented LSEG’s RFA Java-based market data integration, enabling real-time data subscriptions, processing, and distribution. Delivered high-throughput, low-latency performance with secure, resilient connection management tailored for financial systems.",
      description:
        '\u003Csection class="modal-details"\u003E\n  \u003Cp\u003E\n    This module focused on stabilizing and optimizing RFA–TREP integration for real-time market data delivery. Key responsibilities included protocol handling, performance tuning, and failover resilience in high-throughput environments.\n  \u003C/p\u003E\n\n  \u003Cdiv class="modal-subdetails"\u003E\n    \u003Cdiv\u003E\n      \u003Ch3\u003E\n        \u003Cspan class="mr-2"\u003E🖧\u003C/span\u003E\n        RFA Java Enhancements & Optimizations\n      \u003C/h3\u003E\n      \u003Cul\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🔧\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003ERevamped RFA–TREP connection handling\u003C/strong\u003E by fixing critical integration bugs and stabilizing subscription workflows\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🧠\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003ERewrote the encoding logic\u003C/strong\u003E to streamline OMM message processing and ensure cleaner downstream parsing\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E📦\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003ERedesigned the batch view logic\u003C/strong\u003E for efficient grouped instrument requests and optimized update distribution\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🔄\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EDebugged and stabilized reconnect flows\u003C/strong\u003E to improve resilience and reduce downtime in failover scenarios\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E📈\u003C/span\u003E\n          \u003Cspan\u003E\u003Cstrong\u003EFine-tuned the system for performance\u003C/strong\u003E in high-volume environments using lightweight threading and data-safe caching\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\u003C/section\u003E\n',
      githubUrl: "",
      liveDemoUrl:
        "https://developers.lseg.com/en/api-catalog/real-time/robust-foundation-api-rfa-java",
      projectType: "BACKEND",
      technologies: [
        {
          id: 3,
          name: "WebSocket",
          createdAt: "2025-07-19T13:50:55.770889",
        },
        {
          id: 35,
          name: "Java 17",
          createdAt: "2025-07-19T18:47:11.066471",
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
