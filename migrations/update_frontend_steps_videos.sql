-- Replace Frontend Developer steps with YouTube playlist videos
DO $$
DECLARE
  frontend_id INT;
BEGIN
  SELECT id INTO frontend_id FROM roadmaps WHERE slug = 'frontend-developer';
  IF frontend_id IS NULL THEN
    RAISE NOTICE 'Frontend roadmap not found. Skipping update.';
    RETURN;
  END IF;

  DELETE FROM session_logs
  WHERE step_id IN (SELECT id FROM steps WHERE roadmap_id = frontend_id);

  DELETE FROM progress
  WHERE step_id IN (SELECT id FROM steps WHERE roadmap_id = frontend_id);

  DELETE FROM steps WHERE roadmap_id = frontend_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (frontend_id, 'HTML Tutorial', 'Master HTML Tutorial in this detailed learning guide.',
     '# HTML Tutorial',
     1, 60,
     '[{"title":"HTML Tutorial","url":"https://www.youtube.com/watch?v=916GWv2Qs08&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=2","type":"video"}]'),

    (frontend_id, 'CSS Tutorial', 'Master CSS Tutorial in this detailed learning guide.',
     '# CSS Tutorial',
     2, 60,
     '[{"title":"CSS Tutorial","url":"https://www.youtube.com/watch?v=OXGznpKZ_sA&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=3","type":"video"}]'),

    (frontend_id, 'JavaScript Programming Full Course', 'Master JavaScript Programming Full Course in this detailed learning guide.',
     '# JavaScript Programming Full Course',
     3, 60,
     '[{"title":"JavaScript Programming Full Course","url":"https://www.youtube.com/watch?v=jS4aFq5-91M&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=5","type":"video"}]'),

    (frontend_id, 'Build a Simple Website with HTML, CSS and JavaScript', 'Master Build a Simple Website with HTML, CSS and JavaScript in this detailed learning guide.',
     '# Build a Simple Website with HTML, CSS and JavaScript',
     4, 60,
     '[{"title":"Build a Simple Website with HTML, CSS and JavaScript","url":"https://www.youtube.com/watch?v=krfUjg0S2uI&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=7","type":"video"}]'),

    (frontend_id, 'Web App Tutorial - JavaScript, Mobile First, Accessibility, Persistent Data, Sass', 'Master Web App Tutorial - JavaScript, Mobile First, Accessibility, Persistent Data, Sass in this detailed learning guide.',
     '# Web App Tutorial - JavaScript, Mobile First, Accessibility, Persistent Data, Sass',
     5, 60,
     '[{"title":"Web App Tutorial - JavaScript, Mobile First, Accessibility, Persistent Data, Sass","url":"https://www.youtube.com/watch?v=y51Cv4wnsPw&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=8","type":"video"}]'),

    (frontend_id, 'Git and GitHub for Beginners', 'Master Git and GitHub for Beginners in this detailed learning guide.',
     '# Git and GitHub for Beginners',
     6, 60,
     '[{"title":"Git and GitHub for Beginners","url":"https://www.youtube.com/watch?v=RGOj5yH7evk&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=9","type":"video"}]'),

    (frontend_id, 'Learn Bootstrap 5 and SASS by Building a Portfolio Website', 'Master Learn Bootstrap 5 and SASS by Building a Portfolio Website in this detailed learning guide.',
     '# Learn Bootstrap 5 and SASS by Building a Portfolio Website',
     7, 60,
     '[{"title":"Learn Bootstrap 5 and SASS by Building a Portfolio Website","url":"https://www.youtube.com/watch?v=iJKCj8uAHz8&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=10","type":"video"}]'),

    (frontend_id, 'Learn React 18 with Redux Toolkit', 'Master Learn React 18 with Redux Toolkit in this detailed learning guide.',
     '# Learn React 18 with Redux Toolkit',
     8, 60,
     '[{"title":"Learn React 18 with Redux Toolkit","url":"https://www.youtube.com/watch?v=2-crBg6wpp0&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=11","type":"video"}]'),

    (frontend_id, 'Learn Tailwind CSS', 'Master Learn Tailwind CSS in this detailed learning guide.',
     '# Learn Tailwind CSS',
     9, 60,
     '[{"title":"Learn Tailwind CSS","url":"https://www.youtube.com/watch?v=ft30zcMlFao&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=12","type":"video"}]'),

    (frontend_id, 'Learn Vite', 'Master Learn Vite in this detailed learning guide.',
     '# Learn Vite',
     10, 60,
     '[{"title":"Learn Vite","url":"https://www.youtube.com/watch?v=VAeRhmpcWEQ&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=13","type":"video"}]'),

    (frontend_id, 'Testing JavaScript with Cypress', 'Master Testing JavaScript with Cypress in this detailed learning guide.',
     '# Testing JavaScript with Cypress',
     11, 60,
     '[{"title":"Testing JavaScript with Cypress","url":"https://www.youtube.com/watch?v=u8vMu7viCm8&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=14","type":"video"}]'),

    (frontend_id, 'React Testing Course for Beginners', 'Master React Testing Course for Beginners in this detailed learning guide.',
     '# React Testing Course for Beginners',
     12, 60,
     '[{"title":"React Testing Course for Beginners","url":"https://www.youtube.com/watch?v=8vfQ6SWBZ-U&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=15","type":"video"}]'),

    (frontend_id, 'Learn TypeScript', 'Master Learn TypeScript in this detailed learning guide.',
     '# Learn TypeScript',
     13, 60,
     '[{"title":"Learn TypeScript","url":"https://www.youtube.com/watch?v=30LWjhZzg50&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=16","type":"video"}]'),

    (frontend_id, 'GraphQL Course for Beginners', 'Master GraphQL Course for Beginners in this detailed learning guide.',
     '# GraphQL Course for Beginners',
     14, 60,
     '[{"title":"GraphQL Course for Beginners","url":"https://www.youtube.com/watch?v=5199E50O7SI&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=17","type":"video"}]'),

    (frontend_id, 'Next.js React Framework Course', 'Master Next.js React Framework Course in this detailed learning guide.',
     '# Next.js React Framework Course',
     15, 60,
     '[{"title":"Next.js React Framework Course","url":"https://www.youtube.com/watch?v=KjY94sAKLlw&list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E&index=18","type":"video"}]');
END $$;
