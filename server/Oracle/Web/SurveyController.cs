using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<ActionResult<Form>> SubmitSurvey([FromBody] Form form)
            => Ok(await _repository.SubmitSurveyAsync(form));
    }
}
