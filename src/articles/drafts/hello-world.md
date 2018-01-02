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

When the site is [built](#building), all contents are generated in a sibling directory `dist`:

```
└── dist/
```

> 🙈 `dist` is [ignored][gh-.gitignore] to prevent all generated contents from being added to the repository's history

### Articles

Articles consist of Markdown files which live in a bifurcated directory `src/articles`:

```
└── src/
    └── articles/
        ├── drafts/
        └── published/
```

When articles are built, each `.md` file in `articles/published` is processed as follows.

[Frontmatter][gulp-frontmatter] is stripped from the file contents and added to a file object available to Gulp tasks:

```javascript
.pipe( frontmatter( { property: 'metadata', remove: true } ) )
```

The remaining contents of the file (i.e., the article contents) are [converted from Markdown][gulp-markdown] to HTML (with a dash of smartquote conversion for good measure):

```javascript
.pipe( markdown( { smartypants: true } ) )
```

The resulting HTML and article metadata are passed into a single [Handlebars][handlebars] template [article.hbs][gh-article.hbs], and the file's contents are updated accordingly:

```javascript
.pipe( tap( function( file )
{
    var article = {};
    article.contents = file.contents.toString();
    article.metadata = file.metadata;

    var source = fs.readFileSync( `${paths.templates.partials}/article.hbs`, 'utf8' );
    var template = wax.compile( source );
    var rendered = template( article );

    file.contents = Buffer.from( rendered );

} ) )
```

The file extension is changed from `.md` to `.html`

```javascript
.pipe( rename( { extname: '.html' } ) )
```

Finally, the transformed file is copied into the same relative location inside `dist/articles/`:

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


## Building

> 🥤 Builds are handled by [Gulp][gulp] tasks. For example:
>
> ```
> $ gulp build:dev
> ```

The entire site can be built using `build:dev` or `build:dist`, depending on need.

When building for `dist`, the `cleanup:all` task is run automatically to ensure that the contents of `dist/` are pristine.


### Articles

Articles can be built independently using the `articles:build` task.


<!-- Links  -->
[gh-.gitignore]: https://github.com/ashur/ashur.cab/blob/master/.gitignore
[gh-article.hbs]: https://github.com/ashur/ashur.cab/blob/master/src/templates/partials/article.hbs
[gulp]: https://gulpjs.com
[gulp-frontmatter]: https://www.npmjs.com/package/gulp-front-matter
[gulp-markdown]: https://www.npmjs.com/package/gulp-markdown
[handlebars]: http://handlebarsjs.com
[hello-world]: https://ashur.cab/rera/articles/2018/hello-world.html
[repo]: https://github.com/ashur/ashur.cab
