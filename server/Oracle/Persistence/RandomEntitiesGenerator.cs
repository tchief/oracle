using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Faker;
using FizzWare.NBuilder;
using Oracle.Domain;

namespace Oracle.Persistence
{
    [ExcludeFromCodeCoverage]
    public static class RandomEntitiesGenerator
    {
        public static IReadOnlyCollection<YesNoQuiz> Seed() {
            var generator = new RandomGenerator((int) DateTime.UtcNow.Ticks % int.MaxValue);
            var depth = generator.Next(3, 4);

            IReadOnlyCollection<YesNoQuiz> nodes = Enumerable
                .Range(0, (int) Math.Pow(2, depth))
                .Select(_ => new YesNoQuiz(Guid.NewGuid().ToString(), $"{Lorem.Sentence(4)}"))
                .ToList();

            while (nodes.Count > 1) nodes = Zip(nodes, generator);

            nodes.First().IsRoot = true;

            return nodes;
        }

        private static IReadOnlyCollection<YesNoQuiz> Zip(IReadOnlyCollection<YesNoQuiz> leafs, RandomGenerator generator) =>
            leafs.Zip(leafs.Skip(1), (a, b) => new YesNoQuiz(Guid.NewGuid().ToString(), $"{Lorem.Sentence(4).TrimEnd('.')}?", a, b)).ToList();
    }
}