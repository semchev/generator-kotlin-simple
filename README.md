# generator-kotlin-simple
Simple Kotlin generator that only adds exactly what you need to get running.

## Why?
There are other generators, some of which may no longer be maintained, or which simply have too large of a scope.
This generator is primarily designed to quickly get up and running with a basic scaffolding for a gradle-based _Kotlin_ project
without needing to rely on an IDE-based setup process and avoiding the common pitfalls (no manifest, no bundled dependencies,
not having the stdlib, etc). 

## Installation
`npm install -g generator-kotlin-simple`

## Usage
`yo kotlin-simple`

The prompts are unassuming (there are many), so you only end up with what you need, but with reasonable defaults aimed to
avoid common pitfalls if you spam the return key.

## Features
- Generate a gradle-based JVM-targeting kotlin application.

## Roadmap
I use this for work and my own interests, so I will be maintaining it and adding more usability features. These will like be
specific to my work usage and interests of course, but may be useful to others. Of course, I will review pull-requests if you 
like the project but want feature `x` and want it now! The general spirit of this project is to maintain simplicity, but this
does not mean avoiding any complexity. More complex targets will be added as subgenerators where it makes sense, with the end
goal of keeping reasonable defaults for most common uses, but flexibility where needed for more complex projects.

### Future Updates Planned (not in order):
- Prompt for reflection libs
- JavaScript-targetting generator
- Kotlin-Native generator
- Ktor scaffolding for a variety of project types, with other useful supplementary libs (JSON, requests, IOC/DE)
- Configuration storage
- Suggestions?
