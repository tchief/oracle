namespace Oracle.Domain
{
    public class YesNoQuiz
    {
        public YesNoQuiz() { }
        public YesNoQuiz(string id, string question, YesNoQuiz left = null, YesNoQuiz right = null, bool isRoot = false) {
            Id = id;
            Question = question;
            Left = left;
            Right = right;
            IsRoot = isRoot;

            if (Left != null) Left.Choice = "NO";
            if (Right != null) Right.Choice = "YES";
        }

        public string Id { get; set; }
        public string Question { get; set; }
        public YesNoQuiz Left { get; set; }
        public YesNoQuiz Right { get; set; }
        public bool IsRoot { get; set; }

        public string Choice { get; set; }
        public bool? Answer { get; set; }
        public bool IsSelected { get; set; }
    }
}