using LanguageExt;
using LanguageExt.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Oracle.Domain
{
    public interface ISurveyRepository
    {
        Task<IEnumerable<Survey>> GetSurveysAsync();
        OptionAsync<Survey> GetSurveyAsync(string id);
        EitherAsync<Error, Form> SubmitSurveyAsync(Form form);
    }
}