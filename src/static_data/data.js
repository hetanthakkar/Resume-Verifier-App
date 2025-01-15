const data = {
  project_verification: {
    id: 104,
    timestamp: '2025-01-10T07:59:57.202889Z',
    pdf_file: '/media/pdfs/Hetan-Thakkar-Resume_icDyLpR.pdf',
    results: {
      summary: {
        total_projects: 2,
        projects_with_urls: 2,
        verified_projects: 2,
        verification_rate: '100.0%',
      },
      projects: [
        {
          name: 'Resume Verification Tool for Recruiters',
          url: 'https://github.com/hetanthakkar/resume-verify',
          verification_score: 9.0,
          status: 'Verified',
          type: 'github',
          details: {
            type: 'github',
            match_score: 9.0,
            content_preview:
              "# RecruiterVerify\n\nRecruiterVerify is a comprehensive tool designed to help recruiters authenticate resumes by verifying candidate details through multiple sources like LinkedIn, GitHub, app stores, and deployed websites. This tool automates the process of verifying work experience, project authenticity, and skill proficiency, giving recruiters deeper insights into a candidate's true capabilities.\n\n## Features\n\n### Experience Verification\n- **LinkedIn Integration**: Cross-references the candidat...",
            error: null,
            match_justification:
              'Nearly complete match with Python, NLP, web scraping, and resume verification technologies explicitly detailed in both the resume description and GitHub README, with comprehensive alignment on core functionality of extracting and validating professional data across multiple platforms',
            repository_statistics: {
              languages: {},
              total_commits: 0,
              stars: 0,
              forks: 0,
            },
          },
        },
        {
          name: 'Peer-to-Peer File Transfer System',
          url: 'https://github.com/hetanthakkar/P2P-file-sharing-application.git',
          verification_score: 9.0,
          status: 'Verified',
          type: 'github',
          details: {
            type: 'github',
            match_score: 9.0,
            content_preview:
              "### P2P File Sharing\n\nA Java-based Peer-to-Peer (P2P) file sharing application similar to BitTorrent.\n\n#### Handshake Message\n\nThe handshake message consists of three parts: handshake header, zero bits, and peer ID. The total length of the handshake message is 32 bytes.\n\n- **Handshake Header:** An 18-byte string 'P2PFILESHARINGPROJ'.\n- **Zero Bits:** 10 bytes of zero bits.\n- **Peer ID:** A 4-byte integer representing the peer ID.\n\n#### Actual Messages\n\nAfter the initial handshake, each peer can ...",
            error: null,
            match_justification:
              "Nearly complete match with Java technology, detailed protocol description precisely aligns with resume's claims about handshake, message types (choke/unchoke/interested), and P2P file transfer mechanics, with only minor specificity details potentially left unconfirmed.",
            repository_statistics: {
              languages: {
                Java: 9932,
              },
              total_commits: 0,
              stars: 0,
              forks: 0,
            },
          },
        },
      ],
    },
  },
  profile_match: {
    id: 'cc2278e9-6c96-497f-9b1b-22d06dbabe2d',
    pdf_url: '',
    linkedin_url: 'https://www.linkedin.com/in/hetan-thakkar/',
    results: {
      experience: {
        summary: [
          {
            company: 'Graphics Portfolio',
            title: 'Graduate Teaching Assistant',
            duration: '09/2023 - 12/2023',
            match_score: 5.63,
          },
          {
            company: 'Zoyride',
            title: 'Software Development Engineer',
            duration: '07/2022 - 07/2023',
            match_score: 7.73,
          },
          {
            company: 'Zoyride',
            title: 'Software Engineering Intern',
            duration: '05/2022 - 07/2022',
            match_score: 6.7,
          },
          {
            company: 'Bytefury Inc.',
            title: 'Software Development Intern',
            duration: '02/2020 - 06/2020',
            match_score: 8.02,
          },
        ],
        detailed: [
          {
            resume_data: {
              company_name: 'Graphics Portfolio',
              job_title: 'Graduate Teaching Assistant',
              start_date: '09/2023',
              end_date: '12/2023',
              location: 'Boston, MA',
              responsibilities: [
                'Led weekly C++ sessions on shader programming and low-level memory management',
                'Created hands-on teaching projects in Computer Graphics, C++, and OpenGL',
              ],
            },
            linkedin_data: {
              company_name: 'Khoury College of Computer Sciences',
              job_title: 'Graduate Teaching Assistant: Computer Graphics',
              start_date: '09/2023',
              end_date: '12/2023',
              location: 'Boston, Massachusetts, United States',
              responsibilities: [
                'Helped students understand computer graphics principles and troubleshoot C++ and OpenGL lab work.',
                'Graded assignments and tests, provided feedback and answered student questions during office hours.',
              ],
            },
            match_metrics: {
              overall_score: 5.63,
              detailed_scores: {
                company_match: 18.9,
                title_match: 74.0,
                date_match: 100.0,
                location_match: 43.5,
                responsibilities_match: 27.7,
              },
            },
          },
          {
            resume_data: {
              company_name: 'Zoyride',
              job_title: 'Software Development Engineer',
              start_date: '07/2022',
              end_date: '07/2023',
              location: 'Gurugram, India',
              responsibilities: [
                'Spearheaded and deployed a web-based platform for ride booking and fleet management',
                'Delivered Spring Boot microservices with SQL queries for ride-sharing and cost-splitting',
                'Wrote automated tests for carpool functionality using Mockito and JUnit',
                'Containerized microservices with Docker, reducing image size from 2GB to 850MB',
                'Engineered CI/CD pipelines (Jenkins) to streamline deployment process',
              ],
            },
            linkedin_data: {
              company_name: 'Zoyride',
              job_title: 'Software Developer',
              start_date: '05/2022',
              end_date: '07/2023',
              location: 'Gurugram, Haryana, India',
              responsibilities: [
                'Spearheaded and deployed a web-based platform for ride booking and fleet management supporting 10K+ daily users',
                'Delivered Spring Boot microservices with SQL queries for ride-sharing and cost-splitting, boosting revenue by 10%',
                'Wrote automated tests for carpool functionality using Mockito and JUnit achieving 90% test coverage',
                'Containerized microservices with Docker using multi-stage builds, reducing image size from 2GB to 850MB',
                'Engineered CI/CD pipelines(Jenkins), reducing deployment time to 15 minutes and streamlining the release process',
              ],
            },
            match_metrics: {
              overall_score: 7.73,
              detailed_scores: {
                company_match: 100.0,
                title_match: 76.6,
                date_match: 50.0,
                location_match: 76.9,
                responsibilities_match: 79.4,
              },
            },
          },
          {
            resume_data: {
              company_name: 'Zoyride',
              job_title: 'Software Engineering Intern',
              start_date: '05/2022',
              end_date: '07/2022',
              location: 'Gurugram, India',
              responsibilities: [
                'Enabled real-time ride status updates with WebSockets for instant ride progress and ETA notifications',
                'Optimized API costs by implementing custom curve-based polynomial algorithms in Google Maps',
                'Integrated Stripe payment gateway to enhance transaction reliability and reduce payment failures',
              ],
            },
            linkedin_data: {
              company_name: 'Ripen',
              job_title: 'Engineering Intern',
              start_date: '05/2022',
              end_date: '07/2022',
              location: 'Bengaluru, Karnataka, India',
              responsibilities: [
                'Designed and added animations for the cross‑platform mobile app that helps adults with health, finance and work.',
                'Decreased the app size by 20% by migrating to new Hermes architecture and using vanilla react native instead of Expo.',
              ],
            },
            match_metrics: {
              overall_score: 6.7,
              detailed_scores: {
                company_match: 50.0,
                title_match: 80.0,
                date_match: 100.0,
                location_match: 61.9,
                responsibilities_match: 8.1,
              },
            },
          },
          {
            resume_data: {
              company_name: 'Bytefury Inc.',
              job_title: 'Software Development Intern',
              start_date: '02/2020',
              end_date: '06/2020',
              location: 'Bangalore, India',
              responsibilities: [
                'Reduced invoice creation time by 9% through UI revamp with modern UX principles and updated React components',
                'Developed payment APIs in ASP.NET supporting 15 currencies, driving over 3,000 new app downloads',
                'Utilized Redis for caching complex invoice calculations, cutting average response time from 2.5s to 800ms',
              ],
            },
            linkedin_data: {
              company_name: 'Bytefury',
              job_title: 'Frontend Developer Intern',
              start_date: '02/2020',
              end_date: '06/2020',
              location: 'India',
              responsibilities: [
                'Reduced invoice creation time by 9% through UI revamp with modern UX principles and updated React components',
                'Developed payment APIs in ASP.NET adding support for 15 currencies, driving over 3,000 new app downloads',
                'Used Redis for caching complex invoice calculations, cutting average response time from 2.5 seconds to 800ms',
              ],
            },
            match_metrics: {
              overall_score: 8.02,
              detailed_scores: {
                company_match: 76.2,
                title_match: 73.1,
                date_match: 100.0,
                location_match: 47.6,
                responsibilities_match: 93.5,
              },
            },
          },
        ],
      },
      publications: {
        summary: [],
        detailed: [],
      },
      achievements: {
        summary: [],
        detailed: [],
      },
      overall_scores: {
        total_match_score: 6.52,
        experience_score: 6.52,
        publications_score: 0,
        achievements_score: 0,
      },
    },
    created_at: '2025-01-10T07:59:58.301215Z',
    updated_at: '2025-01-10T07:59:58.301262Z',
  },
  job_match: {
    required_skills_matched: [
      {
        skill: 'python',
        project: 'Resume Verification Tool for Recruiters',
        description:
          'Created a resume verification app using Python and NLP to extract and validate data from PDF resumes',
      },
    ],
    preferred_skills_matched: [
      {
        skill: 'docker',
        project: 'Software Development Engineer at Zoyride',
        description:
          'Containerized microservices with Docker using multi-stage builds, reducing image size from 2GB to 850MB',
      },
    ],
    experience_match: {
      meets_requirement: false,
      years: '1',
      justification:
        "Only has 1 year of full-time professional experience as Software Development Engineer at Zoyride (Jul 2022 - Jul 2023). Internships don't count towards required professional experience.",
    },
    education_match: {
      meets_requirement: true,
      justification:
        "Has Bachelor's in Computer Engineering from Gujarat Technological University and pursuing Master's in Computer Science from Northeastern University. While the bachelor's is in Computer Engineering rather than Computer Science specifically, it's typically considered equivalent for software engineering positions.",
    },
  },
};
export default data;
