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
      updatedAt: "2025-07-19T17:25:31.753946",
      title: "Pokétopia",
      shortDescription:
        "A comprehensive Pokédex web app featuring detailed Pokémon information, evolution chains, and an interactive daily PokéGuess puzzle game where players guess Pokémon based on attribute feedback.",
      description:
        '\u003Csection\u003E\n  \u003Cp class="text-lg mb-8 leading-relaxed"\u003E\n    This application is a feature-rich Pokédex web app that combines comprehensive Pokémon data exploration with an engaging daily puzzle game. Users can:\n  \u003C/p\u003E\n  \n  \u003Cdiv class="space-y-8"\u003E\n    \u003Cdiv\u003E\n      \u003Ch3 class="text-2xl font-semibold mb-4 flex items-center"\u003E\n        \u003Cspan class="mr-2"\u003E📘\u003C/span\u003E\n        Pokédex Features\n      \u003C/h3\u003E\n      \u003Cul class="space-y-3"\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EBrowse and search a comprehensive collection of Pokémon from all regions\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EView detailed information for each Pokémon, including stats, types, abilities, region, and species\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EExplore evolution chains with visual diagrams and branching paths\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EFilter and sort Pokémon by type, rarity, height, weight, and more\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E✅\u003C/span\u003E\n          \u003Cspan\u003EExamine each Pokémon\'s full move list, including power, accuracy, learning method, and type\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n    \u003Cdiv\u003E\n      \u003Ch3 class="text-2xl font-semibold mb-4 flex items-center"\u003E\n        \u003Cspan class="mr-2"\u003E🎮\u003C/span\u003E\n        PokéGuess Game\n      \u003C/h3\u003E\n      \u003Cul class="space-y-3"\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EPlay a daily puzzle game where you guess the mystery Pokémon in 6 attempts\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EChoose from three difficulty levels: Easy (Gen 1–3), Medium (Gen 1–6), or Hard (all generations)\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EReceive detailed feedback on 10 different attributes: types, generation, evolution stage, color, habitat, height, weight, and legendary/mythical status\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003ETrack your statistics including win rate, current streak, and maximum streak\u003C/span\u003E\n        \u003C/li\u003E\n        \u003Cli class="flex items-start"\u003E\n          \u003Cspan class="mr-3 mt-1"\u003E🎯\u003C/span\u003E\n          \u003Cspan\u003EShare your results with friends using an emoji-based spoiler-free format\u003C/span\u003E\n        \u003C/li\u003E\n      \u003C/ul\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\u003C/section\u003E\n',
      githubUrl: "https://github.com/akashreya/pokedex",
      liveDemoUrl: "https://pokemon.akashreya.space/",
      projectType: "FRONTEND",
      technologies: [
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-19T13:50:55.603574",
        },
      ],
      images: [
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Pokemon/pokeguess.jpg",
          role: "PRIMARY",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Pokemon/detailsPage.jpg",
          role: "GALLERY",
          orderIndex: 2,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Pokemon/mainPage.jpg",
          role: "GALLERY",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Pokemon/gridview.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Pokemon/listview.jpg",
          role: "GALLERY",
          orderIndex: 1,
        },
      ],
    },
    {
      id: 49,
      createdAt: "2025-07-19T17:51:27.973587",
      updatedAt: "2025-07-19T18:23:51.175866",
      title: "Portfolio Template",
      shortDescription:
        "ProjectService is a full-stack app for showcasing software projects. It uses Spring Boot with JPA/Hibernate for the backend and React with Tailwind CSS for the frontend. Admins can securely manage content, while users can explore projects and technologies.",
      description:
        '\u003Csection class="text-lg leading-relaxed space-y-8"\u003E\n  \u003Cdiv\u003E\n    \u003Cp\u003E\n      ProjectService is a comprehensive full-stack web application designed for portfolio management and technology showcase. Built with modern technologies and a clean architecture pattern, it offers a robust and scalable solution for developers.\n    \u003C/p\u003E\n  \u003C/div\u003E\n\n  \u003Cdiv class="m-4"\u003E\n    \u003Ch3 class="text-2xl font-semibold my-4"\u003E🧩 Backend Architecture (Spring Boot)\u003C/h3\u003E\n    \u003Cul class="list-disc pl-6 space-y-2"\u003E\n      \u003Cli\u003E\u003Cstrong\u003EFramework:\u003C/strong\u003E Spring Boot 3.4.4 with Java 21\u003C/li\u003E\n      \u003Cli\u003E\u003Cstrong\u003ESecurity:\u003C/strong\u003E Spring Security (role-based access: ADMIN)\u003C/li\u003E\n      \u003Cli\u003E\u003Cstrong\u003EAPI Docs:\u003C/strong\u003E OpenAPI / Swagger integrated\u003C/li\u003E\n    \u003C/ul\u003E\n  \u003C/div\u003E\n\n  \u003Cdiv class="m-4"\u003E\n    \u003Ch3 class="text-2xl font-semibold my-4"\u003E⚛️ Frontend Architecture (React)\u003C/h3\u003E\n    \u003Cul class="list-disc pl-6 space-y-2"\u003E\n      \u003Cli\u003E\u003Cstrong\u003EFramework:\u003C/strong\u003E React 19.1.0 with Vite\u003C/li\u003E\n      \u003Cli\u003E\u003Cstrong\u003EStyling:\u003C/strong\u003E Tailwind CSS 4.1.8\u003C/li\u003E\n      \u003Cli\u003E\u003Cstrong\u003EHTTP:\u003C/strong\u003E Axios for API requests\u003C/li\u003E\n    \u003C/ul\u003E\n  \u003C/div\u003E\n\n  \u003Cdiv class="m-4"\u003E\n    \u003Ch3 class="text-2xl font-semibold my-4"\u003E🧰 Frontend Features\u003C/h3\u003E\n    \u003Cul class="list-disc pl-6 space-y-2"\u003E\n      \u003Cli\u003ETabbed interface for Projects and Technologies\u003C/li\u003E\n      \u003Cli\u003EJWT-based authentication with login modal\u003C/li\u003E\n      \u003Cli\u003EFully responsive UI with Tailwind\u003C/li\u003E\n    \u003C/ul\u003E\n  \u003C/div\u003E\n\u003C/section\u003E',
      githubUrl: "https://github.com/akashreya/ProjectService",
      liveDemoUrl: "https://projects.akashreya.space/swagger-ui/index.html",
      projectType: "FULLSTACK",
      technologies: [
        {
          id: 5,
          name: "REST API",
          createdAt: "2025-07-19T13:50:55.788029",
        },
        {
          id: 6,
          name: "Github pages",
          createdAt: "2025-07-19T13:50:55.794077",
        },
        {
          id: 1,
          name: "React",
          createdAt: "2025-07-19T13:50:55.603574",
        },
        {
          id: 2,
          name: "Spring Boot",
          createdAt: "2025-07-19T13:50:55.763705",
        },
      ],
      images: [
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Portfolio/newproject.jpg",
          role: "GALLERY",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Portfolio/landingpage.jpg",
          role: "THUMBNAIL",
          orderIndex: 0,
        },
        {
          imageKey:
            "https://akashreya-bucket.s3.ap-south-1.amazonaws.com/Projects/Portfolio/admin-ui.jpg",
          role: "PRIMARY",
          orderIndex: 0,
        },
      ],
    },
    {
      id: 50,
      createdAt: "2025-07-19T18:32:09.236116",
      updatedAt: "2025-07-19T18:57:57.908109",
      title: "SITA Departure Control System (DCS)",
      shortDescription:
        "Worked on SITA’s Departure Control System, focusing on SOAP-based passenger upgrade/regrade web services and UI development. Also contributed to weight and balance calculations for cargo, ensuring accurate load distribution and flight safety compliance.",
      description:
        '\u003Csection class="text-lg leading-relaxed space-y-10"\u003E\n  \u003Cdiv  class="m-4"\u003E\n    \u003Ch2 class="text-2xl font-bold mb-2"\u003E🛫 Departure Control System (DCS)\u003C/h2\u003E\n    \u003Cp class="text-xl"\u003E\n      Contributed to \u003Cstrong\u003ESITA’s Departure Control System (DCS)\u003C/strong\u003E, used by global airlines and airports for managing check-in, boarding, load control, and flight close-out operations.\n    \u003C/p\u003E\n    \u003Cul class="list-disc list-inside space-y-2 mt-4"\u003E\n      \u003Cli\u003EDesigned and implemented SOAP-based web services for passenger upgrade/regrade workflows (e.g., Economy → Business).\u003C/li\u003E\n      \u003Cli\u003EWorked with WSDL, eligibility rules, and transaction integrity for real-time decision-making.\u003C/li\u003E\n      \u003Cli\u003EBuilt user interface screens optimized for overbooking, VIP upgrades, and last-minute reassignments.\u003C/li\u003E\n      \u003Cli\u003EParticipated in UAT sessions and aligned UI/UX with SITA’s global standards.\u003C/li\u003E\n    \u003C/ul\u003E\n  \u003C/div\u003E\n\n  \u003Cdiv  class="m-4"\u003E\n    \u003Ch2 class="text-2xl font-bold mb-2"\u003E⚖️ Weight & Balance (W&amp;B)\u003C/h2\u003E\n    \u003Cp class="text-xl"\u003E\n      Worked on safety-critical \u003Cstrong\u003Ecargo weight calculation and load distribution\u003C/strong\u003E logic to support aircraft balance and efficiency.\n    \u003C/p\u003E\n    \u003Cul class="list-disc list-inside space-y-2 mt-4"\u003E\n      \u003Cli\u003EDeveloped algorithms to calculate cargo weight by aircraft hold position and validate center-of-gravity (CG) compliance.\u003C/li\u003E\n      \u003Cli\u003EIntegrated cargo, baggage, and passenger data for accurate load control.\u003C/li\u003E\n      \u003Cli\u003EEnsured data accuracy and performance in high-availability, mission-critical environments.\u003C/li\u003E\n    \u003C/ul\u003E\n  \u003C/div\u003E\n\u003C/section\u003E\n',
      githubUrl: "",
      liveDemoUrl:
        "https://www.sita.aero/globalassets/docs/use-cases/sita-local-dcs-use-case.pdf",
      projectType: "BACKEND",
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
      updatedAt: "2025-07-19T18:55:29.350562",
      title: "LSEG Robust Foundation API (RFA) - Java",
      shortDescription:
        "Worked on LSEG’s RFA Java-based market data integration, implementing real-time data subscriptions, processing, and distribution logic. Ensured high-throughput, low-latency performance with secure and resilient connection management for financial applications.",
      description:
        '\u003Csection class="rounded-xl shadow-md p-6 space-y-6"\u003E\n\n\n  \u003Cdiv class="space-y-4"\u003E\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E⚙️\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EIntegrated RFA Java SDK\u003C/strong\u003E to ingest and process live market data from \u003Cem\u003ETREP/RMDS\u003C/em\u003E.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E📡\u003C/span\u003E\n      \u003Cdiv\u003E\n        \u003Cstrong\u003EBuilt high-performance data pipelines\u003C/strong\u003E for:\n        \u003Cul class="list-disc pl-6 mt-1 space-y-1"\u003E\n          \u003Cli\u003E\u003Cspan class="mr-1"\u003E🧲\u003C/span\u003EInitial image retrieval\u003C/li\u003E\n          \u003Cli\u003E\u003Cspan class="mr-1"\u003E🔁\u003C/span\u003EStreaming OMM-based updates\u003C/li\u003E\n          \u003Cli\u003E\u003Cspan class="mr-1"\u003E🎯\u003C/span\u003EField-level filtering\u003C/li\u003E\n        \u003C/ul\u003E\n      \u003C/div\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🧵\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EThread-safe data handling\u003C/strong\u003E using synchronized structures and non-blocking queues for concurrent access.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🎛️\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003ECustom instrument subscription logic\u003C/strong\u003E for asset-specific updates with fine-grained control.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🗂️\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EDesigned layered caches\u003C/strong\u003E for normalized and reference data to support fast retrieval across systems.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🧯\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EImplemented session recovery and failover\u003C/strong\u003E mechanisms including reconnection and event re-subscription.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E⚡\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EPerformance-tuned data ingestion\u003C/strong\u003E for \u003Cem\u003Elow-latency, high-throughput\u003C/em\u003E environments with GC tuning and efficient queuing.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🔐\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EConfigured secure access\u003C/strong\u003E via SSL, entitlement validation, and encrypted sessions.\u003C/p\u003E\n    \u003C/div\u003E\n\n    \u003Cdiv class="flex items-start"\u003E\n      \u003Cspan class="mr-3 mt-1"\u003E🪵\u003C/span\u003E\n      \u003Cp\u003E\u003Cstrong\u003EIntegrated diagnostic logging\u003C/strong\u003E with contextual events for end-to-end traceability and fast issue analysis.\u003C/p\u003E\n    \u003C/div\u003E\n  \u003C/div\u003E\n\n\u003C/section\u003E\n',
      githubUrl: "",
      liveDemoUrl:
        "https://developers.lseg.com/en/api-catalog/real-time/robust-foundation-api-rfa-java",
      projectType: "BACKEND",
      technologies: [
        {
          id: 35,
          name: "Java 17",
          createdAt: "2025-07-19T18:47:11.066471",
        },
        {
          id: 3,
          name: "WebSocket",
          createdAt: "2025-07-19T13:50:55.770889",
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
