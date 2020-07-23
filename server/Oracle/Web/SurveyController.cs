using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NickDarvey.LanguageExt.AspNetCore;
using Oracle.Domain;

namespace Oracle.Web
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveyController : ControllerBase
    {
        private readonly ISurveyRepository _repository;
        public SurveyController(ISurveyRepository repository) => _repository = repository;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Survey>>> GetSurveysAsync()
            => Ok(await _repository.GetSurveysAsync());

        [HttpGet("{id}")]
        public Task<IActionResult> GetSurveyAsync(string id)
            => _repository.GetSurveyAsync(id).ToActionResult();

        [HttpPost]
        public Task<IActionResult> SubmitSurvey([FromBody] Form form)
            => _repository.SubmitSurveyAsync(form).ToActionResult();
    }
}
