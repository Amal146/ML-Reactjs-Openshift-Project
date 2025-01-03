
CREATE TABLE IF NOT EXISTS public.wheat_diseases
(
    id integer NOT NULL DEFAULT nextval('wheat_diseases_id_seq'::regclass),
    disease_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    symptom_1 character varying(255) COLLATE pg_catalog."default" NOT NULL,
    symptom_2 character varying(255) COLLATE pg_catalog."default" NOT NULL,
    symptom_3 character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT wheat_diseases_pkey PRIMARY KEY (id)
);

INSERT INTO wheat_diseases (disease_name, symptom_1, symptom_2, symptom_3)
    VALUES 
        ('Leaf Rust', 'Orange-red pustules', 'Stunted growth', 'Leaf curling'),
        ('Stem Rust', 'Dark red pustules', 'Stem weakening', 'Grain loss'),
        ('Powdery Mildew', 'White powdery spots', 'Leaf drying', 'Poor yield');
