using LiteDB;
using Oracle.Domain;

namespace Oracle.Persistence
{
    public class SurveyLiteDbContext
    {
        public LiteDatabase Database { get; }

        public SurveyLiteDbContext(string connection) {
            Database = new LiteDatabase(connection);
            if (!Surveys.Exists(_ => true)) Surveys.InsertBulk(RandomEntitiesGenerator.SeedSurveys());
        }

        public ILiteCollection<Survey> Surveys => Database.GetCollection<Survey>("Surveys");
        public ILiteCollection<Form> Forms => Database.GetCollection<Form>("Forms");
    }
}