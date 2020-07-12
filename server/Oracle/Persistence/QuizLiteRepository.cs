using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.Domain;

namespace Oracle.Persistence
{
    public class QuizLiteRepository : IQuizRepository
    {
        private readonly QuizLiteDbContext _context;

        public QuizLiteRepository(QuizLiteDbContext context) => _context = context;

        public Task<YesNoQuiz> GetQuizAsync(string id) =>
            Task.FromResult(_context.Quizzes.FindOne(c => c.Id == id));

        public Task<IEnumerable<YesNoQuiz>> GetQuizzesAsync() =>
            Task.FromResult(_context.Quizzes.FindAll());

        public Task<YesNoQuiz> SubmitQuiz(YesNoQuiz quiz) {
            _context.Quizzes.Insert(quiz);
            return Task.FromResult(quiz);
        }
    }
}