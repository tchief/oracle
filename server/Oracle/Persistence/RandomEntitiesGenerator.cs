using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Faker;
using FizzWare.NBuilder;
using LiteDB;
using MoreLinq;
using Oracle.Domain;

namespace Oracle.Persistence
{
    [ExcludeFromCodeCoverage]
    public static class RandomEntitiesGenerator
    {
        public static IReadOnlyCollection<Survey> SeedSurveys() {
            var generator = new RandomGenerator((int)DateTime.UtcNow.Ticks % int.MaxValue);
            var depth = generator.Next(4, 10);

            var survey = new Survey {Name = $"{Company.Name()}", ObjectId = ObjectId.NewObjectId()};

            IReadOnlyCollection<Choice> nodes = Enumerable
                .Range(1, (int) Math.Pow(2, depth))
                .Where(i => i % 2 == 1)
                .Select(i => new Choice(i, $"{Lorem.Sentence(4).TrimEnd('.')}?"))
                .ToList();

            Choice BuildSurvey(string question, Choice left, Choice right) => new Choice((left.Id+right.Id)/2, question, left, right);
            while (nodes.Count > 1) nodes = Zip(nodes, BuildSurvey);

            survey.Root = nodes.First();

            return new []{ survey };
        }


        private static IReadOnlyCollection<T> Zip<T>(IReadOnlyCollection<T> leafs, Func<string, T, T, T> builder) =>
            leafs.Batch(2, pair => builder($"{Lorem.Sentence(4).TrimEnd('.')}?", pair.First(), pair.Last())).ToList();
    }
}