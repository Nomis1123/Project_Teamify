-- 3. Seed Conversations
-- Remember your CHECK constraint: user1_id must be < user2_id
INSERT INTO conversations (id, user1_id, user2_id) VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 1, 4);

SELECT setval('conversations_id_seq', 3, true);

-- 4. Seed Messages (50 messages across the 3 conversations)
-- We use NOW() - INTERVAL to stagger the message times realistically
INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
    -- Conversation 1: Alex (1) and Sam (2) discussing the Teamify backend
    (1, 1, 'Hey Sam, did you get a chance to look at the database schema?', NOW() - INTERVAL '2 days 4 hours'),
    (1, 2, 'Yeah, just reviewed it. The constraints on the conversations table look solid.', NOW() - INTERVAL '2 days 3 hours 50 minutes'),
    (1, 1, 'Awesome. I am working on the Flask routes right now.', NOW() - INTERVAL '2 days 3 hours 45 minutes'),
    (1, 2, 'Are you using psycopg2 for the database connection?', NOW() - INTERVAL '2 days 3 hours 40 minutes'),
    (1, 1, 'Exactly. It is hooking up to PostgreSQL nicely.', NOW() - INTERVAL '2 days 3 hours 30 minutes'),
    (1, 2, 'What about authentication? Are we still going with JWT?', NOW() - INTERVAL '2 days 3 hours 25 minutes'),
    (1, 1, 'Yes, I have the token generation working, just need to write the middleware to verify it.', NOW() - INTERVAL '2 days 3 hours'),
    (1, 2, 'Sweet. Let me know when you push the code, I will pull it down and test the endpoints.', NOW() - INTERVAL '2 days 2 hours 50 minutes'),
    (1, 1, 'Will do. I might need your help testing the microservice setup later.', NOW() - INTERVAL '2 days 2 hours'),
    (1, 2, 'No problem, we can run it on the lab machines to see how it handles traffic.', NOW() - INTERVAL '2 days 1 hour'),
    (1, 1, 'I am getting a weird foreign key error on the messages table now.', NOW() - INTERVAL '1 day 5 hours'),
    (1, 2, 'Did you remember to run the conversations SQL file first?', NOW() - INTERVAL '1 day 4 hours 55 minutes'),
    (1, 1, 'Ah, yep. That was it. Order of operations!', NOW() - INTERVAL '1 day 4 hours 50 minutes'),
    (1, 2, 'Classic. Happens to me all the time.', NOW() - INTERVAL '1 day 4 hours 45 minutes'),
    (1, 1, 'Okay, code is pushed. Check the teamify repo.', NOW() - INTERVAL '1 day 2 hours'),
    (1, 2, 'Pulling now.', NOW() - INTERVAL '1 day 1 hour 55 minutes'),
    (1, 2, 'Getting a connection refused error. Is the database running on port 5432?', NOW() - INTERVAL '1 day 1 hour 40 minutes'),
    (1, 1, 'Yeah, make sure your local Postgres service is active.', NOW() - INTERVAL '1 day 1 hour 30 minutes'),
    (1, 2, 'Got it. Works perfectly. The JWT middleware is super clean.', NOW() - INTERVAL '1 day 1 hour'),
    (1, 1, 'Thanks! Next up: WebSockets for real-time chat.', NOW() - INTERVAL '1 day'),

    -- Conversation 2: Sam (2) and Jordan (3) discussing a robotics lab
    (2, 2, 'Hey Jordan, have you started the wall-following assignment yet?', NOW() - INTERVAL '3 days 10 hours'),
    (2, 3, 'Just barely. I am trying to get the ROS nodes talking to each other.', NOW() - INTERVAL '3 days 9 hours'),
    (2, 2, 'I was stuck on that too. Make sure your catkin workspace is sourced properly.', NOW() - INTERVAL '3 days 8 hours'),
    (2, 3, 'Good call. Are you writing the control logic in Python or C++?', NOW() - INTERVAL '3 days 7 hours 30 minutes'),
    (2, 2, 'Python. It is just faster to iterate on.', NOW() - INTERVAL '3 days 7 hours'),
    (2, 3, 'Same. My robot keeps crashing into the corners in Gazebo though.', NOW() - INTERVAL '3 days 6 hours'),
    (2, 2, 'Check your LIDAR scan ranges. You might be filtering out the critical angles.', NOW() - INTERVAL '3 days 5 hours'),
    (2, 3, 'Oh man, you are right. I was ignoring the 45-degree data points.', NOW() - INTERVAL '3 days 4 hours'),
    (2, 2, 'Next week is going to be brutal. Graph SLAM and Kalman filters.', NOW() - INTERVAL '2 days 12 hours'),
    (2, 3, 'Do not remind me. I am still trying to wrap my head around loop closures.', NOW() - INTERVAL '2 days 11 hours'),
    (2, 2, 'If you want, we can book a room at Deerfield and study the math together.', NOW() - INTERVAL '2 days 10 hours'),
    (2, 3, 'That would be a lifesaver. Wednesday afternoon?', NOW() - INTERVAL '2 days 9 hours'),
    (2, 2, 'Wednesday works. I will bring the whiteboard markers.', NOW() - INTERVAL '2 days 8 hours'),
    (2, 3, 'Perfect. I will see if I can get my base code running before then.', NOW() - INTERVAL '2 days 7 hours'),
    (2, 2, 'Sounds like a plan. Good luck with the Gazebo simulation.', NOW() - INTERVAL '2 days 6 hours'),

    -- Conversation 3: Alex (1) and Taylor (4) casual chat
    (3, 4, 'Are you on campus right now?', NOW() - INTERVAL '5 hours'),
    (3, 1, 'Yeah, just wrapping up some work in the lab. Why?', NOW() - INTERVAL '4 hours 55 minutes'),
    (3, 4, 'Trying to figure out if it is worth driving in. How is parking?', NOW() - INTERVAL '4 hours 50 minutes'),
    (3, 1, 'Terrible, as usual. I had to circle the lot for 15 minutes.', NOW() - INTERVAL '4 hours 45 minutes'),
    (3, 4, 'Ugh, maybe I will just take the bus then.', NOW() - INTERVAL '4 hours 40 minutes'),
    (3, 1, 'Probably a smart move. My license plate is so worn out anyway, the cameras barely read it.', NOW() - INTERVAL '4 hours 30 minutes'),
    (3, 4, 'Haha, free parking hack?', NOW() - INTERVAL '4 hours 25 minutes'),
    (3, 1, 'I wish. They still get me.', NOW() - INTERVAL '4 hours 20 minutes'),
    (3, 4, 'Do you want to grab lunch when you are done?', NOW() - INTERVAL '3 hours'),
    (3, 1, 'Sure, I am starving. Where to?', NOW() - INTERVAL '2 hours 55 minutes'),
    (3, 4, 'I could go for a burger. Or sushi?', NOW() - INTERVAL '2 hours 50 minutes'),
    (3, 1, 'Burger sounds amazing right now.', NOW() - INTERVAL '2 hours 45 minutes'),
    (3, 4, 'Cool, meet me by the student center in 20?', NOW() - INTERVAL '2 hours 40 minutes'),
    (3, 1, 'On my way. Just pushing this last commit to GitHub.', NOW() - INTERVAL '2 hours 35 minutes'),
    (3, 4, 'See you soon.', NOW() - INTERVAL '2 hours 30 minutes');
