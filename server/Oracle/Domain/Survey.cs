using System.Collections.Generic;
using System.Text.Json.Serialization;
using LiteDB;

// Nouns & Verbs options.
// 1. Survey, Form, Choice.
// 2. Quiz, Path, Answer.
// 3. Oracle, Prophecy, Wisdom.
// 4. Game, Match, Score.
// 5. Decision, Path, Choice.
// 6. Akinator, Mystery, Guess.
// 7. Exam, Test, Choice.

// TODO: Consider immutable objects, or extract a separate layer (dto/domain), validation.
// TODO: Choices made bool => int (so >2 answers provided, say Yes/No/Maybe), T=>T[] (so multiple answers for same question).
// TODO: Consider storing list of answers, not dictionary.
namespace Oracle.Domain
{
    // Pros & Cons of having SubmittedForms as part of Survey scheme in db.
    // Pros. 
    // 1. Easier to use (controversial).
    // 2. Faster to read (controversial, if we need all forms results right away materialized).
    // Cons.
    // 1. Slower to write (submit new form).
    // 2. Faster to read (as we do not always need forms info, just, say, its total number).
    // Assuming our system has many users submitting.
    // And there are some popular surveys with high write ratio.
    // And we do not need all submitted forms right away, and may old ones at all.
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