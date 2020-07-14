using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Oracle.Domain;

namespace Oracle.Persistence
{
    public class SurveyLiteRepository : ISurveyRepository
    {
        private readonly SurveyLiteDbContext _context;

        public SurveyLiteRepository(SurveyLiteDbContext context) => _context = context;

        public Task<IEnumerable<Survey>> GetSurveysAsync() {
            var surveys = _context.Surveys.FindAll().ToList();
            foreach (var survey in surveys) {
                survey.SubmittedForms.AddRange(_context.Forms.Find(f => f.SurveyId == survey.Id).OrderBy(f => f.ObjectId.CreationTime));
            }
            
            return Task.FromResult((IEnumerable<Survey>)surveys);
        }

        public Task<Survey> GetSurveyAsync(string id) {
            var survey = _context.Surveys.FindById(new ObjectId(id));
            survey.SubmittedForms.AddRange(_context.Forms.Find(f => f.SurveyId == id));
            return Task.FromResult(survey);
        }

        public Task<Form> SubmitSurveyAsync(Form form) {
            form.ObjectId = ObjectId.NewObjectId();
            _context.Forms.Insert(form);
            return Task.FromResult(form);
        }
    }
}