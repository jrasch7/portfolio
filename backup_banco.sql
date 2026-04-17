--
-- PostgreSQL database dump
--

\restrict HW17U6UwV2sdVAS5ilM3CIGU86PwSahAQoTjTpi9DCH2mP7jvbSEoHj7zwwViuQ

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: habilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    categoria_pai character varying(50) NOT NULL
);


ALTER TABLE public.habilidades OWNER TO postgres;

--
-- Name: habilidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habilidades_id_seq OWNER TO postgres;

--
-- Name: habilidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_id_seq OWNED BY public.habilidades.id;


--
-- Name: habilidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades ALTER COLUMN id SET DEFAULT nextval('public.habilidades_id_seq'::regclass);


--
-- Data for Name: habilidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habilidades (id, nome, categoria_pai) FROM stdin;
1	Python Puro	Python
2	Flask	Python
3	PostgreSQL	Banco de Dados
4	SQLite	Banco de Dados
5	MySQL	Banco de Dados
6	REST APIs	Integrações
7	JSON/XML	Integrações
8	Linux Ubuntu	Infraestrutura
9	Git/GitHub	Ferramentas
\.


--
-- Name: habilidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habilidades_id_seq', 9, true);


--
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict HW17U6UwV2sdVAS5ilM3CIGU86PwSahAQoTjTpi9DCH2mP7jvbSEoHj7zwwViuQ

