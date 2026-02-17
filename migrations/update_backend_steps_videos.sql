-- Replace Backend Developer steps with YouTube playlist videos
DO $$
DECLARE
  backend_id INT;
BEGIN
  SELECT id INTO backend_id FROM roadmaps WHERE slug = 'backend-developer';
  IF backend_id IS NULL THEN
    RAISE NOTICE 'Backend roadmap not found. Skipping update.';
    RETURN;
  END IF;

  DELETE FROM session_logs
  WHERE step_id IN (SELECT id FROM steps WHERE roadmap_id = backend_id);

  DELETE FROM progress
  WHERE step_id IN (SELECT id FROM steps WHERE roadmap_id = backend_id);

  DELETE FROM steps WHERE roadmap_id = backend_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (backend_id, 'Master JavaScript Essentials for Backend Development', 'Master JavaScript Essentials for Backend Development in this detailed learning guide.',
     '# Master JavaScript Essentials for Backend Development',
     1, 60,
     '[{"title":"Master JavaScript Essentials for Backend Development","url":"https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=1","type":"video"}]'),

    (backend_id, 'Install Node.js & Learn File System Operations', 'Master Install Node.js & Learn File System Operations in this detailed learning guide.',
     '# Install Node.js & Learn File System Operations',
     2, 60,
     '[{"title":"Install Node.js & Learn File System Operations","url":"https://www.youtube.com/watch?v=OFbSqd54Wwk&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=2","type":"video"}]'),

    (backend_id, 'NPM Basics & Advanced Features', 'Master NPM Basics & Advanced Features in this detailed learning guide.',
     '# NPM Basics & Advanced Features',
     3, 60,
     '[{"title":"NPM Basics & Advanced Features","url":"https://www.youtube.com/watch?v=I3y1XHwBL6w&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=3","type":"video"}]'),

    (backend_id, 'Master Express.js, Routing & Middleware', 'Master Express.js, Routing & Middleware in this detailed learning guide.',
     '# Master Express.js, Routing & Middleware',
     4, 60,
     '[{"title":"Master Express.js, Routing & Middleware","url":"https://www.youtube.com/watch?v=3CkgSQWwNlk&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=4","type":"video"}]'),

    (backend_id, 'Form Handling, Sessions & Cookies', 'Master Form Handling, Sessions & Cookies in this detailed learning guide.',
     '# Form Handling, Sessions & Cookies',
     5, 60,
     '[{"title":"Form Handling, Sessions & Cookies","url":"https://www.youtube.com/watch?v=5NWdfv5P5d4&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=5","type":"video"}]'),

    (backend_id, 'Master EJS, Dynamic Routing & Project Setup', 'Master EJS, Dynamic Routing & Project Setup in this detailed learning guide.',
     '# Master EJS, Dynamic Routing & Project Setup',
     6, 60,
     '[{"title":"Master EJS, Dynamic Routing & Project Setup","url":"https://www.youtube.com/watch?v=mRTG7fdzF6s&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=7","type":"video"}]'),

    (backend_id, 'MongoDB, Mongoose & Database Management', 'Master MongoDB, Mongoose & Database Management in this detailed learning guide.',
     '# MongoDB, Mongoose & Database Management',
     7, 60,
     '[{"title":"MongoDB, Mongoose & Database Management","url":"https://www.youtube.com/watch?v=4TFA-vy_fdo&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=10","type":"video"}]'),

    (backend_id, 'Master CRUD Operations with MongoDB', 'Master CRUD Operations with MongoDB in this detailed learning guide.',
     '# Master CRUD Operations with MongoDB',
     8, 60,
     '[{"title":"Master CRUD Operations with MongoDB","url":"https://www.youtube.com/watch?v=ZMEVI1Y7FtY&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=11","type":"video"}]'),

    (backend_id, 'CRUD Operations with EJS & Server-Side Rendering', 'Master CRUD Operations with EJS & Server-Side Rendering in this detailed learning guide.',
     '# CRUD Operations with EJS & Server-Side Rendering',
     9, 60,
     '[{"title":"CRUD Operations with EJS & Server-Side Rendering","url":"https://www.youtube.com/watch?v=DteKTbG2hE0&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=12","type":"video"}]'),

    (backend_id, 'Update feature with EJS & Server-Side Rendering', 'Master Update feature with EJS & Server-Side Rendering in this detailed learning guide.',
     '# Update feature with EJS & Server-Side Rendering',
     10, 60,
     '[{"title":"Update feature with EJS & Server-Side Rendering","url":"https://www.youtube.com/watch?v=PbDXCh4sMIo&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=13","type":"video"}]'),

    (backend_id, 'Authentication & Authorization | Bcrypt | JWT', 'Master Authentication & Authorization | Bcrypt | JWT in this detailed learning guide.',
     '# Authentication & Authorization | Bcrypt | JWT',
     11, 60,
     '[{"title":"Authentication & Authorization | Bcrypt | JWT","url":"https://www.youtube.com/watch?v=19RpMEonSu8&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=14","type":"video"}]'),

    (backend_id, 'Data Association | MongoDB', 'Master Data Association | MongoDB in this detailed learning guide.',
     '# Data Association | MongoDB',
     12, 60,
     '[{"title":"Data Association | MongoDB","url":"https://www.youtube.com/watch?v=g1uL2byQTzo&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=16","type":"video"}]'),

    (backend_id, 'Mini Project 1 | Data Association - MongoDB', 'Master Mini Project 1 | Data Association - MongoDB in this detailed learning guide.',
     '# Mini Project 1 | Data Association - MongoDB',
     13, 60,
     '[{"title":"Mini Project 1 | Data Association - MongoDB","url":"https://www.youtube.com/watch?v=8CAjzElJUiU&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=17","type":"video"}]'),

    (backend_id, 'Mini Project 1 - Part 2 | Data Association - MongoDB', 'Master Mini Project 1 - Part 2 | Data Association - MongoDB in this detailed learning guide.',
     '# Mini Project 1 - Part 2 | Data Association - MongoDB',
     14, 60,
     '[{"title":"Mini Project 1 - Part 2 | Data Association - MongoDB","url":"https://www.youtube.com/watch?v=VR9ua1zVqz0&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=18","type":"video"}]'),

    (backend_id, 'Mini Project 1 - Part 3 | Data Association - MongoDB', 'Master Mini Project 1 - Part 3 | Data Association - MongoDB in this detailed learning guide.',
     '# Mini Project 1 - Part 3 | Data Association - MongoDB',
     15, 60,
     '[{"title":"Mini Project 1 - Part 3 | Data Association - MongoDB","url":"https://www.youtube.com/watch?v=Ebp7dWMGHlI&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=19","type":"video"}]'),

    (backend_id, 'Multer - multipart/form-data | MongoDB', 'Master Multer - multipart/form-data | MongoDB in this detailed learning guide.',
     '# Multer - multipart/form-data | MongoDB',
     16, 60,
     '[{"title":"Multer - multipart/form-data | MongoDB","url":"https://www.youtube.com/watch?v=n1a2cITIVeQ&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=20","type":"video"}]');
END $$;
