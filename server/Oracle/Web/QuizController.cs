using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Oracle.Domain;

namespace Oracle.Web
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _repository;
        public QuizController(IQuizRepository repository) => _repository = repository;

        [HttpGet("{id}")]
        public async Task<ActionResult<YesNoQuiz>> GetQuizAsync(string id)
            => Ok(await _repository.GetQuizAsync(id));

        [HttpGet]
        public async Task<ActionResult<IEnumerable<YesNoQuiz>>> GetQuizzesAsync()
            => Ok(await _repository.GetQuizzesAsync());

        [HttpPost]
        public async Task<ActionResult<YesNoQuiz>> SubmitQuiz(YesNoQuiz quiz)
            => Ok(await _repository.SubmitQuiz(quiz));
    }
}
