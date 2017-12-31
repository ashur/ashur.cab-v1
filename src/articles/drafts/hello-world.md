---
title: Hello, world.
date: TBD
---

This is the beginning of a new repository, [ashur.cab][repo]. With enough gum, paperclips and dumb luck, it will eventually serve as the source for the site https://ashur.cab/rera

At each milestone, wrong turn, or other notable decision, I'll update [this article][hello-world] to reflect the new behavior.


## Structure

Original content will live in a `src` directory at the root of this repository:

```
└── src/
```

When the site is built, all contents will be generated a `dist` directory also at the root of this repository:

```
└── dist/
```

### Articles

Articles will consist of Markdown files which live in a bifurcated directory `src/articles`:

```
└── src/
    └── articles/
        ├── drafts/
        └── published/
```

When the site is built, all `.md` files in `articles/published` will be extruded\* into static HTML files:

```
├── dist/
│   └── articles/
│       └── 2018/
│           └── hello-world.html
│
└── src/
    └── articles/
        ├── drafts/
        └── published/
            └── 2018/
                └── hello-world.md

```

> 🙈 Files in `articles/drafts` will always be ignored


<!-- Links  -->
[hello-world]: https://ashur.cab/rera/articles/2018/hello-world.html
[repo]: https://github.com/ashur/ashur.cab
