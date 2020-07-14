using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using MoreLinq;
using Oracle.Domain;

namespace Oracle.Persistence
{
    // TODO: Update to have 2 separate calls, list of Surveys with info and last Form and list of all Forms.
    public class SurveyLiteRepository : ISurveyRepository
    {
        private readonly SurveyLiteDbContext _context;

        public SurveyLiteRepository(SurveyLiteDbContext context) => _context = context;

        public Task<IEnumerable<Survey>> GetSurveysAsync() {
            var surveys = _context.Surveys.FindAll().ToList();
            foreach (var survey in surveys) {
                var lastSubmitted = _context.Forms.Find(f => f.SurveyId == survey.Id).MaxBy(f => f.ObjectId.CreationTime).Take(1);
                survey.SubmittedForms.AddRange(lastSubmitted);
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