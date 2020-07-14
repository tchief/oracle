using System.Collections.Generic;
using System.Text.Json.Serialization;
using LiteDB;

namespace Oracle.Domain
{
    public class Survey
    {
        [BsonId]
        [JsonIgnore]
        public ObjectId ObjectId { get; set; }
        public string Id => ObjectId?.ToString();
        
        public string Name { get; set; }
        public Choice Root { get; set; }
        public List<Form> SubmittedForms { get; set; } = new List<Form>();
    }

    public class Form
    {
        [BsonId]
        [JsonIgnore]
        public ObjectId ObjectId { get; set; }
        public string Id => ObjectId?.ToString();

        public string SurveyId { get; set; }
        public string UserName { get; set; }
        public IDictionary<string, bool> ChoicesMade { get; set; }
    }

    public class Choice
    {
        public Choice() { }
        public Choice(int id, string question, Choice left = null, Choice right = null) {
            Id = id;
            Question = question;
            Left = left;
            Right = right;
        }

        public int Id { get; set; }
        public string Question { get; set; }
        public Choice Left { get; set; }
        public Choice Right { get; set; }
    }
}