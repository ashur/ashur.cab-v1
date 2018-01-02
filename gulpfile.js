const fs = require( 'fs' );
const gulp = require( 'gulp' );
const rm = require( 'gulp-rm' )
const tap = require( 'gulp-tap' );

var paths =
{
	articles: {
		src: "src/articles/published",
		dest: "dist/articles"
	},

	drafts: {
		src: "src/articles/drafts",
		dest: "dist/drafts"
	},

	templates: {
		pages: "src/templates/pages",
		partials: "src/templates/partials",
	}
};


/* Articles */
var compileArticles = function( src, dest )
{
	const frontmatter = require( 'gulp-front-matter' );
	const handlebars = require( 'handlebars' );
	const layouts = require( 'handlebars-layouts' );
	const markdown = require( 'gulp-markdown' );
	const rename = require( 'gulp-rename' );
	const Wax = require( 'handlebars-wax' );

	var wax = Wax( handlebars )
		.partials( `${paths.templates.partials}/**/*.hbs` )
		.helpers( layouts );

	return gulp
		.src( src )

		.pipe( frontmatter( { property: 'metadata', remove: true } ) )

		.pipe( markdown( { smartypants: true } ) )

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

		.pipe( rename( { extname: '.html' } ) )

		.pipe( gulp.dest( dest ) );
};

gulp.task( 'articles:build', function()
{
	return compileArticles( `${paths.articles.src}/**/*.md`, paths.articles.dest );
});

gulp.task( 'drafts:build', function()
{
	return compileArticles( `${paths.drafts.src}/**/*.md`, paths.drafts.dest );
} );


/* Builds */
gulp.task( 'build:dev', ['articles:build'] );
gulp.task( 'build:dist', ['cleanup:all','articles:build'] );


/* Cleanup */
gulp.task( 'cleanup:all', ['cleanup:articles'] );

gulp.task( 'cleanup:articles', function()
{
	return gulp
		.src( `${paths.articles.dest}/**/*`, { read: false } )
		.pipe( rm() );
});
