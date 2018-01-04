const fs = require( 'fs' );
const gulp = require( 'gulp' );
const rm = require( 'gulp-rm' )
const tap = require( 'gulp-tap' );
const yaml = require( 'js-yaml' );

/* Config */
var config = yaml.safeLoad( fs.readFileSync( 'config.yml', 'utf8' ) );

var paths =
{
	articles: {
		src: "src/articles/published",
		dest: `dist/${config.articles.path}`
	},

	drafts: {
		src: "src/articles/drafts",
		dest: "dist/drafts"
	},

	s3: {
		dest: config.s3.path
	},

	templates: {
		pages: "src/templates/pages",
		partials: "src/templates/partials",
	}
};


/* Articles */
var compileArticles = function( src, dest )
{
	const dateFormat = require( 'dateFormat' );
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

			if( article.metadata.date )
			{
				/* Adjust for local timezone offset */
				article.metadata.date.setMinutes( article.metadata.date.getTimezoneOffset() );

				article.metadata.date = dateFormat( article.metadata.date, config.articles.date_format );
			}

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
gulp.task( 'build:dist', ['clean:all','articles:build'] );


/* Deploy */
var uploadDist = function()
{
	const s3 = require( 'gulp-s3' );

	var aws = {
		bucket: config.s3.bucket,
		region: config.s3.region,
		key: process.env.ASHCAB_AWS_KEY,
		secret: process.env.ASHCAB_AWS_SECRET,
	};

	var options = {
		uploadPath: `${paths.s3.dest}/`,
		failOnError: true
	};

	return gulp
		.src( 'dist/**/*' )
		.pipe( s3( aws, options ) );
};

gulp.task( 'deploy', ['build:dist'], function()
{
	return uploadDist();
} );

gulp.task( 'deploy:invalidate', ['build:dist'], function()
{
	return uploadDist()
		.on( 'end', function()
		{
			const Void = require( 'void' );

			var cloudfront = {
				accessKeyId: process.env.ASHCAB_AWS_KEY,
				secretAccessKey: process.env.ASHCAB_AWS_SECRET,
				distribution: process.env.ASHCAB_AWS_DISTRIBUTION_ID,
				checkDelay: 1,
				paths: [ `/${paths.s3.dest}/*` ],
			};

			var v = new Void( cloudfront );
		} );
} );


/* Cleanup */
var clean = function( target )
{
	return gulp
		.src( `${target}/**/*`, { read: false } )
		.pipe( rm() )
		.on( 'end', function()
		{
			return gulp
				.src( target, { read: false } )
				.pipe( rm() );
		});
};

gulp.task( 'clean:all', function()
{
	return clean( 'dist' );
});

gulp.task( 'clean:articles', function()
{
	return clean( paths.articles.dest );
});

gulp.task( 'clean:drafts', function()
{
	return clean( paths.drafts.dest );
});
