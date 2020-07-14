﻿using System.Linq;
using LiteDB;
using Oracle.Domain;

namespace Oracle.Persistence
{
    public class SurveyLiteDbContext
    {
        public LiteDatabase Database { get; }

        public SurveyLiteDbContext(string connection) {
            Database = new LiteDatabase(connection);
            var total = Surveys.Count();
            const int max = 10;
            if (total < max) {
                var newSurveys = Enumerable.Range(0, max - total).SelectMany(i => RandomEntitiesGenerator.SeedSurveys());
                Surveys.InsertBulk(newSurveys);
            }
        }

        public ILiteCollection<Survey> Surveys => Database.GetCollection<Survey>("Surveys");
        public ILiteCollection<Form> Forms => Database.GetCollection<Form>("Forms");
    }
}