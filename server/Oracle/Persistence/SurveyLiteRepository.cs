﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using MoreLinq;
using Oracle.Domain;
using LanguageExt;
using LanguageExt.Common;

namespace Oracle.Persistence
{
    // TODO: Update to have 2 separate calls, list of Surveys with info and last Form and list of all Forms.
    public class SurveyLiteRepository : ISurveyRepository
    {
        private readonly SurveyLiteDbContext _context;

        public SurveyLiteRepository(SurveyLiteDbContext context) => _context = context;

        public Task<IEnumerable<Survey>> GetSurveysAsync() {
            var surveys = _context.Surveys.FindAll().ToList();
            foreach (var survey in surveys)
            {
                var submitted = _context.Forms.Find(f => f.SurveyId == survey.Id).OrderBy(f => f.ObjectId.CreationTime);
                survey.SubmittedForms.AddRange(submitted);
            }
            
            return Task.FromResult((IEnumerable<Survey>)surveys);
        }

        public OptionAsync<Survey> GetSurveyAsync(string id) {
            var survey = _context.Surveys.FindById(new ObjectId(id));
            if (survey == null) return OptionAsync<Survey>.None;

            survey.SubmittedForms.AddRange(_context.Forms.Find(f => f.SurveyId == id));
            return Task.FromResult(survey);
        }

        public EitherAsync<Error, Form> SubmitSurveyAsync(Form form) {
            var survey = _context.Surveys.FindById(new ObjectId(form.SurveyId));
            if (survey == null) return Error.New($"Survey was not found by {form.SurveyId}");

            form.ObjectId = ObjectId.NewObjectId();
            _context.Forms.Insert(form);
            return Task.FromResult(form);
        }
    }
}