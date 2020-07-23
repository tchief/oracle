using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using LanguageExt;
using LanguageExt.Common;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Oracle.Domain;
using Oracle.Persistence;
using Oracle.Web;
using Xunit;

namespace Tests
{
    public class SurveyControllerTests
    {
        [Fact]
        public async Task GetSurveys_Always_ReturnsOk()
        {
            var mockRepository = Substitute.For<ISurveyRepository>();
            mockRepository.GetSurveysAsync().Returns(RandomEntitiesGenerator.PredefinedSurveys);

            var controller = new SurveyController(mockRepository);

            var response = await controller.GetSurveysAsync();

            response.Should().NotBeNull();
            response.Result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var ok = response.Result as OkObjectResult;
            ok.Value.Should().BeAssignableTo<IEnumerable<Survey>>();
            ok.Value.Should().BeEquivalentTo(RandomEntitiesGenerator.PredefinedSurveys, opt => opt.IgnoringCyclicReferences());

            await mockRepository.Received().GetSurveysAsync();
        }

        [Fact]
        public async Task GetSurvey_ValidId_ReturnsOk()
        {
            var survey = RandomEntitiesGenerator.PredefinedSurveys.First();
            var mockRepository = Substitute.For<ISurveyRepository>();
            mockRepository.GetSurveyAsync(survey.Id).Returns(survey);

            var controller = new SurveyController(mockRepository);

            var response = await controller.GetSurveyAsync(survey.Id);

            response.Should().NotBeNull();
            response.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var ok = response as OkObjectResult;
            ok.Value.Should().BeAssignableTo<Survey>();
            ok.Value.Should().BeEquivalentTo(survey, opt => opt.IgnoringCyclicReferences());

            await mockRepository.Received().GetSurveyAsync(survey.Id);
        }

        [Fact]
        public async Task GetSurvey_InvalidId_ReturnsNotFound()
        {
            var id = "123";
            var mockRepository = Substitute.For<ISurveyRepository>();
            mockRepository.GetSurveyAsync(id).Returns(OptionAsync<Survey>.None);

            var controller = new SurveyController(mockRepository);

            var response = await controller.GetSurveyAsync(id);

            response.Should().NotBeNull();
            response.Should().BeOfType<NotFoundResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.NotFound);

            await mockRepository.Received().GetSurveyAsync(id);
        }

        [Fact]
        public async Task SubmitSurvey_ValidId_ReturnsOk()
        {
            var survey = RandomEntitiesGenerator.PredefinedSurveys.First();
            var form = new Form
            {
                SurveyId = survey.Id,
                UserName = "Elon",
                ChoicesMade = new Dictionary<string, bool>
                {
                    ["1"] = false,
                    ["2"] = false
                }
            };

            var mockRepository = Substitute.For<ISurveyRepository>();
            mockRepository.SubmitSurveyAsync(form).Returns(form);

            var controller = new SurveyController(mockRepository);

            var response = await controller.SubmitSurvey(form);

            response.Should().NotBeNull();
            response.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var ok = response as OkObjectResult;
            ok.Value.Should().BeAssignableTo<Form>();
            ok.Value.Should().BeEquivalentTo(form, opt => opt.IgnoringCyclicReferences());

            await mockRepository.Received().SubmitSurveyAsync(form);
        }

        [Fact]
        public async Task SubmitSurvey_InvalidId_ReturnsError()
        {
            var form = new Form
            {
                SurveyId = "123",
                UserName = "Elon",
                ChoicesMade = new Dictionary<string, bool>
                {
                    ["1"] = false,
                    ["2"] = false
                }
            };

            var error = Error.New($"Survey was not found by {form.SurveyId}");
            var mockRepository = Substitute.For<ISurveyRepository>();
            mockRepository.SubmitSurveyAsync(form).Returns(error);

            var controller = new SurveyController(mockRepository);

            var response = await controller.SubmitSurvey(form);

            response.Should().NotBeNull();
            response.Should().BeOfType<ObjectResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);

            var ok = response as ObjectResult;
            ok.Value.Should().BeAssignableTo<Error>();
            ok.Value.Should().BeEquivalentTo(error, opt => opt.IgnoringCyclicReferences());

            await mockRepository.Received().SubmitSurveyAsync(form);
        }
    }
}
