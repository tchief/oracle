CREATE TABLE public.forms (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "userName" text NOT NULL,
    "surveyId" uuid NOT NULL,
    "choicesMade" json NOT NULL
);
CREATE TABLE public.surveys (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    root json NOT NULL
);
ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forms
    ADD CONSTRAINT "forms_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public.surveys(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

