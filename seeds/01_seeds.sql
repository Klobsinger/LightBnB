INSERT INTO users (name, email, password)
 VALUES 
 ('Lord Gringles', 'Gringler@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),

 ('LeoTheCat', 'TunaLover@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),

 ('RobinTheCat', 'StinkyButt@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) 
VALUES 
(1, 'hobbit hole', 'description', 'exampleurl','exampleurl', 5, 2, 10, 5, 'Canada', 'Windchester', 'Sarnia', 'ON','N7S-5T8'),

(2, 'Tuna Land', 'description', 'exampleurl','exampleurl', 5, 2, 10, 5, 'Canada', 'Stinky Paw', 'Windsor', 'ON','N7S-PAW'),

(3, 'Stinky-Bum', 'description', 'exampleurl','exampleurl', 5, 2, 10, 5, 'Canada', 'Sweet', 'TootsVille', 'ON','N7S-5T8');

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES 
('2023-10-01', '2023-10-20', 1, 3),

('2023-10-01', '2023-10-20', 2, 3),

('2023-10-01', '2023-10-20', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 2, 3, 5, 'message'),
(1, 2, 3, 5, 'message'),
(1, 2, 3, 5, 'message');