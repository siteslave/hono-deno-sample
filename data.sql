CREATE TABLE public.users (
	first_name varchar NULL,
	last_name varchar NULL,
	username varchar NOT NULL,
	"password" varchar NULL,
	user_id uuid NULL DEFAULT gen_random_uuid(),
	CONSTRAINT users_pk PRIMARY KEY (username)
);