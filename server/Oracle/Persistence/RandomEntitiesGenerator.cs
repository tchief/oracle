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
            var generator = new RandomGenerator((int) DateTime.UtcNow.Ticks % int.MaxValue);
            var depth = generator.Next(4, 10);

            var survey = new Survey {Name = $"{Company.Name()}", ObjectId = ObjectId.NewObjectId()};

            IReadOnlyCollection<Choice> leafs = Enumerable
                .Range(1, (int) Math.Pow(2, depth))
                .Where(i => i % 2 == 1)
                .Select(i => new Choice(i, $"{Lorem.Sentence(4)}"))
                .ToList();

            Choice BuildSurvey(string question, Choice left, Choice right) => new Choice((left.Id + right.Id) / 2, question, left, right);
            while (leafs.Count > 1) leafs = Zip(leafs, BuildSurvey);

            survey.Root = leafs.First();

            return new[] {survey};
        }

        [ExcludeFromCodeCoverage]
        private static IReadOnlyCollection<T> Zip<T>(IReadOnlyCollection<T> leafs, Func<string, T, T, T> builder) =>
            leafs.Batch(2, pair => builder($"{Lorem.Sentence(4).TrimEnd('.')}?", pair.First(), pair.Last())).ToList();


        // TODO: Consider using Prolog for this.
        public static readonly IEnumerable<Survey> PredefinedSurveys = new[] {
            new Survey {
                Name = "Doughnut", ObjectId = ObjectId.NewObjectId(), Root =
                    new Choice(
                        1,
                        "Do I want a doughnut?",
                        new Choice(2, "Maybe you want an apple?"),
                        new Choice(
                            3,
                            "Do I deserve it?",
                            new Choice(
                                4,
                                "Is it a good doughnut?",
                                new Choice(5, "Wait 'till you find a sinful unforgettable doughnut."),
                                new Choice(6, "What are you waiting for? Grab it now.")
                            ),
                            new Choice(
                                7,
                                "Are you sure?",
                                new Choice(8, "Do jumping jacks first."),
                                new Choice(9, "Get it.")
                            )
                        )
                    )
            },

            new Survey {
                Name = "Friends", ObjectId = ObjectId.NewObjectId(), Root =
                    new Choice(
                        1,
                        "Is the character a woman?",
                        new Choice(
                            2,
                            "Is the character a man?",
                            new Choice(
                                3,
                                "Is the character a kid?",
                                new Choice(4, "Wow, then I don't know."),
                                new Choice(
                                    5,
                                    "Is the character a girl?",
                                    new Choice(
                                        5,
                                        "Is the character a boy?",
                                        new Choice(4, "Wow, then I don't know."),
                                        new Choice(
                                            7,
                                            "Is the character blond?",
                                            new Choice(4, "Wow, then I don't know."),
                                            new Choice(5, "I guess the character is: Ben.")
                                        )
                                    ),
                                    new Choice(
                                        22,
                                        "Is the character blond?",
                                        new Choice(4, "Wow, then I don't know."),
                                        new Choice(5, "I guess the character is: Emma."))
                                )
                            ),
                            new Choice(
                                22,
                                "Is the character a parent?",
                                new Choice(
                                    4,
                                    "Is the character an actor?",
                                    new Choice(5, "Is the character married?", new Choice(4, "Wow, then I don't know."),
                                        new Choice(
                                            4,
                                            "Is the character one of the 6 main characters?",
                                            new Choice(4, "Wow, then I don't know."),
                                            new Choice(4, "Is the character brunet?", new Choice(4, "Wow, then I don't know."),
                                                new Choice(17, "I guess the character is: Chandler."))
                                        )
                                    ),
                                    new Choice(4, "Is the character brunet?", new Choice(4, "Wow, then I don't know."),
                                        new Choice(17, "I guess the character is: Joey."))
                                ),
                                new Choice(4, "Is the character professor?", new Choice(4, "Wow, then I don't know."),
                                    new Choice(17, "I guess the character is: Ross."))
                            )
                        ),
                        new Choice(
                            22,
                            "Is the character a parent?",
                            new Choice(
                                4,
                                "Is the character married?",
                                new Choice(4, "Is the character a singer?", new Choice(4, "Wow, then I don't know."),
                                    new Choice(4, "I guess the character is: Phoebe.")),
                                new Choice(4, "Is the character brunet?", new Choice(4, "Wow, then I don't know."), new Choice(4, "I guess the character is: Monica."))
                            ),
                            new Choice(
                                4,
                                "Is the character one of the 6 main characters?",
                                new Choice(4, "Wow, then I don't know."),
                                new Choice(4, "Is the character an Emma's parent?", new Choice(4, "Wow, then I don't know."),
                                    new Choice(17, "I guess the character is: Rachael."))
                            )
                        )
                    )
            }
        };
    }
}