using System.Collections.Generic;
using System.Threading.Tasks;

namespace Oracle.Domain
{
    public interface IQuizRepository
    {
        Task<IEnumerable<YesNoQuiz>> GetQuizzesAsync();
        Task<YesNoQuiz> GetQuizAsync(string id);
        Task<YesNoQuiz> SubmitQuiz(YesNoQuiz quiz);
    }
}