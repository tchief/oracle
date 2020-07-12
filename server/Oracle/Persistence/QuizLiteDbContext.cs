using LiteDB;
using Oracle.Domain;

namespace Oracle.Persistence
{
    public class QuizLiteDbContext
    {
        public LiteDatabase Database { get; }

        public QuizLiteDbContext(string connection) {
            Database = new LiteDatabase(connection);
            Quizzes.InsertBulk(RandomEntitiesGenerator.Seed());
        }

        public ILiteCollection<YesNoQuiz> Quizzes =>
            Database.GetCollection<YesNoQuiz>("YesNoQuiz");
    }
}