using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Oracle.Domain;
using Oracle.Persistence;
using Oracle.Web;

namespace Oracle
{
    // TODO: Serilog, Swagger, CSRF, Auth.
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddCors(options => {
                options.AddDefaultPolicy(
                    builder => { builder.WithOrigins("http://localhost:4200", "https://github.io", "https://tchief.github.io").AllowAnyMethod().AllowAnyHeader(); });
            });

            services.AddSingleton(_ => new SurveyLiteDbContext(Configuration.GetConnectionString("Default")));
            services.AddSingleton<ISurveyRepository, SurveyLiteRepository>();
            services.AddMvc(options => options.Filters.Add(typeof(CustomExceptionFilterAttribute)))
                .AddJsonOptions(options => {
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                });
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}