using Oracle.Persistence;
using Xunit;

namespace Tests
{
    public class OracleTests
    {
        [Fact]
        public void Test() {
            RandomEntitiesGenerator.Seed();
        }
    }
}
