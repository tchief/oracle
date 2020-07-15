# Oracle

## [PLAY HERE (Github Pages + Azure)](https://tchief.github.io/oracle/)
Use hotkeys when you play (**'['**, **']'** - yes/no; **'l'** - list all; '**r**', '**s**' - restart/submit, '**0**'..'**9**' - pick another one), click on node to expand/collapse.

## Demo
![Demo v1: Gameplay](https://github.com/tchief/oracle-archived/blob/master/hotkeys.gif?raw=true "Gameplay")
![Demo v2: Doughnut](https://github.com/tchief/oracle-archived/raw/master/doughnut.gif?raw=true "Doughnut")
![Demo v3: Prophecies](https://github.com/tchief/oracle-archived/blob/master/prophecies.gif?raw=true "Prophecies")

## Notes
I focused on features, client-side, UX, CD and having fun.
There is no tests now, here's a [place](https://github.com/tchief/shop) to look for an example of my approach to tests & postman & coverage report for .NET Core API backend.
All questions are faker-generated now, I'll add some real later.

## Setup
1. Clone the repository.
2. ```cd server/Oracle && dotnet restore  && dotnet run```
3. ```cd client && npm install && ng serve```
4. Browse http://localhost:4200/oracle
