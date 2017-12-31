---
title: Hello, world.
date: TBD
---

This is the beginning of a new repository, [ashur.cab][repo]. With enough gum, paperclips and dumb luck, it will eventually serve as the source for the site https://ashur.cab/rera

At each milestone, wrong turn, or other notable decision, I'll update [this article][hello-world] to reflect the new behavior.


## Structure

Original content lives in a `src` directory at the root of this repository:

```
└── src/
```

When the site is built, all contents are generated a `dist` directory also at the root of this repository:

```
└── dist/
```

### Articles

Articles consist of Markdown files which live in a bifurcated directory `src/articles`:

```
└── src/
    └── articles/
        ├── drafts/
        └── published/
```

When the site is built, all `.md` files in `articles/published` are copied verbatim into the same relative location inside `dist/articles/`:

```
├── dist/
│   └── articles/
│       └── 2018/
│           └── hello-world.md
│
└── src/
    └── articles/
        ├── drafts/
        └── published/
            └── 2018/
                └── hello-world.md

```

> 🙈 Files in `articles/drafts` will always be ignored


## Building

> 🥤 Builds are handled by [Gulp][gulp] tasks. For example:
>
> ```
> $ gulp build:dev
> ```

The entire site can be built using `build:dev` or `build:dist`, depending on need.

### Articles

Articles can be built independently using the `articles:build` task.


<!-- Links  -->
[gulp]: https://gulpjs.org
[hello-world]: https://ashur.cab/rera/articles/2018/hello-world.html
[repo]: https://github.com/ashur/ashur.cab
