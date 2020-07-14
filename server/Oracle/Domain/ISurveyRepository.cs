using System.Collections.Generic;
using System.Threading.Tasks;

namespace Oracle.Domain
{
    public interface ISurveyRepository
    {
        Task<IEnumerable<Survey>> GetSurveysAsync();
        Task<Form> SubmitSurveyAsync(Form form);
    }
}